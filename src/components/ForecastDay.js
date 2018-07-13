import React from 'react';
import PropTypes from 'prop-types';

import './forecast-day.scss';

import { weatherIcons } from '../weather-icons';
import Wind from './Wind';


const ForecastDay = props => {
    
    return (
        <div className="forecast-day">

            <div className="icon">
                    <img src={weatherIcons[`icon${props.forecastDay.icon}`]} 
                        alt={props.forecastDay.description} />
            </div>

            <div className="temp-max">
                    {props.forecastDay.tempMax}
                    {
                        props.settings.units === `metric`
                            ? `°C`
                            : `°F`
                    }
            </div>
            <div className="temp-min">
                    {props.forecastDay.tempMin}
                    {
                        props.settings.units === `metric`
                            ? `°C`
                            : `°F`
                    }
            </div>

            <Wind windSpeed={props.forecastDay.windSpeed} 
                  windDir={props.forecastDay.windDir}
                  settings={props.settings} />   
        </div>
    );
}

ForecastDay.propTypes = {
    forecastDay: PropTypes.shape({
        date:           PropTypes.number.isRequired,
        icon:           PropTypes.string.isRequired,
        tempMax:        PropTypes.number.isRequired,
        tempMin:        PropTypes.number.isRequired,
        windDir:        PropTypes.number,
        windSpeed:      PropTypes.number.isRequired,
        description:    PropTypes.string.isRequired,
    }).isRequired,

    settings: PropTypes.shape({
        units:          PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
};

export default ForecastDay;

