//playwright code
//step1  -open browser
//step2  -enter credentials
//step3  -click
//await keyword should come before each step, to achieve we need to mark our function with async keyword

const {test, expect} = require('@playwright/test');

// @negative-testCase
test('Browser Context Playwright test', async ({browser})=>
{

const context = await browser.newContext();
const page = await context.newPage();
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
console.log(await page.title())

await page.locator("[name='username']").fill('hamid1980');
await page.locator("[type='password']").fill('pwt1980');
await page.locator("#signInBtn").click();
const error_msg = await page.locator("[style*='block']").textContent();
console.log(error_msg);
expect(error_msg).toContain('Incorrect');

});

// @positive-testCase
test('Page Playwright test', async ({page})=>
{

const userName = 'rahulshettyacademy';    
const password = 'learning';

const userNameLoc = page.locator("[name='username']");
const passwordLoc = page.locator("[type='password']");
const signInLoc = page.locator("#signInBtn");


await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
const page_title = (await page.title()).toLowerCase();
expect(page_title).toContain('rahul');                   //toHaveTitle('Googl')
console.log(page_title);

let currentUrl = page.url();
console.log(currentUrl);
expect(currentUrl).toContain('loginpage');

await userNameLoc.fill(userName);
await passwordLoc.fill(password);
await signInLoc.click();

await page.waitForURL('**/*shop*')
currentUrl = page.url();
console.log(currentUrl);
expect(currentUrl).toContain('angularpractice');


const productsLoc = page.locator('.card-body a');
console.log(await productsLoc.first().textContent());
console.log(await productsLoc.nth(1).textContent());

const productList = await productsLoc.allTextContents();
console.log(productList);

await page.close();

    
});


// @positive-testCase
test('UI Controls test', async ({page})=>
    {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const userName = 'rahulshettyacademy';    
    const password = 'learning';    
    const userNameLoc = page.locator("[name='username']");
    const passwordLoc = page.locator("[type='password']");
    const signInLoc = page.locator("#signInBtn");    
    const dropDwn = page.locator('select.form-control');
    const radioBtn = page.locator('.radiotextsty').last();
    const checkTerms = page.locator('#terms');
    const blinkingURL = page.locator('[href*="documents-request"]');

    await userNameLoc.fill(userName);
    await passwordLoc.fill(password);
    await dropDwn.selectOption('stud');
    await radioBtn.click();
    await page.locator('#okayBtn').click();
    await expect(radioBtn).toBeChecked();
    await checkTerms.click();
    await expect(checkTerms).toBeChecked();
    await checkTerms.uncheck();
    expect(await checkTerms.isChecked()).toBeFalsy();
    console.log(await checkTerms.isChecked());  
    // await page.pause();
    await expect(blinkingURL).toHaveAttribute('class', 'blinkingText');

    });

    // @positive-testCase
test.only('Child window handling test', async ({browser})=>
    {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const blinkingURL = page.locator('[href*="documents-request"]');
    const userNameLoc = page.locator("[name='username']");
    const passwordLoc = page.locator("[type='password']");

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        blinkingURL.click(),
    ])
    const text = await newPage.locator('.red').textContent();
    const textArr = text.split("@");
    const domain = textArr[1].split(" ")[0];
    console.log(domain);

    await userNameLoc.fill(domain);
    await passwordLoc.fill(domain);
    console.log(await userNameLoc.textContent());

    });