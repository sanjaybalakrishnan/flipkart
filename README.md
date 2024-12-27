## flipkart

This project utilises [Playwright](https://playwright.dev/) to automate the tests.

### Prerequisites

1. **node.js** (which can be downloaded from [here](https://nodejs.org/en/download/package-manager))
2. **typescript** (instructions on how to setup can be found [here](https://www.typescriptlang.org/download/))
3. **ide** (preferred - `vsc`, which can be downloaded from [here](https://code.visualstudio.com/Download))
4. **bash/zsh** (for running the tests through command line) [optional]
5. **playwright vsc plugin** (for running the tests through vsc code ui) [optional]

### Repo

The repo can be cloned via: 
1. HTTPS using the command: `https://github.com/sanjaybalakrishnan/flipkart.git`
2. SSH using the command: `git@github.com:sanjaybalakrishnan/flipkart.git`

### Commands to execute test(s)

1. To run all tests : `npx playwright test`
2. To run any specific test :
    1. Based on tags : `npx playwright test --grep '@flipkart'`
    2. Based on partial title name: `npx playwright test --grep 'TC02'`
    3. Based on class name: `npx playwright test flipkart`

### Structure

1. #### ./pages - Dir to store all page objects
2. #### ./tests - Dir to store all spec files (tests)
3. #### Fixtures.ts - to store fixtures (page objects) which are used by the tests
4. #### ./.github - Dir to store all github workflows
5. #### config files - 
    1. `package.json` & `package-lock.json` - config files to maintain dependencies, scripts etc
    2. `playwright.config.ts` - main config file for playwright configurations

### Misc
1. Tests run on chrome and video, traces are enabled 
2. `Test timeout` is set to `10 minutes`
3. `expect timeout` is set to `15 secs`

#### Note:
1. `TC01` will fail since the application is producing unexpected result after filtering the results.
2. Total time taken was around `3-4` hrs for the entire assignment to be completed.