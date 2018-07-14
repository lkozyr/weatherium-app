import React from "react";
import { Route, Switch } from "react-router-dom";

import "./app.scss";
import { getBackgroundImage } from "../DataProviders";
import Footer from "./Footer";
import MainSection from "./MainSection";
import Settings from "./Settings";

class App extends React.Component {
	constructor() {
		super();
		let settings = JSON.parse(localStorage.getItem(`settings`)) || {
			units: "metric",
		};
		this.state = { settings };
	}

	updateSettings = value => {
		const settings = { units: value };
		this.setState({ settings });
		localStorage.setItem(`settings`, JSON.stringify(settings));
	};

	setBackgroundImage = async (cityName = "", weatherDescription = "") => {
		if (
			document.body.style.getPropertyValue("--body-bg-url").length > 0 &&
			cityName.concat(weatherDescription).length === 0
		) {
			return;
		}

		const bgImage = {
			url: null,
			date: 0,
		};
		let today = Date.now();
		if (localStorage.getItem(`bgImage`)) {
			bgImage.url = JSON.parse(localStorage.getItem(`bgImage`)).url;
			bgImage.date = JSON.parse(localStorage.getItem(`bgImage`)).date;
		}
		if (!bgImage.url || today - bgImage.date > 1000 * 60 * 60 * 24) {
			bgImage.url = await getBackgroundImage(
				cityName,
				weatherDescription,
			);
			bgImage.date = Date.now();
			localStorage.setItem(`bgImage`, JSON.stringify(bgImage));
		}

		document.body.style.setProperty(
			"--body-bg-url",
			`url('${bgImage.url}')`,
		);
	};
	componentDidMount() {
		this.setBackgroundImage();
	}

	render() {
		return (
			<div className="app">
				<Switch>
					<Route
						exact
						path="/"
						render={props => (
							<MainSection
								settings={this.state.settings}
								setBackgroundImage={this.setBackgroundImage}
								{...props}
							/>
						)}
					/>

					<Route
						exact
						strict
						path="/settings"
						render={({ history }) => (
							<Settings
								settings={this.state.settings}
								updateSettings={this.updateSettings}
								history={history}
							/>
						)}
					/>
					<Route
						path="/:id"
						render={props => (
							<MainSection
								settings={this.state.settings}
								setBackgroundImage={this.setBackgroundImage}
								{...props}
							/>
						)}
					/>
				</Switch>

				<Footer />
			</div>
		);
	}
}

export default App;
