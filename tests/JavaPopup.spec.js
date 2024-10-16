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