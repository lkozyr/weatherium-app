import React from 'react';
import PropTypes from 'prop-types';

import './settings.scss';

const Settings = props => {

    const handleChange = (e) => {
        props.updateSettings(e.target.id);
    }

    const handleBack = () => {
        props.history.goBack();
    }

    return(
        <div className="section settings">

            <div className="settings-header">
                <h2>Settings</h2>
                <span onClick={handleBack}>&times;</span>
            </div>
            <div className="settings-units">
                Units:
                <input type="radio" id="metric" name="units" onChange={handleChange} 
                    defaultChecked={props.settings.units === "metric"}  />
                <label htmlFor="metric" > Metric </label>

                <input type="radio" id="imperial" name="units" onChange={handleChange} 
                    defaultChecked={props.settings.units === "imperial"} />
                <label htmlFor="imperial" > Imperial </label>
            </div>
        </div>
    );
}

Settings.propTypes = {
    settings: PropTypes.shape({
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    }).isRequired,
};

export default Settings;