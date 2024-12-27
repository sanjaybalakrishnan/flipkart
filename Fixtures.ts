import { test as baseTest } from "@playwright/test"
import { BasePage } from "./pages/BasePage"

type Fixtures = {
    basePage: BasePage
}

export const test = baseTest.extend<Fixtures>({
    basePage: async({page}, use) => {
        await use(new BasePage(page))
    }
})
