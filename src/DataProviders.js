import {
	ipstackURL,
	openweathermapCurrentURL,
	openweathermapForecastURL,
	openweathermapAutocompleteURL,
	splashbaseURL,
	timezonedbURL,
} from "./third-party-urls";

import { filterForecastData } from "./helpers";

/**
 * Gets user's city name by IP address using third-party service https://ipstack.com.
 * @returns {object} city containing fileds id, cityName, countryCode - if request was successful, otherwise returns null.
 */
export const getCityByIP = () => {
	const ipstackRequestParams = {
		access_key: process.env.REACT_APP_IPSTACK_API_KEY,
	};

	const ipstackFetchURL =
		ipstackURL +
		Object.keys(ipstackRequestParams)
			.map(key => key + "=" + ipstackRequestParams[key])
			.join("&");

	return fetch(ipstackFetchURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				console.warn("Error in getCityByIP. Error code: ", data.status);
				return null;
			}
		})
		.then(data => {
			if (!data) {
				return null;
			}
			return {
				id:             data.location.geoname_id,
				cityName:       data.city,
				countryCode:    data.country_code,
			};
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};

/**
 * Gets current weather by cityId using third-party service http://api.openweathermap.org.
 * @param {Number} cityId - city id according to geonames.org database (see more: https://en.wikipedia.org/wiki/GeoNames)
 * @param {string} units - system of units, either of ['imperial', 'metric']. Default value is 'metric'.
 * @returns {object} weather object containing fields: id, date, city, sunrise, sunset, lat, lon, icon, description, humidity, windDir, windSpeed, and temp - if request was successful, otherwise returns null.
 */
export const getCurrentWeather = (cityId, units = "metric") => {
	if (!cityId) {
		return null;
	}
	const weatherRequestParams = {
		APPID:  process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
		id:     cityId,
		units:  units,
		lang:   "en_US",
	};

	const weatherFetchURL =
		openweathermapCurrentURL +
		Object.keys(weatherRequestParams)
			.map(key => key + "=" + weatherRequestParams[key])
			.join("&");

	return fetch(weatherFetchURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				console.warn(
					"Error in getCurrentWeather. Error code: ",
					data.status,
				);
				return null;
			}
		})
		.then(data => {
			if (!data) {
				return null;
			}

			return {
				id:         data.id,
				date:       data.dt,
				city:       data.name,
				country:    data.sys.country,
				sunrise:    data.sys.sunrise,
				sunset:     data.sys.sunset,
				lat:        data.coord.lat,
				lon:        data.coord.lon,
				icon:       data.weather[0].icon,
				description: data.weather[0].description,
				humidity:   data.main.humidity,
				windDir:    Math.round(parseFloat(data.wind.deg)),
				windSpeed:  Math.round(parseFloat(data.wind.speed)),
				temp:       Math.round(parseFloat(data.main.temp)),
			};
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};

/**
 * Gets GMT offset by geo coordinates using third-party service https://timezonedb.com/.
 * @param {Number} lat - geo coordinates latitude of the city.
 * @param {Number} lng - geo coordinates longitude of the city.
 * @returns {Number} gmtOffset value in seconds - if request was successful, otherwise returns null.
 */
export const getGMTOffsetByCoordinates = (lat, lng) => {
	const timezonedbRequestParams = {
		key:    process.env.REACT_APP_TIMEZONEDB_API_KEY,
		by:     `position`,
		lat,
		lng,
		format: `json`,
	};

	const gmtOffsetFetchURL =
		timezonedbURL +
		Object.keys(timezonedbRequestParams)
			.map(key => key + "=" + timezonedbRequestParams[key])
			.join("&");

	return fetch(gmtOffsetFetchURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				console.warn(
					"Error in getGMTOffsetByCoordinates. Error code: ",
					data.status,
				);
				return null;
			}
		})
		.then(data => {
			if (!data) {
				return null;
			}
			return data.gmtOffset;
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};

/**
 * Retrieves a list of cities that begin from the specified string. Good for autocomplete feature.
 * @param {string} word - string a searched city name begins with.
 * @returns {Array} list of cities that begin with the specified string. Every item is an object containing fields: id, name, country.
 */
export const getCitySuggestions = word => {
	const autocompleteRequestParams = {
		APPID: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
		q: word,
	};

	const autocompleteFetchURL =
		openweathermapAutocompleteURL +
		Object.keys(autocompleteRequestParams)
			.map(key => key + "=" + autocompleteRequestParams[key])
			.join("&");

	return fetch(autocompleteFetchURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				return null;
			}
		})
		.then(suggestions => {
			if (suggestions.cod === "200" && suggestions.list.length > 0) {
				return suggestions.list.map(item => {
					return {
						id:         item.id,
						city:       item.name,
						country:    item.sys.country,
					};
				});
			}
			return null;
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};

/**
 * Gets 5 day weather forecast by cityId using third-party service http://api.openweathermap.org.
 * @param {Number} cityId - city id according to geonames.org database (see more: https://en.wikipedia.org/wiki/GeoNames)
 * @param {string} units - system of units, either of ['imperial', 'metric']. Default value is 'metric'.
 * @param {Number} gmtOffset - GMT Offset represented by number of seconds. Example: -7200.
 * @returns {object} forecast object - if request was successful, otherwise returns null.
 */
export const getWeatherForecast = (cityId, units = "metric", gmtOffset = 0) => {
	if (!cityId) {
		return null;
	}
	const forecastRequestParams = {
		APPID: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
		id:     cityId,
		units:  units,
		lang:   "en_US",
	};

	const forecastFetchURL =
		openweathermapForecastURL +
		Object.keys(forecastRequestParams)
			.map(key => key + "=" + forecastRequestParams[key])
			.join("&");

	return fetch(forecastFetchURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				console.warn(
					"Error in getWeatherForecast. Error code: ",
					data.status,
				);
				return null;
			}
		})
		.then(data => {
			if (data && data.cod === "200") {
				return filterForecastData(data.list, gmtOffset);
			}
			return null;
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};

/**
 * Gets an image for background based on city name and weather description using third-party service http://api.openweathermap.org.
 * @param {string} cityName - city name to search an image for.
 * @param {string} weatherDescription - weather description. Example: 'mostly sunny'.
 * @returns {string} image url, or null if no images found
 */
export const getBackgroundImage = (cityName, weatherDescription) => {
	const queryString = `${cityName}, ${weatherDescription}, black and white`;

	const bgImageRequestParams = {
		query: queryString,
	};

	const backgroundImageURL =
		splashbaseURL +
		Object.keys(bgImageRequestParams)
			.map(key => key + "=" + bgImageRequestParams[key])
			.join("&");

	return fetch(backgroundImageURL)
		.then(data => {
			if (data.status === 200) {
				return data.json();
			} else {
				console.warn(
					"Error in getBackgroundImage. Error code: ",
					data.status,
				);
				return null;
			}
		})
		.then(data => {
			if (data.images.length === 0) {
				return "";
			}
			const random = Math.floor(Math.random() * data.images.length);
			return data.images[random].url.replace("https", "http");
		})
		.catch(err => {
			console.warn(err);
			return null;
		});
};
