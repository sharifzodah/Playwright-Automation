const {test, expect} = require('@playwright/test');

test('Calendar test', async ({page})=>
    {
    const month = "6";
    const year = "2027";
    const date = "15";
    const expectedList = [month, date, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    await page.locator('.react-date-picker').click();
    await page.locator('.react-calendar__navigation__label').click();
    await page.locator('.react-calendar__navigation__label').click();
    await page.getByText(year).click();
    await page.locator('.react-calendar__tile').nth(Number(month)-1).click();
    await page.locator("//abbr[text()='" + date + "']").click();


    const fullDate = await page.locator('.react-date-picker__inputGroup input');
    console.log(fullDate);

    for(let i=0; i<fullDate.length; i++){
        const dateValue = fullDate[i].getAttribute('value');
        expect(dateValue).toEqual(expectedList[i]);
    }


});
 
