## Weatherium app

Web application that shows current weather for the specified city and 5 day weather forecast.
Created with React.js.


## Features

- remembers 5 last viewed cities
- allows to select preferred units system: metric or imperial
- defines current user city by IP
- searches city while typing
- looks great on both mobile and desktop


## Third Party Data Providers

 - [ipstack.com](https://ipstack.com/) - Allows to define current user's city by IP
 - [openweathermap.org](https://openweathermap.org) - Provides current weather and 5 day forecast
 - [timezonedb.com/](https://timezonedb.com/) - Allows to define GMT offset in the specified city (GMT offset is then used to convert sunrise and sunset UTC time to local time in that city)


## Icons and fonts

 - Weather icons and loader by [Yun Liu](https://www.iconfinder.com/Neolau1119/icon-sets)
 - Logo icon by [Just UI](https://www.iconfinder.com/justui)
 - Wind icon by [Juliia Osadcha](https://www.iconfinder.com/Juliia_Os)
 - Humidity icon [Pixel perfect](https://www.flaticon.com/authors/pixel-perfect) from [Flaticon](https://www.flaticon.com)
 - Pen icon by [Yannick Lung](https://www.iconfinder.com/yanlu)

 - [Assistant](https://fonts.google.com/specimen/Assistant) font
 - [PragatiNarrow](https://fonts.google.com/specimen/Pragati+Narrow) font


## Known issues

 - City names differ in city suggestions list and, once selected, in seach box.

*Steps to reproduce* : 
1. Type 'Castle' in the search box. 
2. Select 'Castle, GB' - first item from the suggestions list.
3. Once the weather is loaded, notice that the city name is 'Bedford, GB'.

*This is a known issue of [openweathermap.org](https://openweathermap.org) data provider. It was confirmed by openweathermap.com support team that the issue is caused by duplicated location names that lead to different cities. At the moment it is not possible to remove duplicates due to their infrustructure.*
*Visit https://openweathermap.org/find to reproduce the same behaviour.*


