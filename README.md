# sharee.bike Servicetool - rental bike service management 🎮

<img src="src/assets/imgs/sharee-stool.png" width="400" />

The sharee Servicetool - is a rental bike service management software:
It is build with the Ionic 3 Framework as PWA (Progressive Web App).

This PWA connects via REST API to the main System - the COPRI Database 
https://gitlab.com/t6353/sharee.bike

Running as a PWA it is installed on a normal Webserver. You can use and acees it by any Webclient whether a Smarthone, Tablet or Desktop Clientt. For this App there is no need to load it from Google or Apple Store.

User Manual 

Take a look at the [Settings
page](https://github.com/ionic-team/starters/blob/master/ionic-angular/official/super/src/pages/settings/settings.html)
for a cool example of a page navigating to itself to provide a different UI
without duplicating code.

## Installation Guide - Table of Contents

1. [Ionic 3 Framework](#Ionic-3-Framework)
2. [Git lokal](#Git-lokal)
3. [Download from Remote Git](#Download-from-Remote-Git)
4. [Config File](#Config-File) (adding languages)
4. [Build Config-File](#i18n) (adding languages)

## Ionic-3-Framework

Installation on Windows System

1. Install NodeJS  Version 8.9.1 
https://nodejs.org/download/release/v8.9.1/

2. Use the Node.js command promt to run the scripts:
```bash
npm -v
```
--> 5.5.1
```bash
npm install -g cordova@7.1.0
cordova -v
```
--> 7.1.0
```bash
npm install -g ionic@3.20.0
ionic -v   
```
--> 3.20.0


more documentation about Ionic 3:
https://ionicframework.com/docs/v3/

## Git lokal

make sure your lokal Git System ist installed.

## Download from Remote Git

Go to the directory you want to be the root directory and run the command:
```bash
git clone https://github.com/christian-fi/sharee-servicetool.git
```

### Config File

Build the Conig File (config-api.js) to connect to the Copri Rest API.<br>
In the root dir create a new directory named 'www'. Save config-api.js in dir 'www'.
...
var config_api="OpenSource-Version"; //you can change this

var version_akt= "1-0"; //you can change this
var version_check_conf = "NO"; //do not change this

// replace this vars with data for a sharee test account
var shareeLive_conf="https://example1.org";  
var apiVersion_conf = "https://example2.org";
var apiMerchant_id_conf="12345";
var apiUrl_conf="https://example3.org";

Contact https://sharee.bike/Kontakt to get the data for a sharee test account


### Api

The `Api` provider is a simple CRUD frontend to an API. Simply put the root of
your API url in the Api class and call get/post/put/patch/delete 

## i18n

Ionic Super Starter comes with internationalization (i18n) out of the box with
[ngx-translate](https://github.com/ngx-translate/core). This makes it easy to
change the text used in the app by modifying only one file. 

### Adding Languages

To add new languages, add new files to the `src/assets/i18n` directory,
following the pattern of LANGCODE.json where LANGCODE is the language/locale
code (ex: en/gb/de/es/etc.).

### Changing the Language

To change the language of the app, edit `src/app/app.component.ts` and modify
`translate.use('en')` to use the LANGCODE from `src/assets/i18n/`
