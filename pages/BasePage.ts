import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
    // Plain constant
    blueColor = 'rgb(40, 116, 240)'

    // Page
    page: Page

    // Locators
    // HomePage
    overLayCloseButton: Locator
    searchBar: Locator
    searchButton: Locator

    // Search result
    lowToHighSortOption: Locator
    priceList: Locator
    sortByHeader: Locator
    overlayLoginButton: Locator

    // Pagination
    paginationNextButton: Locator
    allPaginationButtons: Locator
    addToCartButtonLocatorString: string

    // Cart
    cartButton: Locator
    cartTotalAmount: Locator
    cartDeliveryDetailsList: Locator
    cartDeliveryCostList: Locator

    constructor(page: Page) {
        this.page = page

        // HomePage
        this.overLayCloseButton = page.locator('//span[text()="✕"]')
        this.searchBar = page.getByPlaceholder('Search for Products, Brands and More')
        this.searchButton = page.getByLabel('Search for Products, Brands and More')
        
        // Search result
        this.lowToHighSortOption = page.getByText('Price -- Low to High')
        this.priceList = page.locator('//a[@rel="noopener noreferrer"]//div[@class="Nx9bqj" and contains(text(),"₹")]')
        this.sortByHeader = page.getByText('Sort By')
        this.overlayLoginButton = page.getByRole('button', {name: 'LOGIN'})
        
        // Pagination
        this.paginationNextButton = page.locator('nav > a[href*="page"] > span', {hasText : 'Next'})
        this.allPaginationButtons = page.locator('nav > a[href*="&page="]')
        this.addToCartButtonLocatorString = '//button[text()="Add to cart"]'
        
        // Cart
        this.cartButton = page.locator('//span[text()="Cart"]')
        this.cartTotalAmount = page.locator('//div[text()="Total Amount"]/parent::div/following-sibling::div//span[contains(text(),"₹")]')
        this.cartDeliveryDetailsList = page.locator('//div[contains(text(),"Delivery by")]')
        this.cartDeliveryCostList = page.locator('//div[contains(text(),"Delivery by")]/span')
    }

    /**
     * Function to close the overlay/modal
     */
    async closeOverLay() {
        if (await this.overLayCloseButton.isVisible()) await this.overLayCloseButton.click()
    }

    /**
     * Function to set the low to high sort filter
     */
    async setFilter() {
        await this.sortByHeader.click()
        await expect(this.overlayLoginButton).not.toBeVisible()
        await this.lowToHighSortOption.dblclick()
        await expect(this.lowToHighSortOption).toHaveCSS('color', this.blueColor)
    }

    /**
     * Function to search a text in the global searchbar
     * 
     * @param text text to be searched for
     */
    async searchText(text: string) {
        await this.closeOverLay()
        await this.searchBar.fill(text)
        await this.searchButton.click()
        await expect(this.lowToHighSortOption).toBeVisible()
        await this.sortByHeader.click()
        await expect(this.overlayLoginButton).not.toBeVisible()
    }

    /**
     * Function to check if the prices are in ascending order
     * 
     * @param pageLimit the page at which the check has to be stopped
     */
    async checkIfPricesAreInAscendingOrder(pageLimit: number) {
        for(const e of await this.allPaginationButtons.all()) {
            const prices = await Promise.all((await this.priceList.all()).map(async (x) => {
                const price = Number((await x.textContent())?.replace(/₹/g,''))
                return price
            }))
    
            for (let i = 1; i < prices.length - 1; i++) {
                if (prices[i - 1] > prices[i]) {
                    throw new Error(`Prices are not in ascending order, comparison failed at ${prices[i - 1]} vs ${prices[i]}`)
                };
            }
            if (this.page.url().includes(`&page=${pageLimit}`)) break;
            await this.paginationNextButton.click()
            await expect(this.lowToHighSortOption).toHaveCSS('color', this.blueColor)
        }
    }

    /**
     * Function to click on an item, switch tab and click on 'Add to cart' button
     * 
     * @param locator search result locator
     */
    async switchTabAndAddItemToCart(locator: Locator) {
        const [newPage] = await Promise.all([this.page.context().waitForEvent('page'), locator.click()])
        try {
          await newPage.waitForLoadState('load');
          await newPage.locator(this.addToCartButtonLocatorString).click()
        } finally {
          await newPage.close();
        }
    }

    /**
     * Function to validate the total amount in the shopping cart page
     * 
     * @param expectedPrice the expected price (actual price of the item(s))
     */
    async validateTotalAmount(expectedPrice: number) {
        const prices = await Promise.all((await this.cartDeliveryCostList.all()).map(async (x, i) => {
            if (!(await x.textContent())?.includes('free')) return Number((await this.cartDeliveryCostList.nth(i).textContent())?.replace(/₹/g,''))
            else return 0
        }))
        const totalDeliveryCost = prices.reduce((a, b) => a + b, 0)
        const actualPrice = Number((await this.cartTotalAmount.textContent())?.trim()?.replace(/₹/g,''))
        expect(expectedPrice + totalDeliveryCost, 'Prices are unequal').toEqual(actualPrice)
    }
}