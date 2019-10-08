# angular-days-2019-fall-web-components

Slides: [https://speakerdeck.com/manuelrauber/webcomponents-native-komponenten-furs-web-ohne-und-mit-frameworks](https://speakerdeck.com/manuelrauber/webcomponents-native-komponenten-furs-web-ohne-und-mit-frameworks)

## Initial setup native webcomponent
- Switch into folder `native-web-component`
- run `npm install` to install all dependencies
- run `npm start` to start the web server with the address `http://localhost:8080/src/index.html`
- to publish the web-component to an output folder run `npm run build-wc`

## Initial setup angular app
- Switch into folder `wc-sample`
- run `npm install` to install all dependencies
- run `npm start` to start the web server with the address `http://localhost:4200`

## Build webcomponent for angular
- run `npm deploy-wc` to copy the webcomponent to the angular app

## Sample to add the webcomponent to angular

- first of all, add the webcomponent to the index.html
```
  <script src="assets/native-web-rating.js"></script>
```

- second step is to add the custom element schema in the module file (app.module.ts)
```
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

- the last step is to add the webcomponent to the html
```
<web-component-rating></web-component-rating>
```

If you want to see more, here is the big demo repo [WebComponent-Demo](https://github.com/thinktecture-labs/web-components-chat)
