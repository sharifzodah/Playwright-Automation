const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
const { customTest } = require('../utils/test-base');
const fs = require('fs'); // Import file system module

// @positive-testCase
test('E2E Checkout test', async ({ page }) => {
    const userName = 'qasdet1544@gmail.com';
    const password = 'ThisScenarioFailedNoSpecialCharactersInPwd2024';
    const ccNumber = '4587 8874 6621 3315';
    const cvv = '988';
    const name = 'QA SDET';
    const coupon = 'rahulshettyacademy';
    const cardDetails = [ccNumber, cvv, name, coupon];
    const countryName = 'United States';
    const poManager = new POManager(page, expect, fs);

    //Landing to the page
    const loginPage = poManager.getLoginPage();
    await loginPage.landingPage();
    const pageTitle = await loginPage.getPageTitle();
    let currentUrl = await loginPage.getLoginURL();
    expect(pageTitle).toContain("Let's Shop");
    expect(currentUrl).toContain('/client/auth/login');

    //Login to the page
    await loginPage.validLogin(userName, password);

    //Adding n number of random items to cart
    const dashboardPage = poManager.getDashboardPage(page);
    currentUrl = await dashboardPage.getDashboardURL();
    expect(currentUrl).toContain('dashboard');

    const productsAddedToCart = await dashboardPage.addToCartRandomItems(4);
    await dashboardPage.navigateToCart();
    currentUrl = await dashboardPage.getDashboardURL();
    expect(currentUrl).toContain('cart');

    // Cart Section
    const cartPage = poManager.getCartPage(page, expect);
    await cartPage.verifyHeader();
    const productsFromCart = await cartPage.verifyAddedItemsInCart(productsAddedToCart);
    console.log("From cart:\t", productsFromCart.length);
    const totalAmount = await cartPage.verifyTotalAmount(productsAddedToCart.length);
    await cartPage.checkOut();

    // Payment Section
    const paymentPage = poManager.getPaymentPage(page, expect);
    await paymentPage.loadCartItems();
    await paymentPage.verifyHeader();
    await paymentPage.verifyItemsInPaymentSection(productsFromCart);
    const itemPrices = await paymentPage.verifyTotalAmount(productsAddedToCart.length, totalAmount);
    await paymentPage.verifyUserName(userName);
    await paymentPage.fillOutCardDetails(cardDetails);
    await paymentPage.fillOutShippingDetails(countryName);
    await paymentPage.applyCoupon();
    await paymentPage.placeOrder();

    // Confirmation page - Order summary verification
    const confirmationPage = poManager.getConfirmationPage(page, expect, fs);
    const confirmedOrderIds = await confirmationPage.verifyOrderConfirmationSummaryDetails(productsFromCart, totalAmount);
    await confirmationPage.downloadInvoice();

    // Order History
    const orderHistoryPage = poManager.getOrderHistoryPage(page, expect);
    await orderHistoryPage.loadOrdersItems();
    await orderHistoryPage.verifyOrdersHeader();
    const orderIdDetailsFromOrderHistory = await orderHistoryPage.verifyLastOrderIDs(confirmedOrderIds);
    await orderHistoryPage.verifyEachOrderDetails(orderIdDetailsFromOrderHistory, productsAddedToCart,
        itemPrices, userName, countryName);
    // await page.pause()
});

// @testCase with injecting test data from test-base
customTest('E2E Checkout test from test-base', async ({ page, testDataForOrder }) => {

    const cardDetails = [testDataForOrder.ccNumber, testDataForOrder.CVV, testDataForOrder.firstName, testDataForOrder.coupon];
    const poManager = new POManager(page, expect, fs);

    //Landing to the page
    const loginPage = poManager.getLoginPage();
    await loginPage.landingPage();
    const pageTitle = await loginPage.getPageTitle();
    let currentUrl = await loginPage.getLoginURL();
    expect(pageTitle).toContain("Let's Shop");
    expect(currentUrl).toContain('/client/auth/login');

    //Login to the page
    await loginPage.validLogin(testDataForOrder.userName, testDataForOrder.password);

    //Adding n number of random items to cart
    const dashboardPage = poManager.getDashboardPage(page);
    currentUrl = await dashboardPage.getDashboardURL();
    expect(currentUrl).toContain('dashboard');

    const productsAddedToCart = await dashboardPage.addToCartRandomItems(4);
    await dashboardPage.navigateToCart();
    currentUrl = await dashboardPage.getDashboardURL();
    expect(currentUrl).toContain('cart');

    // Cart Section
    const cartPage = poManager.getCartPage(page, expect);
    await cartPage.verifyHeader();
    const productsFromCart = await cartPage.verifyAddedItemsInCart(productsAddedToCart);
    console.log("From cart:\t", productsFromCart.length);
    const totalAmount = await cartPage.verifyTotalAmount(productsAddedToCart.length);
    await cartPage.checkOut();

    // Payment Section
    const paymentPage = poManager.getPaymentPage(page, expect);
    await paymentPage.loadCartItems();
    await paymentPage.verifyHeader();
    await paymentPage.verifyItemsInPaymentSection(productsFromCart);
    const itemPrices = await paymentPage.verifyTotalAmount(productsAddedToCart.length, totalAmount);
    await paymentPage.verifyUserName(testDataForOrder.userName);
    await paymentPage.fillOutCardDetails(cardDetails);
    await paymentPage.fillOutShippingDetails(testDataForOrder.countryName);
    await paymentPage.applyCoupon();
    await paymentPage.placeOrder();

    // Confirmation page - Order summary verification
    const confirmationPage = poManager.getConfirmationPage(page, expect, fs);
    const confirmedOrderIds = await confirmationPage.verifyOrderConfirmationSummaryDetails(productsFromCart, totalAmount);
    await confirmationPage.downloadInvoice();

    // Order History
    const orderHistoryPage = poManager.getOrderHistoryPage(page, expect);
    await orderHistoryPage.loadOrdersItems();
    await orderHistoryPage.verifyOrdersHeader();
    const orderIdDetailsFromOrderHistory = await orderHistoryPage.verifyLastOrderIDs(confirmedOrderIds);
    console.log(orderIdDetailsFromOrderHistory);
    // await page.pause()
});