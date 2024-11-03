class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInbutton = page.locator('[value="Login"]');
        this.userName = page.locator("[formcontrolname='userEmail']");
        this.password = page.locator("[formcontrolname='userPassword']");
    }

    async validLogin(username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInbutton.click();
        await this.page.waitForLoadState('networkidle');
    }
    async landingPage() {
        await this.page.goto("https://rahulshettyacademy.com/client/");
        //await this.getPageTitle();
    }

    async getPageTitle() {
        const pageTitle = await this.page.title();
        console.log(pageTitle);
        return pageTitle;
    }

    async getLoginURL() {
        const currentUrl = await this.page.url();
        console.log(currentUrl);
        return currentUrl;
    }
}
module.exports = { LoginPage };