import React from 'react';
import PropTypes from 'prop-types';
import { getDateString } from '../helpers';

import './date-string.scss';

const DateString = props => {
    if (!props.seconds)
    {
        return null;
    }
    
    return(
        <h2 className="date-string">  
            { getDateString(props.seconds) }
        </h2>
    );
}

DateString.propTypes = {
    seconds: PropTypes.number,
};

export default DateString;