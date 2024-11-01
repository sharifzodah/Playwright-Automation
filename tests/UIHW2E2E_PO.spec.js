const {test, expect} = require('@playwright/test');
const {LoginPage} = require('../pageObjects/LoginPage');
const {DashboardPage} = require('../pageObjects/DashboardPage');
const {CartPage} = require('../pageObjects/CartPage');
const {PaymentPage} = require('../pageObjects/PaymentPage');
    
    // @positive-testCase
    test('E2E Checkout test', async ({page})=>
        {        
            const userName = 'qasdet1544@gmail.com';
            const password = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
            const ccNumber = '4587 8874 6621 3315';
            const cvv = '988';
            const name = 'QA SDET';
            const coupon = 'rahulshettyacademy';
            const cardDetails = [ccNumber, cvv, name, coupon];
            const countryName = 'United States'
            const loginPage = new LoginPage(page);
            
            //Landing to the page
            await loginPage.landingPage();
            const pageTitle = await loginPage.getPageTitle();
            let currentUrl = await loginPage.getLoginURL();
            expect(pageTitle).toContain("Let's Shop");
            expect(currentUrl).toContain('/client/auth/login');

            //Login to the page
            await loginPage.validLogin(userName, password);

            //Adding n number of random items to cart
            const dashboardPage = new DashboardPage(page);
            currentUrl = await dashboardPage.getDashboardURL();
            expect(currentUrl).toContain('dashboard');

            const productsAddedToCart = await dashboardPage.addToCartRandomItems(4);
            await dashboardPage.navigateToCart();    
            currentUrl = await dashboardPage.getDashboardURL();
            expect(currentUrl).toContain('cart');

            // Cart Section
            const cartPage = new CartPage(page, expect);
            await cartPage.verifyHeader();
            const productsFromCart = await cartPage.verifyAddedItemsInCart(productsAddedToCart);
            const totalAmount = await cartPage.verifyTotalAmount(productsAddedToCart.length);
            await cartPage.checkOut();

            // Payment Section
            const paymentPage = new PaymentPage(page, expect);
            await paymentPage.loadCartItems();
            await paymentPage.verifyHeader();
            await paymentPage.verifyItemsInPaymentSection(productsFromCart);
            await paymentPage.verifyTotalAmount(productsAddedToCart.length, totalAmount);
            await paymentPage.verifyUserName(userName);
            await paymentPage.fillOutCardDetails(cardDetails);
            await paymentPage.fillOutShippingDetails(countryName);
            await paymentPage.applyCoupon();
            await paymentPage.placeOrder();

            await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ");

            const confirmedOrderIds = [];
            for(let i=0; i<itemNo.length; i++){
                const confOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").nth(i).textContent();
                confirmedOrderIds.push(confOrderId.replaceAll("|", '').trim());
            }
            console.log(confirmedOrderIds);

            // Order History
            await page.locator('button[routerlink="/dashboard/myorders"]').click();
            await page.locator('tbody').waitFor();
            const orderIdsLoc = page.locator('tbody tr');
            const orderIdDetails = [];
            for(let i=0; i<await orderIdsLoc.count(); i++){
                const orderIdDet = await orderIdsLoc.nth(i).locator('th').textContent();
                orderIdDetails.push(orderIdDet);
            }
            console.log(orderIdDetails);

            for(let i=0; i<confirmedOrderIds.length; i++){
                expect(orderIdDetails.includes(confirmedOrderIds[i])).toBeTruthy();
            }
            // Split view and delete buttons' locators
            const orderBtnLoc = orderIdsLoc.locator('button');
            console.log(await orderBtnLoc.count());
            const viewBtnLoc = [];
            const deleteBtnLoc = [];
            for(let i=0; i< await orderBtnLoc.count();i++){
                if(i % 2 === 0){
                    viewBtnLoc.push(orderBtnLoc.nth(i));
                } 
            }

            // Verify each order details
            for(let i=0; i<viewBtnLoc.length; i++){
                await viewBtnLoc[i].click();
                await page.locator('.email-container').waitFor();
                const orderIdSummary = await page.locator('.col-text').textContent();
                expect(orderIdDetails.includes(orderIdSummary)).toBeTruthy();
                
                const addressSummary = page.locator('.text');              
                const billEmail = await addressSummary.nth(0).textContent();
                const deliveryEmail = await addressSummary.nth(2).textContent();
                const billCountry = await addressSummary.nth(1).textContent();
                const deliveryCountry = await addressSummary.nth(3).textContent();
                expect(billEmail).toBe(deliveryEmail);
                expect(billEmail.trim()).toBe(userName);
                expect(billCountry).toBe(deliveryCountry);
                expect(billCountry.includes(countryName)).toBeTruthy();
                await page.locator('.-teal').click();
                await page.locator('tbody').waitFor();
            }



            // await page.pause()
        
        });