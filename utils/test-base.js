const {base} = require('@playwright/test');

exports.customTest = base.test.extend(
    {
        testDataForOrder: {
            userName : "qasdet1544@gmail.com",
            password : "ThisScenarioFailedNoSpecialCharactersInPwd2024",
            ccNumber : "4587 8874 6621 3315",
            CVV : "988",
            firstName : "QA SDET",
            coupon : "rahulshettyacademy",
            countryName : "United States"
        }
    }
)