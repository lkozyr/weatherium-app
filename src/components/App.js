
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './app.scss';
import Footer from './Footer';
import MainSection from './MainSection';
import Settings from './Settings';

class App extends React.Component {

    constructor(){
        super();
        let settings = JSON.parse(localStorage.getItem(`settings`)) || { units: 'metric' };
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
                                render={ (props) => ( <MainSection settings={this.state.settings}
                                                                   {...props} /> ) } />

                    <Route exact strict path='/settings' 
                                        render={ ({history})=> (<Settings settings={this.state.settings}
                                                                        updateSettings={this.updateSettings} 
                                                                        history={history}/>) } />
                    <Route path='/:id' 
                            render={ (props) => (<MainSection settings={this.state.settings}
                                                              {...props}/>) } />
                    
                </Switch>

                <Footer />
			</div>
		);
	}
}

export default App;
