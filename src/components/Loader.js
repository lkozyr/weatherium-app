import React from 'react';

import { weatherIcons } from '../weather-icons';
import './loader.scss';

const Loader = () => {
    return(
        <div className="loader">
            <img src={weatherIcons['loader']} alt="Please wait..."/>
        </div>
    );
}

export default Loader;

