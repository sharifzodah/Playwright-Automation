const {test, expect, request} = require('@playwright/test');

const loginPayload = {userEmail: "qasdet1544@gmail.com", userPassword: "ThisScenarioFailedNoSpecialCharactersInPwd2024"}; 
let token;

test.beforeAll( async ()=>
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data: loginPayload

        });

    expect(loginResponse.ok()).toBeTruthy();
    const responseJson = await loginResponse.json();
    token = responseJson.token;
    console.log(token);        

});


// @positive-testCase
test.skip('Place Order test', async ({page})=>
    {
        await page.addInitScript(value => {
            window.localStorage.setItem('token', value);
        }, token);

        const ccNumber = '4587 8874 6621 3315';
        const cvv = '988';
        const name = 'QA SDET';
        const coupon = 'rahulshettyacademy';
        const ccDetails = [ccNumber, cvv, name, coupon];
        const countryName = 'United States'
                
        await page.goto("https://rahulshettyacademy.com/client/");

        await page.locator('.card-body b').first().waitFor();
        await page.locator('.card-body').filter({hasText: "IPHONE 13 PRO"})
        .getByRole("button", {name: "Add To Cart"}).click();
        await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click();
        await page.locator("div li").first().waitFor();
        await expect(page.getByText("IPHONE 13 PRO")).toBeVisible();
        await page.getByRole("button", {name: "Checkout"}).click();
        await page.getByPlaceholder("Select Country").pressSequentially("united");
        await page.getByRole("button", {name: "United States"}).nth(1).click();
        await page.getByText("PLACE ORDER").click();
        await expect(page.getByText("Thankyou for the order.")).toBeVisible();
        const orderId = await page.locator("td label").nth(1).textContent();

    });

     // @positive-testCase
     test('Delete 1 order w/Special Locators test', async ({page})=>
        {
            const ccNumber = '4587 8874 6621 3315';
            const cvv = '988';
            const name = 'QA SDET';
            const coupon = 'rahulshettyacademy';
            const ccDetails = [ccNumber, cvv, name, coupon];
            const countryName = 'United States'

            await page.goto("https://rahulshettyacademy.com/client/");
            
            await page.locator('.card-body b').first().waitFor();
            await page.getByRole("listitem").getByRole("button", {name: "ORDERS"}).click();
            // await page.getByRole("button", {name: "ORDERS"}).click();
            await page.waitForLoadState("networkidle");
            await page.locator('tbody').waitFor();
            let currentUrl = page.url();
            expect(currentUrl).toContain('/myorders');

            const initialOrderCount = await page.locator("tbody tr").count();
            console.log('Initial Order Count: ', initialOrderCount);
            await page.locator("tbody tr").nth(0).getByRole("button", {name: "Delete"}).click();
            await page.locator('[role = "alert"]').waitFor();
            console.log(await page.locator('[role = "alert"]').textContent());
            await page.waitForTimeout(500);
            const remainingOrderCount = await page.locator("tbody tr").count();
            console.log('Remaining Order Count: ', remainingOrderCount);
            expect(remainingOrderCount).toBe((initialOrderCount - 2));            

        });