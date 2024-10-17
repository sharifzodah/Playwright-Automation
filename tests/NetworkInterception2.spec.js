const { test, expect, request } = require("@playwright/test");


test("Security test request intercept test", async ({ page }) => {
    const userLogin = 'qasdet1544@gmail.com';
    const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.getByPlaceholder("email@example.com").fill(userLogin);
    await page.getByPlaceholder("enter your passsword").fill(userPwd);
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForLoadState("networkidle");
    await page.locator('.card-body b').first().waitFor();

    await page.locator('button[routerlink*="myorders"]').click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6710565aae2afd4c0b9dd655' }));
    await page.locator("button:has-text('View')").first().click();
    const errorText = await page.locator(".blink_me").textContent();
    console.log(errorText);
    expect(errorText).toBe("You are not authorize to view this order");
    await expect(page.locator(".blink_me")).toHaveText("You are not authorize to view this order");

})