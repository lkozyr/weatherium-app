## Weatherium app

Web application that shows current weather for the specified city and 5 day weather forecast.
Created with React.js. 

Live link: [Weatherium app](http://weather-app-20180703.epizy.com/).

**HTTP only.** 
Sorry, this app is available via **http only** at this time. Reasons: 
 - I use free hosting plan which includes http *ONLY*;
 - I use also free plan for data providers, one of them does not provide https access in their free plan:
```
type	"https_access_restricted"
info	"Access Restricted - Your current Subscription Plan does not support HTTPS Encryption."
```
thus connecting from https to http will result in CORS issue.

Please note: this is a learning project, as long as it does not get any credentials and/or other sensitive data from users, I consider using http as *acceptable* so far.


## Features

- remembers 5 last viewed cities
- allows to select preferred units system: metric or imperial
- defines current user city by IP
- shows city suggestions while typing
- looks great on both mobile and desktop
- loads a new awesome background image every day :)


## Third Party Data Providers

 - [ipstack.com](https://ipstack.com/) - Allows to define current user's city by IP
 - [openweathermap.org](https://openweathermap.org) - Provides current weather and 5 day forecast
 - [timezonedb.com/](https://timezonedb.com/) - Allows to define GMT offset in the specified city (GMT offset is then used to convert sunrise and sunset UTC time to local time in that city)
 - [splashbase.co](https://www.splashbase.co/) - Provides quality photos used as a background image


## Icons and fonts

 - Weather icons and loader by [Yun Liu](https://www.iconfinder.com/Neolau1119/icon-sets)
 - Logo icon by [Just UI](https://www.iconfinder.com/justui)
 - Wind icon by [Juliia Osadcha](https://www.iconfinder.com/Juliia_Os)
 - Humidity icon [Pixel perfect](https://www.flaticon.com/authors/pixel-perfect) from [Flaticon](https://www.flaticon.com)
 - Pen icon by [Yannick Lung](https://www.iconfinder.com/yanlu)

 - [Assistant](https://fonts.google.com/specimen/Assistant) font
 - [PragatiNarrow](https://fonts.google.com/specimen/Pragati+Narrow) font


## Prerequisites

In order to have your local working copy of code, you will need to register your account in third-party data providers ([ipstack.com](https://ipstack.com/), [openweathermap.org](https://openweathermap.org), [timezonedb.com/](https://timezonedb.com/) ) and obtain access keys respectively. Then create .env file and place it in the root folder of the project. Define your access keys in .env file:

```
REACT_APP_IPSTACK_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_OPENWEATHERMAP_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_TIMEZONEDB_API_KEY=XXXXXXXXXXXXXXX
```

If your access keys are valid and activated, you should be able to run the app locally.


## Running the app locally

 - Download the project to your machine.
 - Open project folder 
```
cd /path-to-project/weatherium-app
```

 - Install node modules 
```
npm install
```

 - Run dev server and compile code:
```
npm start
```


## Known issues

 - City names differ in city suggestions list and, once selected, in seach box.

*Steps to reproduce* : 
1. Type 'Castle' in the search box. 
2. Select 'Castle, GB' - first item from the suggestions list.
3. Once the weather is loaded, notice that the city name is 'Bedford, GB'.

*This is a known issue of [openweathermap.org](https://openweathermap.org) data provider. It was confirmed by openweathermap.com support team that the issue is caused by duplicated location names that lead to different cities. At the moment it is not possible to remove duplicates due to their infrustructure.*
*Visit https://openweathermap.org/find to reproduce the same behaviour.*


