import React from 'react';
import PropTypes from 'prop-types';

import './city-log.scss';

const CityLog = props => {

    const handleClick = e => {
        const id = parseInt(e.target.dataset["id"], 10);

        const city = props.cities.find(item => item.id === id);
        if (city.id){
            props.loadWeatherForCity(city);
        }
    }

    return(
        <ul className="city-log">  
            {
                props.cities
                    ?   props.cities.map((item, i) => 
                            <li key={`${item.id}_${i}`}
                                data-id={item.id}
                                onClick={handleClick}>
                                    {item.cityName}, {item.countryCode}                    
                            </li>)
                    : null
            }
        </ul>
    );
}

CityLog.propTypes = {
    cities: PropTypes.arrayOf(PropTypes.shape({
        id:             PropTypes.number,
        cityName:       PropTypes.string,
        countryCode:    PropTypes.string,
        gmtOffset:      PropTypes.number,
      })),
    loadWeatherForCity: PropTypes.func.isRequired,
};

export default CityLog;