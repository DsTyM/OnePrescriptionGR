# One Prescription GR

## Description

One Prescription GR is a Single Page Web Application which communicates with real data from Idika's ePrescription API.  
It is implemented in Greek language. The doctor can sign in on the application and create, edit, delete or view a
visit  
and also a prescription, among other functionality. The app is implemented with Angular 11.

You can find full manual for version 1.0.0 of this application in Greek on this file: `Version 1.0.0 Manual GR.pdf`.

## Demo

You can find a demo of the application on YouTube here: [One Prescription GR Demo](https://youtu.be/6Wp8H9NV6Ls).

## Installation

To install the application you first need to have [Node.js](https://nodejs.org/en/) installed
with [npm](https://www.npmjs.com/). Then you need to clone this project and browse to its directory. Then you need to
run:

```shell
npm install
```

Then you should open this file: `src/environments/properties.ts`:

```typescript
apiKey: 'REPLACE_WITH_YOUR_KEY_HERE'
```

and change `REPLACE_WITH_YOUR_KEY_HERE` with your API Key that [Idika](http://www.idika.gr/) has provided to you. To get
an API key you have to contact IDIKA's E-Prescription team. You can find their Greek phone number in this
site: [E-Prescription](https://www.e-prescription.gr). You should call them, explain to them why you need the API key
(e.g. for Development / Research purposes) and they should provide you one.

To start the application, you need to run:

```shell
node node_modules/cors-anywhere/server.js
npm start
```

when the application finishes compiling, you can access it on this URL:

```
http://localhost:4200
```

## CORS Anywhere

The project needs [CORS Anywhere](https://github.com/Rob--W/cors-anywhere/) to communicate with e-prescriptions API.

[How to use CORS Anywhere?](https://stackoverflow.com/a/41137337/6151784)

## Example Values

You can find some example values to make a new visit and new prescription on this file: `example-values.txt`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.
