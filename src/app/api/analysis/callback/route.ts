import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { DealAnalysis } from "@/lib/types/analysis"
import { reshapeFlatToDealAnalysis } from "@/lib/n8n-reshape"
import { parseTeamReport } from "@/lib/team-report"
import { founderKey, looksLikePerson } from "@/lib/founder-links"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.ANALYSIS_CALLBACK_TOKEN
    if (!expectedToken) {
      return NextResponse.json({ error: "Callback not configured" }, { status: 500 })
    }
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const {
      analysis_id,
      job_id,
      status,
      result,
      flat_result,
      error,
      kind,
      fund_fit,
      missing_info,
      exit_potential,
    } = body
    const analysisId = analysis_id || job_id

    if (!analysisId) {
      return NextResponse.json({ error: "analysis_id or job_id required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Team-refresh callback (Flow 3, re-run after a founder LinkedIn URL is
    // pasted by hand). Flow 3 can't regenerate the team narrative on its own —
    // that needs Flow 8's reformat step — so this patches the per-founder
    // LinkedIn data it *does* produce and clears the refreshing indicator.
    //
    // The indicator is cleared unconditionally, including on a malformed or
    // empty payload: a stuck spinner is worse than a missed update, and the
    // deal keeps whatever LinkedIn data it already had.
    if (kind === "team") {
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, deal_id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }

      // Two-stage delivery: the scrape finishes ~a minute before the narrative
      // does, so Flow 3 posts an early partial with just the founders — names
      // and links land on the cards in seconds. Only the final (non-partial)
      // callback may clear the refreshing indicator; the prose is still coming.
      const partial = body.partial === true

      const incoming = Array.isArray(body.founders) ? body.founders : []
      const byName = new Map<string, { url: string; displayName: string }>()
      for (const f of incoming) {
        const url = typeof f?.linkedin_url === "string" ? f.linkedin_url : ""
        if (!/linkedin\.com\/in\//i.test(url)) continue
        const displayName = typeof f?.founder_name === "string" ? f.founder_name : ""
        // source_name is the name the portal knows the row by. The flow renames
        // founder_name off the scraped profile when the roster entry wasn't a
        // person, so keying on that alone would miss the row we came from.
        const sourceName = typeof f?.source_name === "string" ? f.source_name : ""
        for (const key of [founderKey(sourceName), founderKey(displayName)]) {
          if (key) byName.set(key, { url, displayName })
        }
      }

      const result = existing.result as DealAnalysis | null

      // The regenerated narrative. Flow 3 re-runs the whole team analysis with
      // the scraped profile in hand, so this is where "no LinkedIn profile
      // found" turns into the real background — without it we'd only relabel
      // the link and leave the prose contradicting it.
      const report = parseTeamReport(
        typeof body.team_result === "string" ? body.team_result : undefined,
      )

      if (result?.team?.founders?.length) {
        // Match on a normalised name: the stored roster often has the deck's
        // shouty "KIM VAN LAVIEREN" while the report writes "Kim van
        // Lavieren", and mismatching here would attach one founder's history
        // to another.
        const fresh = new Map(report?.founders.map((f) => [founderKey(f.name), f]) ?? [])

        const founders = result.team.founders.map((f) => {
          const k = founderKey(f.name)
          const r = fresh.get(k)
          const link = byName.get(k)
          fresh.delete(k)
          return {
            ...f,
            // Keep the existing display name so the roster doesn't reshuffle.
            ...(r
              ? {
                  role: r.role || f.role,
                  background: r.background || f.background,
                  strength: r.strength || f.strength,
                  keyConcern: r.keyConcern || f.keyConcern,
                  ...(r.linkedinUrl ? { linkedinUrl: r.linkedinUrl } : {}),
                }
              : {}),
            ...(link
              ? {
                  linkedinUrl: link.url,
                  // The roster entry was a heading, not a person ("ADDITIONAL
                  // FOUNDERS / EXECUTIVE TEAM"); the scrape knows who the
                  // pasted URL actually belongs to, so adopt that name.
                  ...(!looksLikePerson(f.name) && looksLikePerson(link.displayName)
                    ? { name: link.displayName }
                    : {}),
                }
              : {}),
          }
        })

        // Keep the saved override pointing at whatever we just renamed the
        // founder to, or the next run would fail to match it all over again.
        // Repoint founder_links rows still keyed by a handle or heading to the
        // person's real name. Name lookup covers the tagged founders; URL
        // lookup covers rows the tagger missed but the regenerated report
        // still identified (it carries each founder's LinkedIn line).
        const handle = (u: string | undefined) =>
          (u ?? "").match(/linkedin\.com\/in\/([A-Za-z0-9_\-%.]+)/i)?.[1]?.toLowerCase() ?? ""
        const nameByHandle = new Map<string, string>()
        for (const { url, displayName } of byName.values()) {
          if (handle(url) && looksLikePerson(displayName)) nameByHandle.set(handle(url), displayName)
        }
        for (const f of [...founders, ...(report?.founders ?? [])]) {
          if (handle(f.linkedinUrl) && looksLikePerson(f.name)) {
            nameByHandle.set(handle(f.linkedinUrl), f.name)
          }
        }

        const linkRows =
          (
            await supabase
              .from("founder_links")
              .select("founder_key, founder_name, linkedin_url")
              .eq("deal_id", existing.deal_id)
          ).data ?? []

        for (const row of linkRows) {
          if (looksLikePerson(row.founder_name as string)) continue
          const to =
            byName.get(founderKey(row.founder_name as string))?.displayName ??
            nameByHandle.get(handle(row.linkedin_url as string))
          if (!to || !looksLikePerson(to)) continue
          await supabase
            .from("founder_links")
            .update({ founder_key: founderKey(to), founder_name: to })
            .eq("deal_id", existing.deal_id)
            .eq("founder_key", row.founder_key as string)
        }

        // A founder the report found but the roster never had — either the
        // scrape surfaced a co-founder the deck buried, or the user added one
        // by hand. Append rather than drop.
        for (const leftover of fresh.values()) founders.push(leftover)

        // A hand-added founder exists only as a founder_links row until now, so
        // it isn't in the roster and the report may not name them either. Give
        // them a card off the scrape alone.
        const present = new Set(founders.map((f) => founderKey(f.name)))
        for (const [key, link] of byName) {
          // byName holds two keys per link (the handle it was saved under and
          // the scraped display name) — the person is already on the roster if
          // EITHER matches, otherwise adding your co-founder who's also in the
          // deck would duplicate them.
          if (
            present.has(key) ||
            present.has(founderKey(link.displayName)) ||
            !looksLikePerson(link.displayName)
          ) {
            continue
          }
          present.add(key)
          present.add(founderKey(link.displayName))
          founders.push({
            name: link.displayName,
            role: "",
            background: "",
            strength: "",
            keyConcern: "",
            linkedinUrl: link.url,
            linkedinManual: true,
            addedByUser: true,
          })
        }

        const patched: DealAnalysis = {
          ...result,
          team: {
            ...result.team,
            founders,
            ...(report?.score !== undefined ? { score: report.score } : {}),
            ...(report?.founderMarketFit ? { founderMarketFit: report.founderMarketFit } : {}),
            ...(report?.teamDynamics ? { teamDynamics: report.teamDynamics } : {}),
          },
        }
        await supabase.from("analyses").update({ result: patched }).eq("id", analysisId)
      }

      if (existing.deal_id && !partial) {
        await supabase
          .from("deals")
          .update({ team_refresh_at: null })
          .eq("id", existing.deal_id)
      }

      return NextResponse.json({ received: true, kind: "team", partial, patched: byName.size })
    }

    // Fund-fit callback (separate flow). Persists to fund_fit_result column AND, if the
    // main analysis row already has result, patches result.fundFit so the UI sees it
    // without waiting for a re-fetch.
    if (kind === "fund-fit") {
      if (!fund_fit || typeof fund_fit !== "object") {
        return NextResponse.json({ error: "fund_fit object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { fund_fit_result: fund_fit }
      if (existing.result && typeof existing.result === "object") {
        patch.result = { ...(existing.result as Record<string, unknown>), fundFit: fund_fit }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Fund-fit callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "fund-fit" })
    }

    // Missing-info callback (Flow 11). Persists to missing_info_result and patches
    // result.missingInfo so the existing UI sees it without read changes.
    if (kind === "missing-info") {
      if (!missing_info || typeof missing_info !== "object") {
        return NextResponse.json({ error: "missing_info object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { missing_info_result: missing_info }
      if (existing.result && typeof existing.result === "object") {
        patch.result = { ...(existing.result as Record<string, unknown>), missingInfo: missing_info }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Missing-info callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "missing-info" })
    }

    // Exit Potential callback (Flow 12). Same merge pattern: persist to the
    // exit_potential_result column AND patch result.exitPotential so the UI
    // sees it instantly via Realtime.
    if (kind === "exit-potential") {
      if (!exit_potential || typeof exit_potential !== "object") {
        return NextResponse.json({ error: "exit_potential object required" }, { status: 400 })
      }
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, result")
        .eq("id", analysisId)
        .maybeSingle()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      const patch: Record<string, unknown> = { exit_potential_result: exit_potential }
      if (existing.result && typeof existing.result === "object") {
        patch.result = {
          ...(existing.result as Record<string, unknown>),
          exitPotential: exit_potential,
        }
      }
      const { error: updErr } = await supabase
        .from("analyses")
        .update(patch)
        .eq("id", analysisId)
      if (updErr) {
        console.error("Exit-potential callback update error:", updErr)
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }
      return NextResponse.json({ received: true, kind: "exit-potential" })
    }

    if (status === "failed" || error) {
      await supabase
        .from("analyses")
        .update({
          status: "failed",
          error: error || "n8n reported failure",
          completed_at: new Date().toISOString(),
        })
        .eq("id", analysisId)
      return NextResponse.json({ received: true })
    }

    if (status !== "completed") {
      return NextResponse.json(
        { error: "status must be 'completed' or 'failed'" },
        { status: 400 }
      )
    }

    // Resolve final DealAnalysis: prefer pre-shaped `result`, else reshape `flat_result`
    let finalResult: DealAnalysis | null = null
    if (result && typeof result === "object") {
      finalResult = result as DealAnalysis
    } else if (flat_result && typeof flat_result === "object") {
      const { data: existing } = await supabase
        .from("analyses")
        .select("id, deal_id, created_at")
        .eq("id", analysisId)
        .single()
      if (!existing) {
        return NextResponse.json({ error: "analysis row not found" }, { status: 404 })
      }
      finalResult = reshapeFlatToDealAnalysis(flat_result as Record<string, string | undefined>, {
        dealId: existing.deal_id,
        analysisId: existing.id,
        createdAt: existing.created_at,
      })
    } else {
      return NextResponse.json(
        { error: "either 'result' (DealAnalysis) or 'flat_result' (n8n flat object) must be provided" },
        { status: 400 }
      )
    }

    const { error: updateErr } = await supabase
      .from("analyses")
      .update({
        status: "completed",
        result: finalResult,
        completed_at: new Date().toISOString(),
      })
      .eq("id", analysisId)

    if (updateErr) {
      console.error("Callback update error:", updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Fund-fit and missing-info are triggered from n8n Flow 0 (Trigger Fund Fit
    // and Trigger Missing Info nodes that run after Trigger Report). They post
    // back here with `kind: "fund-fit"` / `kind: "missing-info"` payloads above.

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
