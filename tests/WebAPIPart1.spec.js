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
test('Place Order test', async ({page})=>
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