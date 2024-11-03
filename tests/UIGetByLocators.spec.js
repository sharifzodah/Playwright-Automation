const {test, expect} = require('@playwright/test');
const path = require('path');
    
    // @positive-testCase
    test('Playwright Special Locators test', async ({page})=>
        {
        await page.goto("https://rahulshettyacademy.com/angularpractice/");
        await page.getByLabel('Check me out if you Love IceCreams!').check();
        await page.getByLabel('Employed').check();
        await page.getByLabel('Gender').selectOption('Male');
        await page.getByPlaceholder('Password').fill('abc123');
        await page.getByRole("button", {name: 'Submit'}).click();
        await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
        await page.getByRole("link", {name: "Shop"}).click();
        await page.locator("app-card").filter({hasText: "Blackberry"}).getByRole("button").click();

        });
    
    // @positive-testCase
    test('Delete order w/Special Locators test', async ({page})=>
        {
            const userLogin = 'qasdet1544@gmail.com';
            const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
            const ccNumber = '4587 8874 6621 3315';
            const cvv = '988';
            const name = 'QA SDET';
            const coupon = 'rahulshettyacademy';
            const ccDetails = [ccNumber, cvv, name, coupon];
            const countryName = 'United States'
                    
            await page.goto("https://rahulshettyacademy.com/client/");

            await page.getByPlaceholder("email@example.com").fill(userLogin);
            await page.getByPlaceholder("enter your passsword").fill(userPwd);
            await page.getByRole("button", {name: "Login"}).click();
            await page.getByRole("button", {name: "ORDERS"}).click();
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
            await page.locator("tbody tr").nth(0).getByRole("button", {name: "Delete"}).click();
            await page.locator('[role = "alert"]').waitFor();
            console.log(await page.locator('[role = "alert"]').textContent());
            await page.waitForTimeout(500);
            const remainingOrderCount = await page.locator("tbody tr").count();
            console.log('Remaining Order Count: ', remainingOrderCount);
            expect(remainingOrderCount).toBe((initialOrderCount - 2));            

        });

            // @positive-testCase
    test('Login and Checkout Special Locators test', async ({page})=>
        {
            const userLogin = 'qasdet1544@gmail.com';
            const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
            const ccNumber = '4587 8874 6621 3315';
            const cvv = '988';
            const name = 'QA SDET';
            const coupon = 'rahulshettyacademy';
            const ccDetails = [ccNumber, cvv, name, coupon];
            const countryName = 'United States'
                    
            await page.goto("https://rahulshettyacademy.com/client/");

            await page.getByPlaceholder("email@example.com").fill(userLogin);
            await page.getByPlaceholder("enter your passsword").fill(userPwd);
            await page.getByRole("button", {name: "Login"}).click();
            await page.waitForLoadState("networkidle");
            await page.locator('.card-body b').first().waitFor();
            await page.locator('.card-body').filter({hasText: "IPHONE 13 PRO"})
            .getByRole("button", {name: "Add To Cart"}).click();
            await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click();
            await page.locator("div li").first().waitFor();
            expect(page.getByText("IPHONE 13 PRO")).toBeVisible();
            await page.getByRole("button", {name: "Checkout"}).click();
            await page.getByPlaceholder("Select Country").pressSequentially("united");
            await page.getByRole("button", {name: "United States"}).nth(1).click();
            await page.getByText("PLACE ORDER").click();
            await expect(page.getByText("Thankyou for the order.")).toBeVisible();
            const orderId = await page.locator("td label").nth(1).textContent();


        });