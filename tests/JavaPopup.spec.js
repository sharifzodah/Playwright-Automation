const { test, expect } = require("@playwright/test")

test("Handling Java popups", async({page}) =>
    {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice");
        await expect(page.locator("#displayed-text")).toBeVisible();
        await page.locator("#hide-textbox").click();
        await expect(page.locator("#displayed-text")).toBeHidden();
        
        page.on("dialog", dialog => dialog.accept());
        await page.locator("#confirmbtn").click();

        await page.locator("#mousehover").hover();
        await page.locator(".mouse-hover-content").nth(0).click();
        await page.pause();

});

test("Screenshot and Visual comparison", async({page}) =>
    {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice");
        await expect(page.locator("#displayed-text")).toBeVisible();
        await page.locator("#displayed-text").screenshot({path: 'partialScreenshot.png'});
        await page.locator("#hide-textbox").click();
        await page.screenshot({path: 'screenshot.png'});
        await expect(page.locator("#displayed-text")).toBeHidden();
    });

test("Landing Page Visual comparison", async({page}) =>
        {
            // await page.goto("https://www.bankofamerica.com");
            // expect(await page.screenshot()).toMatchSnapshot('landing.png');

            await page.goto("https://www.google.com");
            expect(await page.screenshot()).toMatchSnapshot('google_home.png');

    });