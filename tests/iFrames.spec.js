const { test, expect } = require("@playwright/test")

test("Handling iFrames", async({page}) =>
    {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice");

        const framePage = page.frameLocator("#courses-iframe");
        await framePage.getByRole("listitem").getByText("More").hover();
        await framePage.locator("text=About Us").nth(0).click();
        await framePage.locator(".inner-box h1").waitFor();
        await expect(framePage.locator(".inner-box h1")).toHaveText('About Us');
        console.log(await framePage.locator(".inner-box h1").textContent());
        await expect(framePage.locator(".image img")).toBeVisible();       

});

test("Handling iFrames 2", async({page}) =>
    {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice");

        const framePage = page.frameLocator("#courses-iframe");
        // await framePage.getByRole("listitem").getByText("All Access plan").click();
        await framePage.locator('li a[href="lifetime-access"]:visible').click();
        const headerText = await framePage.locator('.text h2').textContent();
        console.log(headerText.split(' ')[1]);             

});
