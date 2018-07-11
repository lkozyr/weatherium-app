import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './app.scss';

import MainSection from './MainSection';
import Settings from './Settings';
import Footer from './Footer';

class App extends React.Component {

    constructor(){
        super();
        let settings = JSON.parse(localStorage.getItem(`settings`)) || { units: 'metric' };
        // if (!settings){
        //     settings = { units: 'metric' };
        // }
        this.state = { settings };
    }

    updateSettings = value => {

        const settings = { units: value };
        this.setState({ settings });
        localStorage.setItem(`settings`, JSON.stringify(settings));
    }

	render() {
		return (
            <div className="app">
                <Switch> 
                    <Route exact path='/' 
                                render={ (props) =>( <MainSection settings={this.state.settings}
                                                                  {...props} /> ) } />

                    <Route exact strict path='/settings' 
                                        render={ ({history})=>(<Settings settings={this.state.settings}
                                                                        updateSettings={this.updateSettings} 
                                                                        history={history}/>) } />
                    <Route path='/:id' 
                            render={ ({match, history})=>(<MainSection settings={this.state.settings}
                                history={history}
                                match={match}/>) } />
                    
                </Switch>

                <Footer />
			</div>
		);
	}
}

export default App;

//TODO:
// 1. Should I rewrite {match, history} to just (props)???
//        Example:  render={ (props) =>( <MainSection settings={{}/*this.state.settings*/} {...props} /> ) } />

