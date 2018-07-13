import React from 'react';
import PropTypes from 'prop-types';

import './forecast-section.scss';

import DateString from './DateString';
import ForecastDay from './ForecastDay';

const ForecastSection = props => {
    
    return (
        <ul className="forecast-section">
            {
                props.forecast.map((item, i) => (
                    <li key={`${item.date}_${i}`}>
                        <DateString seconds={item.date} 
                                    keepComma={false}/>
                        
                        <ForecastDay forecastDay={item}
                                     settings={props.settings}/>
                    </li>
                ))
            }
        </ul>
    );
}

ForecastSection.propTypes = {
    forecast: PropTypes.arrayOf(PropTypes.shape({
        date:           PropTypes.number,
        icon:           PropTypes.string,
        description:    PropTypes.string,
        tempMax:        PropTypes.number,
        tempMin:        PropTypes.number,
        windDir:  		PropTypes.number, 
        windSpeed: 		PropTypes.number,
    })).isRequired,

    settings: PropTypes.shape({
        units:          PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
}

export default ForecastSection;