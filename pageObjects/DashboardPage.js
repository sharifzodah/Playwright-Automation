class DashboardPage
{
    constructor(page)
    {
        this.page = page;
        this.products = page.locator('.card-body');
        this.cartButton = page.locator('[routerlink="/dashboard/cart"]');
        this.myCart = page.locator(".cart");
    }

    async addToCartRandomItems(itemNumber)
    {
        let productCount = await this.products.count();
        const productArr = [];
        console.log(productCount);
        while(productArr.length !== itemNumber){
            let randomIndex = Math.floor(Math.random()*itemNumber);
            console.log(randomIndex);
            const productName = await this.products.nth(randomIndex).locator('b').textContent();
            if(!productArr.includes(productName))
                {
                    productArr.push(productName);
                    const addToCart = await this.products.nth(randomIndex).locator("text=  Add To Cart"); 
                    console.log(productName);
                    await addToCart.click();  
                }
            // if(productArr.length === itemNumber){break;}
        }
        return productArr;
    }

    async navigateToCart()
    {
        await this.cartButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getDashboardURL()
    {
        await this.page.waitForLoadState('networkidle');
        const currentUrl = await this.page.url();        
        console.log(currentUrl);
        return currentUrl;
    }
}

module.exports = {DashboardPage};