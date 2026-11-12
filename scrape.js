const puppeteer = require("puppeteer-core");
const fs = require("fs");

async function scrapeWebsite() {
    const url = process.env.SCRAPE_URL || process.argv[2];

    if (!url) {
        console.error("Error: Please provide SCRAPE_URL");
        process.exit(1);
    }

    let browser;

    try {
        console.log(`Starting scraper for: ${url}`);

        browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        const scrapedData = await page.evaluate(() => {
            const heading = document.querySelector("h1");

            const description = document.querySelector(
                'meta[name="description"]'
            );

            return {
                title: document.title,
                heading: heading ? heading.innerText.trim() : null,
                description: description
                    ? description.content
                    : null,
                url: window.location.href,
                scrapedAt: new Date().toISOString()
            };
        });

        fs.writeFileSync(
            "scraped_data.json",
            JSON.stringify(scrapedData, null, 4)
        );

        console.log("Scraping completed successfully!");
        console.log(scrapedData);

    } catch (error) {
        console.error("Scraping failed:", error.message);
        process.exitCode = 1;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

scrapeWebsite();
