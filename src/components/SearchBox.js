import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { getCitySuggestions } from '../DataProviders';
import { constructSearchBoxValue, parseSearchBoxValue } from '../helpers';
import { weatherIcons } from '../weather-icons';

import './search-box.scss';

class SearchBox extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            searchSuggestions: [],
            searchValue: '',
            city: props.city,
            searchTip: false
        };
    }

    showSearchTip = (searchValue) => {
        if (this.state.searchSuggestions.length === 0 && !parseSearchBoxValue(searchValue).country ){
            this.setState({ searchTip: true });
        }
        else{
            this.setState({ searchTip: false });
        }
    }

    hideSearchTip = (searchValue) => {
        if (this.state.searchTip){
            if (this.state.searchSuggestions.length !== 0 || parseSearchBoxValue(searchValue).country ){
                this.setState({ searchTip: false });
            }
        }
    }

    // clear input field once focused
    focusHandler = (e) => {
        e.target.value = '';
    }

    // if nothing typed in, set previous city value
    blurHandler = (e) => {
        if (e.target.value === ''){
            this.setState({ searchValue: constructSearchBoxValue(this.state.city) });
        }
    }

    // fetch and show city suggestions as user types:
    typingHandler = async (e) => {
        this.setState({ searchValue: e.target.value });

        if (e.target.value.length <= 2){
            this.setState({ searchSuggestions: [] });
        }

        if (e.target.value.length > 2){
            const suggestions = await getCitySuggestions(e.target.value) || [];
            this.setState({ searchSuggestions: suggestions });
        }
    }

    // when input field is in focus and up/down arrows, enter or esc pressed,  
    // select appropriate item from the list of suggestions
    inputKeyDownHandler = (e) => {
        this.hideSearchTip(e.target.value);
        
        switch (e.keyCode){

            // down arrow
            case 40: {
                e.preventDefault();
                const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
                if (selectedIndex === this.state.searchSuggestions.length - 1){
                    this.markSelected(0);
                    return;
                }
                this.markSelected(selectedIndex+1);
                break;
            }
            
            // up arrow
            case 38: {
                e.preventDefault();

                const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
                if (selectedIndex === 0){
                    this.markSelected(this.state.searchSuggestions.length - 1);
                    return;
                }
                this.markSelected(selectedIndex-1);
                break;
            }

            // enter
            case 13: {
                const selectedIndex = this.state.searchSuggestions.findIndex(item => item.selected);
                if (selectedIndex !== -1){
                    const selected = this.state.searchSuggestions[selectedIndex];
                    
                    const word = `${selected.city}, ${selected.country}`;

                    const selectedCity = {
                        id:             selected.id,
                        cityName:       selected.city,
                        countryCode:    selected.country,
                    };
                    
                    this.setState({ 
                        searchValue: word,
                        city: selectedCity 
                    });

                    this.setState({ searchSuggestions: [] });
                    this.props.loadWeatherForCity(selectedCity);
                }
                else{
                    this.showSearchTip(e.target.value);
                }
                break;
            }

            // esc
            case 27: {
                e.preventDefault();

                this.setState({ searchValue: constructSearchBoxValue(this.state.city) });
                this.setState({ searchSuggestions: [] });

                e.target.blur();
                break;
            }
            default: 
                break;
        }
    }

    // do not submit form when 'Enter' pressed
    handleSubmit = (e) => {
        e.preventDefault();
    }

    // set selected city from citySuggestions list
    markSelected = (index) => {
        if (this.state.searchSuggestions.length === 0){
            return;
        }
        const suggestions = Array.from(this.state.searchSuggestions)
                                 .map(item => {
                                     item.selected = false;
                                     return item;
                                 });
        suggestions[index].selected = true;
        this.setState({ searchSuggestions: suggestions });
    }

    // highlight city in citySuggestions list when mouse is hovering it
    mouseOverCity = (e) => {
        const index = this.state.searchSuggestions.findIndex(item => item.id === parseInt(e.target.dataset['id'], 10));
        this.markSelected(index);
    }

    // select city in citySuggestions list once clicked
    // and call parent component method to load weather for the selected city
    handleCityClick = (e) => {
        const word = `${e.target.dataset["city"]}, ${e.target.dataset["country"]}`;
        this.setState({ searchValue: word });

        const selectedCity = {
            id:             parseInt(e.target.dataset["id"], 10),
            cityName:       e.target.dataset["city"],
            countryCode:    e.target.dataset["country"],
        };
        this.setState({ city: selectedCity });

        this.setState({ searchSuggestions: [] });

        this.props.loadWeatherForCity(selectedCity);
    }

    isElementActive = (elementRef) => {
        if (document.activeElement === ReactDOM.findDOMNode(elementRef)){
            return true;
        }
        return false;
    }

    componentDidUpdate(){
        if (!this.props.city) {
            return;
        }
        
        if ( (this.props.city.id !== this.state.city.id)  || 
             (this.state.searchValue.length === 0 && !this.isElementActive(this.refs.searchInput)) ){
            this.setState({ 
                city: this.props.city, 
                searchValue: constructSearchBoxValue(this.props.city)
            });
        }
    }

    render() {
        const selectedStyle = {
            background: 'rgb(26, 176, 211)',
            color: 'white'
        }
        const suggestions = this.state.searchSuggestions || [];
        return(
            <div className="search-box">
                {
                    this.state.searchTip
                        ? 
                            <div className="tip">
                                <span className="info">ℹ</span> 
                                Consider adding country code for best search results.
                                Example: <span className="example">London, UK</span>
                            </div>
                        : 
                            null
                }
                <form className="search-form" onSubmit={this.handleSubmit}>
                    <input type="text" 
                        ref="searchInput"
                        autoComplete="false"
                        autoCorrect="false"
                        autoCapitalize="false"
                        spellCheck="false"
                        value={this.state.searchValue}
                        onKeyDown={this.inputKeyDownHandler}
                        onChange={this.typingHandler}
                        onFocus={this.focusHandler}
                        onBlur={this.blurHandler}/>
                    <img src={weatherIcons['pen']}  alt="Enter city"/>
                </form>
            
                <div className="suggestions-wrapper">
                    <ul className="city-suggestions">
                        {suggestions.map((item,i) => <li key={`${item.id}_${i}`}
                                                         data-id={item.id} 
                                                         data-city={item.city}
                                                         data-country={item.country}
                                                         onClick={this.handleCityClick}
                                                         onMouseOver={this.mouseOverCity}
                                                         style={
                                                            item.selected
                                                                ? selectedStyle
                                                                : null
                                                         }>
                                                         {item.city}, {item.country}
                                                     </li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    city: PropTypes.shape({
        id: 			PropTypes.number,
		cityName: 		PropTypes.string,
        countryCode:    PropTypes.string,
        gmtOffset:      PropTypes.number,
    }).isRequired,
    loadWeatherForCity: PropTypes.func.isRequired,
};


export default SearchBox;