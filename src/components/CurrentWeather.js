import React from 'react';
import PropTypes from 'prop-types';

import './current-weather.scss';
import { formatCoordinates, convertToDayTime } from '../helpers';

import { weatherIcons } from '../weather-icons';
import Wind from './Wind';



const CurrentWeather = props => {
    
    return (
        <div className="current-weather">
            {
                props.weather.lat && props.weather.lon
                    ?  
                        <div className="geo-coordinates">
                            { formatCoordinates(props.weather.lat, props.weather.lon) }
                        </div>
                    : 
                        null
            }
            {
                props.weather.sunrise && props.weather.sunset && props.city.gmtOffset
                    ?  
                        <React.Fragment>
                            <div className="suntime">
                                Sunrise: { convertToDayTime(props.weather.sunrise, props.city.gmtOffset) }
                            </div>
                            <div className="suntime">
                                Sunset:  { convertToDayTime(props.weather.sunset,  props.city.gmtOffset) }
                            </div>
                        </React.Fragment>
                    : 
                        null
            }
           
            <div className="temp">
                    {props.weather.temp}
                    {
                        props.settings.units === `metric`
                            ? `°C`
                            : `°F`
                    }
            </div>

            <div className="icon">
                    <img src={weatherIcons[`icon${props.weather.icon}`]} 
                        alt={props.weather.description} />
            </div>


            <div className="humidity">
                <img src={weatherIcons[`humidity`]} 
                     alt="Humidity" />
                {props.weather.humidity} %
            </div>

            <Wind windSpeed={props.weather.windSpeed} 
                  windDir={props.weather.windDir}
                  settings={props.settings} />   

            <div className="description">
                    {props.weather.description}
            </div>
        </div>
    );
}

CurrentWeather.propTypes = {
    weather: PropTypes.shape({
        date: 			PropTypes.number,
        sunrise: 		PropTypes.number, 
        sunset: 		PropTypes.number, 
        lat: 			PropTypes.number, 
        lon: 			PropTypes.number, 
        icon: 			PropTypes.string, 
        description: 	PropTypes.string, 
        humidity: 		PropTypes.number, 
        windDir:  		PropTypes.number, 
        windSpeed: 		PropTypes.number,
        temp: 			PropTypes.number, 
    }).isRequired,
    settings: PropTypes.shape({
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
    city: PropTypes.shape({
        id:             PropTypes.number,
        cityName:       PropTypes.string,
        countryCode:    PropTypes.string,
        gmtOffset:      PropTypes.number,
    }).isRequired,
};

export default CurrentWeather;

