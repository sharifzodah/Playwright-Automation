const {test, expect} = require('@playwright/test');
const exp = require('constants');
    
    // @positive-testCase
    test('E2E Checkout test', async ({page})=>
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
        
            const pageTitle = await page.title();
            let currentUrl = page.url();
        
            console.log(pageTitle);
            console.log(currentUrl);
            expect(pageTitle).toContain("Let's Shop");
            expect(currentUrl).toContain('/client/auth/login');
        
            const emailLoc = page.locator("[formcontrolname='userEmail']");
            const pwdLoc = page.locator("[formcontrolname='userPassword']");
            const loginBtn = page.locator('[value="Login"]');
    
            await emailLoc.fill(userLogin);
            await pwdLoc.fill(userPwd);       
            await loginBtn.click();

            await page.waitForLoadState('networkidle');
            currentUrl = page.url()
            expect(currentUrl).toContain('dashboard');
            console.log(currentUrl);

            const products = page.locator('.card-body');
            const prdCounts = await products.count();
            console.log(prdCounts);

            //Adding random two items to cart
            const productArr = [];
            for(let i=0; i < prdCounts; i++){
                let rndIndex = Math.floor(Math.random()*prdCounts);
                const prdName = await products.nth(rndIndex).locator('b').textContent();
                if(!productArr.includes(prdName)){
                productArr.push(prdName);
                const addToCart = products.nth(rndIndex).locator("text=  Add To Cart"); 
                console.log(prdName);
                await addToCart.click();  
                }
                if(productArr.length === 2){break;}
            }

            const cartBtn = page.locator('[routerlink="/dashboard/cart"]');
            await cartBtn.click();        
            currentUrl = page.url();
            expect(currentUrl).toContain('cart');

            // Cart Section
            await page.waitForLoadState('networkidle');
            const crtHeader = await page.locator("text=My Cart").textContent();
            expect(crtHeader).toBe('My Cart');

            const cart = page.locator('.cart')
            const cartArr = [];
            for(let i=0; i<productArr.length; i++){
                cartArr.push(await cart.locator('li h3').nth(i).textContent());
            }
            const itemNo = [];
            for(let i=0; i<cartArr.length; i++){
                const id = await cart.locator('p.itemNumber').nth(i).textContent();
                itemNo.push(id.replace("#", ""));
                // expect(productArr[i]).toBe(cartArr[i]);
                expect(productArr.includes(cartArr[i])).toBeTruthy();
            }
            const totalAmnt = await page.locator('span.value').last().textContent();
            console.log(totalAmnt)
            console.log(productArr);
            console.log(cartArr);
            console.log(itemNo);
            const checkOut = page.locator("text=Checkout");
            await checkOut.click();

            // Payment Section
            await page.locator('.col-md-5').waitFor();
            
            const amountArr = [];
            for(let i = 0; i < cartArr.length; i++){
                amountArr.push(await page.locator('.item__price').nth(i).textContent());
                const itemTitle = await page.locator('.item__title').nth(i).textContent();
                expect(cartArr.includes(itemTitle.trim())).toBeTruthy();
            }

            let cartTotal = 0;
            for(let i=0; i < amountArr.length; i++){
                cartTotal += parseInt(amountArr[i].replace('$', ''), 10)
            }
            console.log(cartTotal);
            expect(cartTotal).toBe(parseInt(totalAmnt.replace('$', ''), 10));

            const ccLoc = page.locator('.payment__cc input');

            for(let i=0; i<ccDetails.length; i++){
                page.locator(await ccLoc.nth(i).fill(ccDetails[i]));
            }

            await page.locator('[placeholder="Select Country"]').pressSequentially('unit', {delay: 150});
            const countryOpts = page.locator('.ta-results');
            await countryOpts.waitFor();
            const contryCount = await countryOpts.locator('button').count();

            for(let i=0; i<contryCount; i++){
                const text = await countryOpts.locator('button').nth(i).textContent();
                if( text.trim() === countryName){
                    await countryOpts.locator('button').nth(i).click();
                    break;
                }
            }
            await expect(page.locator('.user__name label')).toHaveText(userLogin);

            await page.locator("[type='submit']").click();
            await page.waitForLoadState('networkidle');

            await page.locator('.action__submit').click();
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
                expect(billEmail.trim()).toBe(userLogin);
                expect(billCountry).toBe(deliveryCountry);
                expect(billCountry.includes(countryName)).toBeTruthy();
                await page.locator('.-teal').click();
                await page.locator('tbody').waitFor();
            }



            // await page.pause()
        
        });