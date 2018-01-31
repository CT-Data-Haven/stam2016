import React, { Component } from 'react';
import { Grid, Header, Tab } from 'semantic-ui-react';
import * as _ from 'underscore';
import { ckmeans } from 'simple-statistics';
import { scaleThreshold } from 'd3-scale';
import { nest } from 'd3-collection';
import { schemeGnBu } from 'd3-scale-chromatic';
import './App.css';

import Filters from './components/Filters';
import Profile from './components/Profile';
import CityMap from './components/CityMap';
import Chart from './components/Chart';
import DataTable from './components/DataTable';
import Intro from './components/Intro';
import Footer from './components/Footer';

const shape = require('./components/stamford.json');
const reset = { topic: 'Age', indicator: 'Percent under age 18', hood: 'Belltown' };

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topic: reset.topic,
			indicator: reset.indicator,
			// indicators available for this topic
			indicators: [],
			// data for all indicators in this topic
			toTable: [],
			// data for selected indicator
			toMap: [],
			toChart: [],
			hood: reset.hood,
			colorscale: scaleThreshold({ domain: [0, 1], range: ['#ccc'] }),
			sortCol: null,
			isAscending: null
		}
	}

	componentDidMount() {
		let { topic, indicator } = this.state;
		let opts = { topic, indicator };
		this.update({ ...opts });
	}

	fetchData({ topic }) {
		return _.where(this.props.initData, { topic: topic });
	}

	update(opts) {
		let indicator = opts.indicator;
		let fetch = this.fetchData(opts);
		//
		let topicData = nest().key((d) => d.indicator).object(fetch);
		// let toTable = nest().key((d) => d.neighborhood).entries(_.values(fetch));
		// let toTable = _.indexBy(fetch, 'neighborhood');
		let toTable = _.sortBy(this.makeWide(_.values(fetch)), null);
		let data = topicData[indicator];
		let toMap = _.indexBy(data, 'neighborhood');
		let toChart = _.values(toMap).sort((a, b) => b.value - a.value);

		this.setState({
			data,
			indicator,
			toMap,
			toChart,
			topicData,
			toTable,
			colorscale: this.makeScale(toMap),
			isAscending: null,
			sortCol: null
		});
	}

	makeWide(data) {
		return nest()
			.key((d) => d.neighborhood)
			.rollup((d) => {
				return d.reduce((prev, curr) => {
					prev.Neighborhood = curr.neighborhood;
					prev[curr.indicator] = curr.value;
					return prev;
				}, {});
			})
			// .entries(data);
			.object(data);
	}

	makeScale(data) {
		// don't include citywide, regional, etc values in making scale
		let vals = _.chain(data)
			.where({ geoType: '1_neighborhood' })
			.pluck('value')
			.sort((a, b) => a - b)
			.value();
		// let vals = _.pluck(data, 'value').sort((a, b) => a - b);
		if (!vals.length) {
			return scaleThreshold().domain([0, 1]).range(['#ccc']);
		} else {
			let brks = ckmeans(vals, 5).map((d) => d[0]).slice(1);
			return scaleThreshold()
				.domain(brks)
				.range(schemeGnBu[5]);
		}
	}

	handleChange = (e, { name, value }) => {
		let indicator = name === 'topic' ? this.props.indics[value][0].indicator : this.state.indicator;
		let { topic } = this.state;
		let opts = { topic, indicator };

		this.update({ ...opts, [name]: value });

		this.setState({
			[name]: value
		});
	};

	handleVizClick = (hood) => {
		this.setState({
			hood
		});
	};

	handleSort = (column) => () => {
		// toggle direction if this is already the sort column
		let isAscending = _.isNull(this.state.isAscending) ? true : !this.state.isAscending;
		let data = _.sortBy(this.state.toTable, column);
		this.setState({
			toTable: isAscending ? data : data.reverse(),
			sortCol: column,
			isAscending
		});
	};

	render() {
		// console.log(this.state.data);

		let panes = [
			{ menuItem: { key: 'map', icon: 'globe', content: 'Show map' }, render: () => (
				<Tab.Pane attached={false}>
					<Header as="h4">{this.state.indicator} by neighborhood, 2016</Header>
					<CityMap
						data={this.state.toMap}
						shape={shape}
						width={380}
						height={420}
						colorscale={this.state.colorscale}
						handleClick={this.handleVizClick}
					/>
				</Tab.Pane>
			)},
			{ menuItem: { key: 'chart', icon: 'bar chart', content: 'Show chart' }, render: () => (
				<Tab.Pane attached={false}>
					<Header as="h4">{this.state.indicator} by neighborhood, 2016</Header>
					<Chart
						data={this.state.toChart}
						hood={this.state.hood}
						width={500}
						height={420}
						handleClick={this.handleVizClick}
					/>
				</Tab.Pane>
			)}
		];

		return (
			<div className="App">
				<Grid stackable container>
					<Grid.Row>
						<Grid.Column width={16}>
							<Intro />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={10}>
							<Filters
								topic={this.state.topic}
								indicator={this.state.indicator}
								indics={this.props.indics}
								onChange={this.handleChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={10}>
							<Tab menu={{ secondary: true, pointing: true, color: 'blue' }} panes={panes} />
						</Grid.Column>
						<Grid.Column width={6}>
							<Profile
								data={this.state.topicData}
								hood={this.state.hood}
								topic={this.state.topic}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={16}>
							<DataTable
								data={this.state.toTable}
								handleSort={this.handleSort}
								sortCol={this.state.sortCol}
								isAscending={this.state.isAscending}
								hood={this.state.hood}
								handleClick={this.handleVizClick}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={16}>
							<Footer />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

export default App;
