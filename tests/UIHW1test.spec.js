const {test, expect} = require('@playwright/test');

// @positive-testCase
test.skip('Registration test', async ({page})=>
{

    const userLogin = 'qasdet1544@gmail.com';
    const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';

    await page.goto("https://rahulshettyacademy.com/client/");

    const registerLoc = page.locator('a.text-reset');
    const pageTitle = await page.title();
    let currentUrl = page.url();

    console.log(pageTitle);
    console.log(currentUrl);
    expect(pageTitle).toContain("Let's Shop");
    expect(currentUrl).toContain('/client/auth/login');

    await registerLoc.click();

    const regHeader = await page.locator('h1.login-title').textContent();
    const firstNameLoc = page.locator("[formcontrolname='firstName']");
    const lastNameLoc = page.locator("[formcontrolname='lastName']");
    const emailLoc = page.locator("[formcontrolname='userEmail']");
    const phoneLoc = page.locator("[formcontrolname='userMobile']");
    const pwdLoc = page.locator("[formcontrolname='userPassword']");
    const pwdConfLoc = page.locator("[formcontrolname='confirmPassword']");
    const ageReqLoc = page.locator("[formcontrolname='required']");
    const genderLoc = page.locator("[formcontrolname='gender'][value='Male']");
    const submitLoc = page.locator("[type='submit']");

    await firstNameLoc.fill('qasdet13131');
    await lastNameLoc.fill('Testerr88888');
    await emailLoc.fill(userLogin);
    await phoneLoc.fill('1234567877');
    await pwdLoc.fill(userPwd);
    await pwdConfLoc.fill(userPwd);
    await ageReqLoc.click();
    await genderLoc.click();
    await page.selectOption('select[formcontrolname="occupation"]', { label: 'Engineer' });    

    await submitLoc.click();

    currentUrl = page.url();
    expect(currentUrl).toContain('register');
    expect(regHeader).toContain('Register');
    console.log(currentUrl);
    console.log(regHeader);    

    const successMsg = await page.locator('.toast-container div[aria-label]').textContent();
    expect(successMsg.trim()).toBe('Registered Successfully');
    console.log(successMsg);

    await page.locator('.banner h1.headcolor').waitFor();
    const successHeader = await page.locator('h1.headcolor').textContent();    
    expect(successHeader.trim()).toBe('Account Created Successfully');
    console.log(successHeader);

    await page.locator('.banner [routerlink="/auth"]').waitFor();
    const loginBut = page.locator('.banner [routerlink="/auth"]');
    await loginBut.click();

    await emailLoc.fill(userLogin);
    await pwdLoc.fill(userPwd);
    await submitLoc.click();
    
    await page.waitForLoadState('networkidle');
    
    const productTitles = await page.locator('.card-body b').allTextContents();
    console.log(productTitles)

    await page.locator('#sidebar').waitFor();
    currentUrl = page.url()
    expect(currentUrl).toContain('dashboard');
    console.log(currentUrl);    

    // const optionLoc = page.locator("[formcontrolname='occupation']");
    // console.log(optionLoc.textContent());
    // const optionArr = await page.$$("select[formcontrolname='occupation'] option");
    // for(const option in optionArr){
    //     const optionText = await option.innerText();
    //     console.log(optionText);
    //     // const optionValue = await option.getAttribute('value');
    //     // optionsArr.push({text: optionText, value: optionValue})
    //     // console.log(`Option Text: ${optionText}, Value: ${optionValue}`);
    //     if (optionText.trim() === 'Engineer'){
    //         await option.click();
    //         console.log('$optionText selected');
    //         break;
    //     }
    // }

});

// @negative-testCase
test('Fail to Register test', async ({page})=>
    {

        const userLogin = 'qasdet154455@gmail.com';
        const userPwd = 'pwt2024!';
    
        await page.goto("https://rahulshettyacademy.com/client/");
    
        const registerLoc = page.locator('a.text-reset');
        const pageTitle = await page.title();
        let currentUrl = page.url();
    
        console.log(pageTitle);
        console.log(currentUrl);
        expect(pageTitle).toContain("Let's Shop");
        expect(currentUrl).toContain('/client/auth/login');
    
        await registerLoc.click();
    
        const regHeader = await page.locator('h1.login-title').textContent();
        const firstNameLoc = page.locator("[formcontrolname='firstName']");
        const lastNameLoc = page.locator("[formcontrolname='lastName']");
        const emailLoc = page.locator("[formcontrolname='userEmail']");
        const phoneLoc = page.locator("[formcontrolname='userMobile']");
        const pwdLoc = page.locator("[formcontrolname='userPassword']");
        const pwdConfLoc = page.locator("[formcontrolname='confirmPassword']");
        const ageReqLoc = page.locator("[formcontrolname='required']");
        const genderLoc = page.locator("[formcontrolname='gender'][value='Male']");
        const submitLoc = page.locator("[type='submit']");
    
        await firstNameLoc.fill('qasdet13131');
        await lastNameLoc.fill('Testerr88888');
        await emailLoc.fill(userLogin);
        await phoneLoc.fill('1234567877');
        await pwdLoc.fill(userPwd);
        await pwdConfLoc.fill(userPwd);
        await ageReqLoc.click();
        await genderLoc.click();
        await page.selectOption('select[formcontrolname="occupation"]', { label: 'Engineer' });    
        await submitLoc.click();
        
        try{
            await page.waitForURL('**/*register*');
            const alertMsg = await page.locator("[role='alert']").textContent();
            expect(alertMsg).toContain('Special');
            console.log(alertMsg);
        } catch(error){
            console.error('Registration Successful');
        }

    });

    // @positive-testCase
test('Successful Login test', async ({page})=>
    {
    
        const userLogin = 'qasdet1544@gmail.com';
        const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
    
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
        
        const productTitles = await page.locator('.card-body b').allTextContents();
        console.log(productTitles)
    
        await page.locator('#sidebar').waitFor();
        currentUrl = page.url()
        expect(currentUrl).toContain('dashboard');
        console.log(currentUrl);

    
    });

       // @negative-testCase
test('Fail to Login test', async ({page})=>
    {    
        const userLogin = 'qasdet154455@gmail.com';
        const userPwd = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
    
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
        
        const errorMsg = await page.locator('.toast-container div[aria-label]').textContent();
        expect(errorMsg.trim()).toBe('Incorrect email or password.');
        console.log(errorMsg);
    
    });