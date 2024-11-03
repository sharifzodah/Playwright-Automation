class CartPage
{
    constructor(page, expect)
    {
        this.page = page;
        this.expect = expect;
        this.header = page.locator("text=My Cart");
        this.cartBox = page.locator('.cart');
        this.cartItems = this.cartBox.locator("li");
        this.itemIDs = this.cartItems.locator("p.itemNumber");   
        this.itemPrices = page.locator(".prodTotal p");
        this.totalAmount = page.locator('span.value').last();
        this.checkOutBtn = page.locator("text=Checkout");
    }

    async verifyHeader()
    {
        await this.page.waitForLoadState('networkidle');
        this.expect(await this.header.textContent()).toBe('My Cart');
    }

    async verifyAddedItemsInCart(productsAddedToCart)
    {
        const productsFromCart = [];
        await this.page.waitForLoadState('networkidle');
        for(let i=0; i<productsAddedToCart.length; i++){
            let productNo = await this.itemIDs.nth(i).textContent();
            productNo = productNo.replace("#", "");
            const productName = await this.cartItems.locator('h3').nth(i).textContent();
            productsFromCart.push({productNo, productName});
            console.log("Item No: ", productNo, " | ",  "Item Name: ", productName);
            this.expect(productsAddedToCart.includes(productsFromCart[i].productName)).toBeTruthy();
        }
        return productsFromCart;
    }

    async verifyTotalAmount(itemCount)
    {
        let totalAmount = await this.totalAmount.textContent();
        totalAmount = parseFloat(totalAmount.replace("$", ""), 10);

        let itemsTotal = 0
        for(let i = 0; i < itemCount; i++){
            let itemPrice = await this.itemPrices.nth(i).textContent();
            itemsTotal += parseFloat(itemPrice.replace("$", ""), 10);
        }
        console.log("Total Amount:\t$",totalAmount, "\nItems Total:\t$",itemsTotal);
        this.expect(totalAmount).toBe(itemsTotal);
        return totalAmount;
    }

    async checkOut()
    {
        await this.checkOutBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = {CartPage};