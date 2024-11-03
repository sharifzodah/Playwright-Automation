const base = require('@playwright/test');

exports.customTest = base.test.extend(
    {
        testDataForOrder: {
            userName : "sharifzodah@gmail.com",
            password : "Rahul2024!",
            ccNumber : "4587 8874 6621 3315",
            CVV : "988",
            firstName : "QA SDET",
            coupon : "rahulshettyacademy",
            countryName : "United States"
        }
    }
)