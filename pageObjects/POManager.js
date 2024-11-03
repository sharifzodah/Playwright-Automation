const {LoginPage} = require('../pageObjects/LoginPage');
const {DashboardPage} = require('../pageObjects/DashboardPage');
const {CartPage} = require('../pageObjects/CartPage');
const {PaymentPage} = require('../pageObjects/PaymentPage');
const {ConfirmationPage} = require('../pageObjects/ConfirmationPage');
const {OrderHistoryPage} = require('../pageObjects/OrderHistoryPage');

class POManager{

    constructor(page, expect, fs){

        this.page = page;
        this.expect = expect;
        this.fs = fs;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page, this.expect);
        this.paymentPage = new PaymentPage(this.page, this.expect);
        this.confirmationPage = new ConfirmationPage(this.page, this.expect, this.fs);
        this.orderHistoryPage = new OrderHistoryPage(this.page, this.expect);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.dashboardPage;
    }

    getCartPage(){
        return this.cartPage;
    }

    getPaymentPage(){
        return this.paymentPage;
    }

    getConfirmationPage(){
        return this.confirmationPage;
    }

    getOrderHistoryPage(){
        return this.orderHistoryPage;
    }
}

module.exports = {POManager};