# Data Weave Playground UI

The UI of the playground

An independent web-based development environment for the DataWeave language.

## How to Run the Playground in your local machine

`dw --eval --spell Playground`



## Running the UI locally for development

*All these steps must be done inside the `frontend` directory.*

Before you get started, you need to register with our private npm repository so you can download the Anypoint modules.

`npm login --registry=https://nexus3.build.msap.io/repository/npm-internal/ --scope=@mulesoft`

When prompted, enter your **Jenkins** username and password. If you have 2-factor authentication enabled, you’ll get a 401 after attempting to login. As a workaround, you can temporarily disable 2FA in your settings, login with your credentials and then re-enable 2FA.

Install dependencies: 
`npm i`

Start the development server (with hot reloading): `npm start`

Visit `http://localhost:25565` to access the playground. Also make sure to have the backend services running on port `8080`.

Run tests: `npm run test`

Build a static deployable artifact: `npm run build:static`

## Runing the playground

`dw --eval --spell Playground`

