# One Prescription GR

## Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and uses Angular 11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.

## API Key

We should open this file: `src/environments/properties.ts`:

```typescript
apiKey: 'REPLACE_WITH_YOUR_KEY_HERE'
```

and change `REPLACE_WITH_YOUR_KEY_HERE` with our API Key that [Idika](http://www.idika.gr/) has provided to us. If we
don't have one, we should request one.

## CORS Anywhere

The project needs [CORS Anywhere](https://github.com/Rob--W/cors-anywhere/) to communicate with e-prescriptions API.

To start CORS Anywhere, run:

```shell
node node_modules/cors-anywhere/server.js
```

[How to use CORS Anywhere?](https://stackoverflow.com/a/41137337/6151784)

## Example

You can find some example values to make a new visit and new prescription on this file: `example-values.txt`.
