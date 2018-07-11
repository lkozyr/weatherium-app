import React from 'react';
import PropTypes from 'prop-types';

import { weatherIcons } from '../weather-icons';
import './error.scss';

const Error = props => {
    return(
        <div className="error">
            <h2>Error</h2>
            <img src={weatherIcons['error']} alt="Error. Something went wrong."/>
            <p>{props.message}</p>
            <div className="back" onClick={props.goBack}>Go back</div>
        </div>
    );
}

Error.propTypes = {
    message: PropTypes.string,
    goBack: PropTypes.func.isRequired,
};

export default Error;
