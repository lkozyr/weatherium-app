
/**
 * Converts date represented by number of seconds to string date format.
 * @param {Number} seconds - Date represented by a number of seconds. Example: 1530527400
 * @param {boolean} keepComma - Whether date should be delimited from the weekday with comma. Default value: true.
 * @param {string} locale - Locale to use for data formatting. Default value: 'en-US'.
 * @returns {string} Date converted to string. Example: 'Monday, Jul 10'.
 */
export const getDateString = (seconds, keepComma = true, locale = 'en-US') => {
    const date = new Date(seconds*1000);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = keepComma
                        ?  date.toLocaleDateString(locale, options)
                        :  date.toLocaleDateString(locale, options).replace(',', '\n');
    return dateString;
}


/**
 * Adds 1 or 2 missing zeroes so that each number has at least two decimals, without rounding.
 * @param {Number} number - number to add missing zeroes to. Example: 25.
 * @returns {string} number with two decimals, converted to a string. Example: '25.00'.
 */
const padEnd = (number) => {
    const str = number.toString();
    const pos = str.indexOf('.');
    if (pos === -1){
        return str + '.00';
    }
    else{
        if (str.length - 1 - pos < 2){
            return str + '0';
        }
        else{
            return str;
        }
    }
}

/**
 * Formats coordinates from decimal format to degrees° minutes′ seconds″ formatted string.
 * @param {Number} lat - Latitude in decimal format. Example: -77.729594.
 * @param {Number} lon - Longitude in decimal format. Example: 46.39909.
 * @returns {string} Coordinates formatted to degrees° minutes′ seconds″ and converted to string. Example: '21° 7′ 46.55″ N, 77° 43′ 46.54″ W'.
 */
export const formatCoordinates = (lat, lon) => {
    const letterLat = lat > 0
                        ? `N`
                        : `S`;
    const letterLon = lon > 0
                        ? `E`
                        : `W`;
    
    const latABS = Math.abs(lat);
    const lonABS = Math.abs(lon);

    const degreesLat = Math.floor(latABS); 
    const degreesLon = Math.floor(lonABS); 

    const minLat = Math.floor((latABS - degreesLat) * 60);
    const minLon = Math.floor((lonABS - degreesLon) * 60);
    
    const secLat = Math.floor( ((latABS - degreesLat) * 60 - minLat) * 60 * 100 ) / 100;
    const secLon = Math.floor( ((lonABS - degreesLon) * 60 - minLon) * 60 * 100 ) / 100;

    return `${degreesLat}° ${minLat}′ ${padEnd(secLat)}″ ${letterLat},
            \u00A0${degreesLon}° ${minLon}′ ${padEnd(secLon)}″ ${letterLon}`;
}

/**
 * Converts date represented by number of seconds to string time formatted as 'hh:mm'.
 * @param {Number} seconds - Time represented by a number of seconds. Example: 1529399125
 * @param {Number} gmtOffset - GMT Offset represented by number of seconds. Example: -7200.
 * @returns {string} Time string in 'hh:mm' format. Example: '05:24'.
 */
export const convertToDayTime = (seconds, gmtOffset) => {
    const date = new Date((seconds + gmtOffset) * 1000);
    
    let hours = '00' + date.getUTCHours();
    hours = hours.substr(hours.length-2, 2);

    let minutes = '00' + date.getUTCMinutes();
    minutes = minutes.substr(minutes.length-2, 2);

    return `${hours}:${minutes}`;
}


/**
 * Removes duplicates from array.
 * @param {Array} objectsArray - Array of objects to remove duplicates from.
 * @returns {Array}  Array without duplicates.
 */
export const removeDuplicates = (objectsArray) => {
    return objectsArray.filter( (item, index, self) => 
                        self.findIndex( t => t.id === item.id ) === index);
}


/**
 * Constructs a string representing city and country code from city object.
 * @param {Object} cityData - City object containing fields: id, name, country.
 * @returns {Array} String in format 'City, CC'.
 */
export const constructSearchBoxValue = (cityData) => {
    return `${cityData.cityName}, ${cityData.countryCode}`;
}

/**
 * Gets city name and country code out of input value.
 * @param {string} value - Input value, expected format: 'City[, CC]'.
 * @returns {Object} City object containing fields: name and country, if available.
 */
export const parseSearchBoxValue = (value) => {
    const words = value.trim().split(',');
    if (words.length === 1){
        return { 
            city: words[0],
            country: null,
        };
    }
    if (words.length === 2){
        return { 
            city: words[0],
            country: words[1],
        };
    }
}

/**
 * Filters API forecast response and returns data needed for forecast component only.
 * @param {string} data - API forecast response: list of 40 weather objects.
 * @returns {Array} Weather objects array, every item has fields: date, icon, tempMin, tempMax, windSpeed, windDir.
 */
export const filterForecastData = (data, gmtOffset) => {
    if (!data){
        return null;
    }
 
    const forecast = [];
    const nextDayIndex = data.findIndex(item => {
        const localHours = ( new Date ( (item.dt + gmtOffset) * 1000 ) ).getUTCHours();
        return (localHours >= 0 && localHours <= 2);
    });

    // retrieve night temperatures
    for (let i = nextDayIndex; i < data.length; i += 8) {
        const forecastDay = {
            date:       data[i].dt,
            tempMin:    Math.round(parseFloat(data[i].main.temp)),
        };
        forecast.push(forecastDay);
    }

    let j = 0; // iteration counter through forecast array

    // retrieve day temperatures and weather icon
    for (let i = nextDayIndex+4; i < data.length; i += 8) {
        forecast[j].icon =          data[i].weather[0].icon;
        forecast[j].description =   data[i].weather[0].description;
        forecast[j].tempMax =       Math.round(parseFloat(data[i].main.temp));
        forecast[j].windSpeed =     Math.round(parseFloat(data[i].wind.speed));
        forecast[j].windDir =       Math.round(parseFloat(data[i].wind.deg));
        j++;
    }

    // check if the fifth forecast item has all properties defined,
    // if not - it means that there was not enough data provided by API,
    // and we will take the missing properties from the last available item of data array;
    // reason for missing data: API provides only 40 items in forecast array (8 items per day, for 5 days)
    // taking gmtOffset and current time into account, 40 items may not be enough
    if (!forecast[forecast.length-1].tempMax) {
        forecast[forecast.length-1].tempMax =           Math.round(parseFloat(data[data.length-1].main.temp));
        forecast[forecast.length-1].icon =              data[data.length-1].weather[0].icon;
        forecast[forecast.length-1].description =       data[data.length-1].weather[0].description;
        forecast[forecast.length-1].windSpeed =         Math.round(parseFloat(data[data.length-1].wind.speed));
        forecast[forecast.length-1].windDir =           Math.round(parseFloat(data[data.length-1].wind.deg));
    }

    return forecast;
}