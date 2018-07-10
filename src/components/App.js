import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './app.scss';

import MainSection from './MainSection';
import Settings from './Settings';
import Footer from './Footer';

class App extends React.Component {
	render() {
		return (
            <div className="app">
                <Switch> 
                    <Route exact path='/' 
                                render={ ({match, history})=>(<MainSection settings={{}/*this.state.settings*/}
                                                                    history={history}
                                                                    match={match}/>) } />

                    <Route exact strict path='/settings' 
                                        render={ ({history})=>(<Settings settings={{}/*this.state.settings*/}
                                                                        updateSettings={this.updateSettings} 
                                                                        history={history}/>) } />
                    <Route path='/:id' 
                            render={ ({match, history})=>(<MainSection settings={{}/*this.state.settings*/}
                                history={history}
                                match={match}/>) } />
                    
                </Switch>

                <Footer />
			</div>
		);
	}
}

export default App;
