import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './main-section.scss';

import { getCityByIP, 
		 getCurrentWeather, 
		 getGMTOffsetByCoordinates, 
		 getWeatherForecast 
	} from '../DataProviders';
	
import { removeDuplicates } from '../helpers';
import { weatherIcons } from '../weather-icons';

import CityLog from './CityLog';
import CurrentWeather from './CurrentWeather';
import DateString from './DateString';
import Error from './Error';
import ForecastSection from './ForecastSection';
import Loader from './Loader';
import SearchBox from './SearchBox';


const DEFAULT_CITY_LOG_LENGTH = 5;

class MainSection extends React.Component {
    state = {
		city: 		null,
		cityLog: 	null,
		weather: 	null,
		forecast: 	null,
		isFetching: false,
		errorText: 	null,
		bgImage: 	null,
    };

    getCityLogFromLocalStorage = () => {
		if (localStorage.getItem(`cityLog`)){
			return JSON.parse(localStorage.getItem(`cityLog`));
		}
		return null;
    }

    setCityData = (cityData, timezoneData = null) => {
		
		if (timezoneData && !cityData.gmtOffset){
			cityData.gmtOffset = timezoneData.gmtOffset;
		}
		this.setState({ city: cityData });
    }
    
    setWeatherData = (weatherData) => {
		if (!weatherData){
			return;
		}
		this.setState({ weather: weatherData });
    }
    
    addCityToLog = (cityData, gmtOffset = null) => {
		if (gmtOffset){
			cityData.gmtOffset = gmtOffset;
		}
		
		const currentCityLog = Array.from(this.state.cityLog || []);

        // don't do anyting if current city is already the last item in the cityLog:
		if (currentCityLog.length > 0){
			if (currentCityLog[0].id === cityData.id){
				return;
			}
		}
        
        // otherwise, add city to cityLog array as first item, avoiding duplicates:
		currentCityLog.unshift(cityData);
		const uniqueCityLog = removeDuplicates(currentCityLog);

		if (uniqueCityLog.length > DEFAULT_CITY_LOG_LENGTH){     // TODO: Add CITY_LOG_LENGTH to settings
			uniqueCityLog.splice(-1, 1);
		}

		this.setState({ cityLog: uniqueCityLog });
		localStorage.setItem(`cityLog`, JSON.stringify(uniqueCityLog));
	}

    loadWeatherForCity = async (cityData) => {

		this.setState({ errorText: null });

        if (!cityData.id){
			this.setState({ errorText: `Incorrect city id.`});
            return;		
        }

		// begin fetching data:
		this.setState({ isFetching: true });
		
		const weatherData = await getCurrentWeather(cityData.id, this.props.settings.units);
		if (!weatherData){
			this.setState({ errorText: `Error fetching weather data.`});
			this.setState({ isFetching: false });
			return;
		}

        // retrieve gmtOffset value, if it's missing
        let gmtOffset = null; 
		if (!cityData.gmtOffset && weatherData.hasOwnProperty('lat')){
            gmtOffset = await getGMTOffsetByCoordinates(weatherData.lat, weatherData.lon);
		}

		const forecast = await getWeatherForecast(cityData.id, this.props.settings.units, gmtOffset);
		this.setState({ forecast });

		// set city name and country code from weather response
		cityData.cityName = weatherData.city;
		cityData.countryCode = weatherData.country;

		this.props.setBackgroundImage(cityData.cityName, weatherData.description);

		this.setCityData(cityData, gmtOffset);
		this.setWeatherData(weatherData);
		this.addCityToLog(cityData, gmtOffset);
		this.setState({ isFetching: false });

		this.props.history.push(`/${cityData.id}`);  
	}

    
    async componentDidMount(){

		let cityLog = null;
		let cityData = null;

		// get cityLog and cityData from LocalStorage, if available
		if (!this.state.cityLog){
            cityLog = this.getCityLogFromLocalStorage();
            if (cityLog) {
                cityData = cityLog[0];
            }
		}

		const path = this.props.match.path;
		switch (path){

            // if there's no city in localStorage, define city from user's IP address:
			case "/": 
				if (!cityData){
					this.setState({ isFetching: true });
					cityData = await getCityByIP();
					this.setState({ isFetching: false });
				}
				break;

			// load weather for a requested cityId
			case "/:id": 
				cityData = {
					id: 			parseInt(this.props.match.params.id, 10) || null,
					cityName: 		null,
					countryCode: 	null,
				};
                break;

            default: break; 
		}
        
        if (cityLog) {
            this.setState({ cityLog });
        }
		
		this.loadWeatherForCity(cityData);
	}

    render() {

		if (this.state.isFetching){
			return (
				<Loader />
				);
		}
        else if ( (!this.state.weather || !this.state.city) && !this.state.isFetching) {
            return (
				<Error message={this.state.errorText}
					   goBack={this.props.history.goBack} />
				);
        }
        else return(
            <div className="main-section">  
				<div className="section">
					<div className="date-wrapper">
						<DateString seconds={this.state.weather.date}
									keepComma={true}/> 

						<div className="settings-icon">
							<Link to="/settings" ><img src={weatherIcons['settings']} alt="Settings"/></Link>
						</div>
					</div>
					
					<CityLog cities={this.state.cityLog}           
							loadWeatherForCity={this.loadWeatherForCity}/>  

					<SearchBox city={this.state.city}
							loadWeatherForCity={this.loadWeatherForCity}/>

					<CurrentWeather city={this.state.city}
									weather={this.state.weather}
									settings={this.props.settings}/>
				</div>

				<div className="section">
					{
						this.state.forecast
							? 
								<ForecastSection forecast={this.state.forecast}
												settings={this.props.settings}/>
							:
								null
					}
				</div>
				
            </div>
        );
    }
    
}

export default MainSection; 

MainSection.propTypes = {
	settings: 			PropTypes.shape({
        units: 			PropTypes.oneOf(['imperial', 'metric']).isRequired,
	}).isRequired,

	setBackgroundImage: PropTypes.func.isRequired,
	history: 			PropTypes.object.isRequired,
	match: 				PropTypes.object.isRequired,
}
