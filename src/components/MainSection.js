import React from 'react';

import './main-section.scss';

import DateString from './DateString';

const MainSection = () => {
    return(
        <div className="section main-section">  
            <DateString seconds={1531243200}/>  {/*  //TODO: pass seconds param from weather response */}
        </div>
    );
}

export default MainSection;


// TODO:
// 1. check if 'main-section' class is needed here: className="section main-section"
// 2. add proptypes