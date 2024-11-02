class ConfirmationPage {
    constructor(page, expect, fs) {
        this.page = page;
        this.expect = expect;
        this.fs = fs;
        this.orderConfBoxes = page.locator('.box');
        this.orderConfHeader = page.locator('.hero-primary');
        this.orderConfSummary = page.locator('.order-summary .title');
        this.orderConfItemIds = page.locator('.em-spacer-1').nth(1);
        this.orderConfEmail = page.locator('.links');
        this.downloadBtns = page.locator(".mb-3").filter({hasText: "Download"});
    }
    async verifyOrderConfirmationSummaryDetails(productsFromCart, totalAmount) {
        //verify header
        await this.expect(this.orderConfHeader).toHaveText(" Thankyou for the order. ");
        console.log(await this.orderConfHeader.textContent());

        //verify email, product names and products total amount
        const idBox = this.orderConfBoxes.nth(0);
        const summaryBox = this.orderConfBoxes.nth(1);
        const OrderIdString = await idBox.locator(this.orderConfItemIds).textContent();
        const orderIDs = OrderIdString.split('|').map(item => item.trim()).filter(Boolean);
        console.log(orderIDs);
        console.log(productsFromCart);

        const itemSummary = summaryBox.locator(this.orderConfSummary);
        const itemNames = [];
        let itemsTotal = 0;
        for (let i = 0; i < productsFromCart.length * 2; i++) {
            if (i % 2 === 0) {
                let item = await itemSummary.nth(i).textContent();
                itemNames.push(item);
                console.log("item name:\t", item);
            }
            else {
                let itemPrice = await itemSummary.nth(i).textContent();
                itemsTotal += parseFloat(itemPrice.replace("$", ""), 10);
                console.log("item price:\t", itemPrice, "\nitems Sub Total:", itemsTotal);
            }
        }
        //verify total amount
        this.expect(itemsTotal).toBe(totalAmount);

        //verify item names
        for (let i = 0; i < productsFromCart.length; i++) {
            await this.expect(itemNames.includes(productsFromCart[i].productName)).toBeTruthy();
        }

        //verify support email
        const emailFromSite = this.orderConfBoxes.nth(2).locator(this.orderConfEmail);
        const supportEmail = "dummywebsite@rahulshettyacademy.com";
        await this.expect(emailFromSite).toHaveText(supportEmail);

        return orderIDs;
    }

    async downloadInvoice(){
        const filePath = ["D:\\Downloads_2017\\order-invoice_qasdet1544.csv",
            "D:\\Downloads_2017\\order-invoice_qasdet1544.xlsx"];
        const downloadPromise = this.page.waitForEvent("download");
        const buttonCounts = await this.downloadBtns.count();
        for(let i = 0; i < buttonCounts; i++){
            await this.downloadBtns.nth(i).click();
            const download = await downloadPromise;
            await download.saveAs(filePath[i]);
            //deleting files
            this.fs.unlink(filePath[i], (err) => {
            if (err) {
                console.log("Error deleting file: ", err);
            } else {
                console.log("File deleted successfully.");
            }
        });
        }
    }
}

module.exports = { ConfirmationPage };