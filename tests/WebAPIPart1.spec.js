const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayload = {userEmail: "qasdet1544@gmail.com", userPassword: "ThisScenarioFailedNoSpecialCharactersInPwd2024"}; 
const orderPayload = {orders: [{country: "United States", productOrderedId: "6581ca979fd99c85e8ee7faf"}]};
let response;

test.beforeAll( async ()=>
{
    const apiContext = await request.newContext();     
    const apiUtils = new APIUtils(apiContext, loginPayload);   
    response = await apiUtils.createOrder(orderPayload);

});

//To debug API test case: 1. Add "npx playwright test tests/WebAPIPart1.spec.js --headed" in test section of package.json file
//                        2. Add a breakpoint on line that runs API requests
//                        3. Increase timeout value to e.g. 100 * 1000 in playwright.config.js file
//                        4. Ctrl+Shift P => type Debug npm Script

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

     // @positive-testCase
     test('Delete 1 order w/Special Locators test', async ({page})=>
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
            await page.waitForLoadState("networkidle");
            const remainingOrderCount = await page.locator("tbody tr").count();
            console.log('Remaining Order Count: ', remainingOrderCount);
            expect(remainingOrderCount).toBe((initialOrderCount - 1));            

        });

        // @positive-testCase
    test.only('Place Order w/API test', async ({page})=>
        {
            await page.addInitScript(value => {
                window.localStorage.setItem('token', value);
            }, response.token);           

            await page.goto("https://rahulshettyacademy.com/client/");
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
            await page.locator('tbody').waitFor();
            const orderIdsLoc = page.locator('tbody tr');

            for(let i=0; i<await orderIdsLoc.count(); i++){
                const orderIdDetail = await orderIdsLoc.nth(i).locator('th').textContent();
                if(response.orderId.includes(orderIdDetail)){
                    console.log(orderIdDetail);
                    await orderIdsLoc.nth(i).locator("button").first().click();
                    break;
                }
            }
            const orderIdSummary = await page.locator(".col-text").textContent();
            expect(response.orderId.includes(orderIdSummary)).toBeTruthy();
            

        });     