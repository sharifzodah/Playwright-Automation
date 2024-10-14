const {test, expect, request} = require('@playwright/test');
let webContext;

test.beforeAll( async ({browser})=>
    {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client/");
        const userLogin = 'qasdet1544@gmail.com';
        const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
        await page.getByPlaceholder("email@example.com").fill(userLogin);
        await page.getByPlaceholder("enter your passsword").fill(userPwd);
        await page.getByRole("button", {name: "Login"}).click();
        await page.waitForLoadState("networkidle");
        await context.storageState({path: "state.json"});
        webContext = await browser.newContext({storageState: "state.json"});
    
    });

// @positive-testCase
test('Add to Cart and Checkout test', async ()=>
    {
        const productName = 'ZARA COAT 3';
        const page = await webContext.newPage();
        await page.goto("https://rahulshettyacademy.com/client/");
        const products = page.locator('.card-body');
        const productTitles = await page.locator('.card-body b').allTextContents();
        console.log(productTitles);
        const productCount = await products.count();

        for(let i=0; i< productCount; i++){
            if(await products.nth(i).locator('b').textContent() === productName){
                await products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
        await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click();
        await page.locator("div li").first().waitFor();
        expect(page.getByText(productName)).toBeVisible();
        await page.getByRole("button", {name: "Checkout"}).click();
        await page.getByPlaceholder("Select Country").pressSequentially("chi");
        await page.getByRole("button", {name: "China"}).nth(0).click();
        await page.getByText("PLACE ORDER").click();
        await expect(page.getByText("Thankyou for the order.")).toBeVisible();
        const orderId = await page.locator("td label").nth(1).textContent();

    });

// @positive-testCase
test('Delete order w/Special Locators test', async ()=>
    {
        const page = await webContext.newPage();
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
