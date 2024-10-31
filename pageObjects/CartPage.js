class CartPage
{
    constructor(page)
    {
        this.page = page;
        this.header = page.locator("text=My Cart");
        this.cartBox = page.locator('.cart');
        this.cartItems = this.cartBox.locator("li");
        this.itemIDs = this.cartItems.locator("p.itemNumber");   
        this.itemPrices = page.locator(".prodTotal");
        this.totalAmount = page.locator('span.value').last().textContent();
    }

    async verifyHeader()
    {
        expect(this.header).toBe('My Cart');
    }

    async verifyAddedItemsInCart(productsAddedToCart)
    {
        const productsFromCart = [];
        for(let i=0; i<productsAddedToCart.length; i++){
            let productNo = await this.itemIDs.nth(i).textContent();
            productNo = productNo.replace("#", "");
            const productName = await this.cartItems.locator('h3').nth(i).textContent();
            productsFromCart.push({productNo, productName});
            console.log("Item No: ", productNo, " | ",  "Item Name: ", productName);
            expect(productsAddedToCart.includes(productsFromCart[i].productName)).toBeTruthy();
        }
    }
}

module.exports = {CartPage};