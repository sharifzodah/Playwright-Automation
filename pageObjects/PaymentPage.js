class PaymentPage
{
    constructor(page, expect)
    {
        this.page = page;
        this.expect = expect;
        this.header = page.locator("text= Payment Method"); 
        this.itemPrices = page.locator('.item__price');
        this.itemTitles = page.locator('.item__title');
        this.cardInfo = page.locator('.payment__cc input');
        this.country = page.locator('[placeholder="Select Country"]');
        this.countryOpts = page.locator('.ta-results');
        this.countryOptsList = this.countryOpts.locator('button');
        this.userNameLabel = page.locator('.user__name label');
        this.couponButton = page.locator("[type='submit']");
        this.couponApplied = page.locator("text=* Coupon Applied");
        this.orderButton = page.locator('.action__submit');
        this.cartItemsBox = page.locator('.col-md-5');
        this.orderConfBoxes = page.locator('.box');
        this.orderConfHeader = page.locator('.hero-primary');
        this.orderConfSummary = page.locator('.order-summary .title');
        this.orderConfItemIds = page.locator('.em-spacer-1').nth(1);
        this.orderConfEmail = page.locator('.links');
    }

    async loadCartItems()
    {
        await this.cartItemsBox.waitFor();
    }

    async verifyHeader()
    {
        await this.page.waitForLoadState('networkidle');
        const header = await this.header.textContent();
        this.expect(header.trim()).toBe('Payment Method');
    }

    async verifyOrderConfirmationSummaryDetails()
    {
        //verify header
        await this.expect(this.orderConfHeader).toHaveText(" Thankyou for the order. ");
        console.log(await this.orderConfHeader.textContent());
    }

    async verifyItemsInPaymentSection(productsFromCart)
    {
        for(let i = 0; i < productsFromCart.length; i++){
            const itemTitle = await this.itemTitles.nth(i).textContent();
            console.log(itemTitle);
            this.expect(await productsFromCart.filter(product => product.productName === itemTitle)).toBeTruthy();
        }
    }

    async verifyTotalAmount(itemCount, totalAmount)
    {
        let itemsTotal = 0
        for(let i = 0; i < itemCount; i++){
            let itemPrice = await this.itemPrices.nth(i).textContent();
            itemsTotal += parseFloat(itemPrice.replace("$", ""), 10);
        }
        console.log("Total Amount:\t$",totalAmount, "\nItems Total:\t$",itemsTotal);
        this.expect(itemsTotal).toBe(totalAmount);
    }

    async verifyUserName(userName)
    {
        await this.expect(this.userNameLabel).toHaveText(userName);
    }

    async fillOutCardDetails(cardDetails)
    {
        for(let i=0; i<cardDetails.length; i++){
            this.page.locator(await this.cardInfo.nth(i).fill(cardDetails[i]));
        }
    }

    async fillOutShippingDetails(countryName)
    {
        await this.country.pressSequentially('unit', {delay: 150});
        await this.countryOpts.waitFor();
        const contryCount = await this.countryOptsList.count();

        for(let i=0; i<contryCount; i++){
            const text = await this.countryOptsList.nth(i).textContent();
            if( text.trim() === countryName){
                await this.countryOptsList.nth(i).click();
                break;
            }
        }
    }

    async applyCoupon()
    {
        await this.couponButton.click();
        await this.couponApplied.waitFor();
        console.log(await this.couponApplied.textContent());
        await this.page.waitForLoadState('networkidle');
    }

    async placeOrder()
    {
        await this.orderButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = {PaymentPage};