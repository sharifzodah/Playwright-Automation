class OrderHistoryPage {

    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.orders = page.locator('button[routerlink="/dashboard/myorders"]');
        this.ordersBox = page.locator('tbody');
        this.header = page.locator('text=Your Orders');
        this.ordersIDs = this.ordersBox.locator('tr');
        this.orderButtons = this.ordersIDs.locator('button');
        this.orderSummaryBox = page.locator('.email-container');
        this.summaryOrderId = page.locator('.col-text');
        this.summaryAddress = page.locator('.text');
        this.summaryItemName = page.locator('.artwork-card-info .title');
        this.summaryOrderPrice = page.locator('.artwork-card-info .price');
        this.backToViewOrders = page.locator('.-teal');
    }

    async loadOrdersItems() {
        await this.orders.click();
        await this.ordersBox.waitFor();
    }

    async verifyOrdersHeader() {
        await this.page.waitForLoadState('networkidle');
        const header = await this.header.textContent();
        this.expect(header.trim()).toBe('Your Orders');
    }

    async verifyLastOrderIDs(confirmedOrderIds) {
        const orderIdDetails = [];
        for (let i = 0; i < await this.ordersIDs.count(); i++) {
            const orderIdDet = await this.ordersIDs.nth(i).locator('th').textContent();
            orderIdDetails.push(orderIdDet);
        }
        console.log(orderIdDetails);

        for (let i = 0; i < confirmedOrderIds.length; i++) {
            await this.expect(orderIdDetails.includes(confirmedOrderIds[i])).toBeTruthy();
        }
        return orderIdDetails;
    }

    async verifyEachOrderDetails(orderIdDetails, productsAddedToCart, itemPrices, userName, countryName) {
        // Split view and delete buttons' locators
        console.log("View & delete buttons:", await this.orderButtons.count());
        const viewButtons = [];
        const deleteBtnLoc = [];
        for (let i = 0; i < await this.orderButtons.count(); i++) {
            if (i % 2 === 0) {
                viewButtons.push(this.orderButtons.nth(i));
            }
        }

        // Verify each order details
        console.log(productsAddedToCart);
        console.log(itemPrices);
        for (let i = 0; i < viewButtons.length; i++) {
            await viewButtons[i].click();
            await this.orderSummaryBox.waitFor();
            const orderIdSummary = await this.summaryOrderId.textContent();
            await this.expect(orderIdDetails.includes(orderIdSummary)).toBeTruthy();

            const billEmail = await this.summaryAddress.nth(0).textContent();
            const deliveryEmail = await this.summaryAddress.nth(2).textContent();
            const billCountry = await this.summaryAddress.nth(1).textContent();
            const deliveryCountry = await this.summaryAddress.nth(3).textContent();
            await this.expect(billEmail).toBe(deliveryEmail);
            await this.expect(billEmail.trim()).toBe(userName);
            await this.expect(billCountry).toBe(deliveryCountry);
            await this.expect(billCountry.includes(countryName)).toBeTruthy();

            // Check if any item in productsAddedToCart matches both the item name and price
            const summaryItemNameText = await this.summaryItemName.textContent();
            console.log(summaryItemNameText.trim());
            const summaryItemPriceText = await this.summaryOrderPrice.textContent();
            const summaryItemPriceFloat = parseFloat(summaryItemPriceText.trim().replace("$", ""), 10);
            console.log(summaryItemPriceFloat);
            await this.expect(productsAddedToCart.includes(summaryItemNameText.trim())).toBeTruthy();
            await this.expect(itemPrices.includes(summaryItemPriceFloat)).toBeTruthy();

            await this.backToViewOrders.click();
            await this.ordersBox.waitFor();
        }
    }
}

module.exports = {OrderHistoryPage};