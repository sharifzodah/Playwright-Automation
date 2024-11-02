class ConfirmationPage
{
    constructor(page, expect)
    {
        this.orderConfBoxes = page.locator('.box');
        this.orderConfHeader = page.locator('.hero-primary');
        this.orderConfSummary = page.locator('.order-summary .title');
        this.orderConfItemIds = page.locator('.em-spacer-1').nth(1);
        this.orderConfEmail = page.locator('.links');
    }
    async verifyOrderConfirmationSummaryDetails(productsFromCart, totalAmount)
        {
            //verify header
            await this.expect(this.orderConfHeader).toHaveText(" Thankyou for the order. ");
            console.log(await this.orderConfHeader.textContent());
    
            //verify product ids, product names and products total amount
            const idBox = this.orderConfBoxes.nth(0);
            const summaryBox = this.orderConfBoxes.nth(1);
            const itemIdString = await idBox.locator(this.orderConfItemIds).textContent();
            const itemIDs = itemIdString.split('|').map(item => item.trim()).filter(Boolean);
    
            const itemSummary = summaryBox.locator(this.orderConfSummary);
            const itemNames = [];
            let itemsTotal = 0;
            for(let i = 0; i < productsFromCart.length*2; i++)
                {
                    if (i % 2 === 0)
                        {
                            let item = await itemSummary.nth(i).textContent();
                            itemNames.push(item);
                            console.log("item name:\t", item);
                        }
                        else
                        {
                            let itemPrice = await itemSummary.nth(i).textContent();
                            itemsTotal += parseFloat(itemPrice.replace("$", ""), 10);
                            console.log("item price:\t", itemPrice, "\nitems Sub Total:", itemsTotal);
                        }
                }
            this.expect(itemsTotal).toBe(totalAmount);
    
            for(let i = 0; i < productsFromCart.length; i++){
                this.expect(await productsFromCart.filter(product => product.productNo === itemIDs[i])).toBeTruthy();
                this.expect(await productsFromCart.filter(product => product.productName === itemNames[i])).toBeTruthy();
            }
    
            const linkBox = this.orderConfBoxes.nth(2);
            const supportEmail = "dummywebsite@rahulshettyacademy.com";
            await this.expect(linkBox.locator(this.orderConfEmail)).toHaveText(supportEmail);
        }
}

module.exports = {ConfirmationPage};