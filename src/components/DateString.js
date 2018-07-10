import React from 'react';
import PropTypes from 'prop-types';
import { getDateString } from '../helpers';

import './date-string.scss';

const DateString = props => {
    return(
        <h2 className="date-string">  
            { getDateString(props.seconds) }
        </h2>
    );
}

DateString.propTypes = {
    seconds: PropTypes.number.isRequired,
};

export default DateString;