// One-off: log into sam@admin.com, navigate to the SPM AI summary,
// screenshot the rendered dashboard, and overwrite the two marketing PNGs.
import puppeteer from "puppeteer-core"
import { copyFileSync } from "fs"

const CHROME = "/root/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome"
const ORIGIN = "http://localhost:3006"
const EMAIL = "sam@admin.com"
const PASSWORD = "Admin2022!!"
const DEAL_ID = "1282a91d-dda8-415b-8fbf-9d41ee089121"
const TARGET = "/root/SAM/app/public/design/hero-img-new.png"
const TARGET_2 = "/root/SAM/app/public/design/dashboard-summary.png"

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
})

try {
  const page = await browser.newPage()

  console.log("→ login")
  await page.goto(`${ORIGIN}/login`, { waitUntil: "networkidle2" })
  await page.waitForSelector('input[type="email"]', { timeout: 10000 })
  await page.type('input[type="email"]', EMAIL)
  await page.type('input[type="password"]', PASSWORD)
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ])
  console.log("  landed:", page.url())

  console.log(`→ navigate to /deals/${DEAL_ID}/summary`)
  await page.goto(`${ORIGIN}/deals/${DEAL_ID}/summary`, { waitUntil: "networkidle2", timeout: 60000 })

  // Let charts (radar etc) finish animating
  await new Promise((r) => setTimeout(r, 3500))

  console.log("→ screenshot")
  await page.screenshot({ path: TARGET, fullPage: false })
  copyFileSync(TARGET, TARGET_2)
  console.log("  wrote", TARGET)
  console.log("  wrote", TARGET_2)
} finally {
  await browser.close()
}
