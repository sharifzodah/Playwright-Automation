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
        this.applyCoupon = page.locator("[type='submit']");
        this.placeOrder = page.locator('.action__submit');
        this.cartItemsBox = page.locator('.col-md-5')
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

    async verifyItemsInPaymentSection2(productsAddedToCart)
    {
        const productsFromCart = [];
        for(let i=0; i<productsAddedToCart.length; i++){
            const productName = await this.itemTitles.nth(i).textContent();
            console.log("Item Name: ", productName);
            this.expect(await productsAddedToCart.includes(productName)).toBeTruthy();
        }
    }

    async verifyItemsInPaymentSection(productsFromCart)
    {
        for(let i = 0; i < productsFromCart.length; i++){
            const itemTitle = await this.page.locator('.item__title').nth(i).textContent();
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
        await this.applyCoupon.click();
        await this.page.waitForLoadState('networkidle');

    }

    async placeOrder()
    {
        await this.placeOrder.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = {PaymentPage};