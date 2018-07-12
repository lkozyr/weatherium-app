
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
    //console.log('convertToDayTime', seconds);
    const date = new Date((seconds + gmtOffset) * 1000);
    
    let hours = '00' + date.getUTCHours();
    hours = hours.substr(hours.length-2, 2);

    let minutes = '00' + date.getUTCMinutes();
    minutes = minutes.substr(minutes.length-2, 2);

    //console.log('convertToDayTime', `${hours}:${minutes}`);
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