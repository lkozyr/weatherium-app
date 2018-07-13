import React from 'react';

import './loader.scss';
import { weatherIcons } from '../weather-icons';


const Loader = () => {
    return(
        <div className="loader">
            <img src={weatherIcons['loader']} alt="Please wait..."/>
        </div>
    );
}

export default Loader;
