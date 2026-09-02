import { chromium } from "playwright";

const outDir =
  "C:/Users/REILJA~1/AppData/Local/Temp/claude/c--Users-ReilJakeEnga-a-Downloads-COMS-AI/9e3daa47-8778-45ca-960f-3f8c30f53c24/scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/calendar", { waitUntil: "networkidle" });
await page.waitForSelector("text=Brownout Calendar");
await page.screenshot({ path: `${outDir}/calendar.png` });
await page.click('button:has-text("Month")');
await page.waitForTimeout(200);
await page.screenshot({ path: `${outDir}/calendar-month.png` });

await page.goto("http://localhost:3000/community", { waitUntil: "networkidle" });
await page.waitForSelector("text=Community Signals");
await page.screenshot({ path: `${outDir}/community.png` });

await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
await page.waitForSelector("text=Live Map");
await page.screenshot({ path: `${outDir}/map.png` });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
