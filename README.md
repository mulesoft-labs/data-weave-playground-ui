<<<<<<< HEAD
# data-weave-playground-ui
The UI of the playground
=======
# DataWeave playground

An independent web-based development environment for the DataWeave language.

## Running the playground

`./gradlew backend:run`

## Running the UI locally

*All these steps must be done inside the `frontend` directory.*

Before you get started, you need to register with our private npm repository so you can download the Anypoint modules.

`npm login --registry=https://npm.mulesoft.com --scope=@mulesoft`

When prompted, enter your github username and password. If you have 2-factor authentication enabled, you’ll get a 401 after attempting to login. As a workaround, you can temporarily disable 2FA in your settings, login with your credentials and then re-enable 2FA.

Install dependencies: 
`npm i`

Start the development server (with hot reloading): `npm start`

Visit `http://localhost:25565` to access the playground. Also make sure to have the backend services running on port `8080`.

Run tests: `npm run test`

Build a static deployable artifact: `npm run build:static`


## How to build the Docker image

```
 ./gradlew backend:distDocker
```

## Usage
```
docker pull machaval/dw-playground:2.3.0-SNAPSHOT
docker run -it --rm -p8080:8080 machaval/dw-playground:2.3.0-SNAPSHOT
```

By default the playground starts in port 8080 and you can hit [http://localhost:8080/](http://localhost:8080/) 

Check [https://hub.docker.com/r/machaval/dw-playground/tags](https://hub.docker.com/r/machaval/dw-playground/tags) for other available versions.
>>>>>>> Initial Commit
