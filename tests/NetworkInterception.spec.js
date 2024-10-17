const {test, expect, request} = require('@playwright/test');
const {APIUtils} = require('./utils/APIUtils');

const loginPayload = {userEmail: "qasdet1544@gmail.com", userPassword: "ThisScenarioFailedNoSpecialCharactersInPwd2024"}; 
const orderPayload = {orders: [{country: "United States", productOrderedId: "6581ca979fd99c85e8ee7faf"}]};
let response;
const fakeOrderPayload = {data: [], "message": "No Orders"};

test.beforeAll( async ()=>
{
    const apiContext = await request.newContext();     
    const apiUtils = new APIUtils(apiContext, loginPayload);   
    response = await apiUtils.createOrder(orderPayload);

});
    // @positive-testCase
    test.only('Place Order w/API test', async ({page})=>
        {
            await page.addInitScript(value => {
                window.localStorage.setItem('token', value);
            }, response.token);           

            await page.goto("https://rahulshettyacademy.com/client/");
            await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", 
                //we changed userId:6707fcfdae2afd4c0b96b06e with *
                async route=>
                {
                    //Intercepting response: API response->{Playwright role: Change to Fake response}
                    //->Send response to browser->UI renders data on front end
                    const response = await page.request.fetch(route.request());
                    let body = JSON.stringify(fakeOrderPayload);
                    route.fulfill(
                        {
                            response,
                            body,
                        }
                    )
                }
            )
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
            await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
            console.log(await page.locator(".mt-4").textContent());

        });     