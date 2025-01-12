import { expect } from "@playwright/test";
import { test } from "../Fixtures";

// Function to navigate to baseUrl before every test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// TC01 will fail since the order is not in ascending order even after setting the filter
test('TC01 - Validate Sort functionality for products displayed', {tag: '@flipkart'} , async ({ basePage }) => {
    await basePage.searchText('shoes')
    await basePage.setFilter()
    await basePage.checkIfPricesAreInAscendingOrder(2)
});

test('TC02 - Validate Add to Cart Functionality', {tag: '@flipkart'} , async ({ basePage }) => {
  await basePage.searchText('shoes')
  await basePage.setFilter()
  const item1Price = Number((await basePage.priceList.nth(2).textContent())?.replace(/₹/g,''))
  const item2Price = Number((await basePage.priceList.nth(3).textContent())?.replace(/₹/g,''))
  await basePage.switchTabAndAddItemToCart(basePage.priceList.nth(2))
  await basePage.switchTabAndAddItemToCart(basePage.priceList.nth(3))
  
  await basePage.cartButton.click()
  await expect(basePage.cartTotalAmount).toBeVisible()
  await basePage.validateTotalAmount(item1Price + item2Price)
});