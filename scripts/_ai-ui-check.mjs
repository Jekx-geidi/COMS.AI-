import { chromium } from "playwright";
const outDir = "C:/Users/REILJA~1/AppData/Local/Temp/claude/c--Users-ReilJakeEnga-a-Downloads-COMS-AI/9e3daa47-8778-45ca-960f-3f8c30f53c24/scratchpad";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/ask-ai", { waitUntil: "networkidle" });
await page.fill('input[placeholder="Naay brownout diri sa akong location?"]', "Naay brownout sa Talamban karon?");
await page.click('button[aria-label="Send"]');
await page.waitForSelector("text=Sample Utility Advisory", { timeout: 15000 });
await page.screenshot({ path: `${outDir}/ai-real.png` });
console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
