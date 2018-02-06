import React from 'react';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import { Grid } from 'semantic-ui-react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Legend from './Legend';

import '../styles/CityMap.css';

export default class CityMap extends React.Component {
	constructor(props) {
		super(props);
		// const topo = topojson.feature(this.props.topology, this.props.topology.objects.bpt_shape);
		const b = topojson.bbox(props.topology);
		this.bbox = [[ b[1], b[0] ], [ b[3], b[2] ]];
		this.shape = topojson.feature(props.topology, props.topology.objects.stamford);
		this.blob = topojson.merge(props.topology, props.topology.objects.stamford.geometries);
	}

	updateColor = (geography) => {
		let name = geography.properties.Name;
		let color = this.props.data[name] ? this.props.color(this.props.data[name].value) : '#ccc';

		return {
			fillColor: color,
			color: '#eee',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.85
		};
	};

	onEachFeature = (feature, layer) => {
		let name = feature.properties.Name;

		// layer.on('click', this.props.handleClick)
		layer.on('click', (e) => this.props.handleClick(e.target.feature.properties.Name))
			.on('mouseover', this.addHilite)
			.on('mouseout', this.removeHilite);
		layer.bindTooltip(() => {
			return this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		}, { direction: 'top', offset: [0, -20], className: 'custom-tip' });
	};

	addHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.95,
			weight: 1
		});
		// .bringToFront();
	};

	removeHilite = (e) => {
		e.target.setStyle({
			fillOpacity: 0.75,
			weight: 0.5
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		return (
			<div className="CityMap">
				<Grid reversed="mobile" container stackable>
					<Grid.Column width={16}>

						<Map
							bounds={this.bbox}
							scrollWheelZoom={false}
							zoomSnap={0.25}
							zoomDelta={0.25}
						>
							<TileLayer
								url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}"
								attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								subdomains='abcd'
								minZoom={0}
								maxZoom={20}
								ext='png'
								opacity={0.4}
							/>
							<GeoJSON
								data={this.shape}
								key={(feature) => feature.properties.Name}
								style={this.updateColor}
								onEachFeature={this.onEachFeature}
							/>
							<GeoJSON
								data={this.blob}
								style={{
									fillColor: 'transparent',
									color: '#333',
									weight: 1.5,
									pointerEvents: 'none'
								}}
								interactive={false}
							/>
						</Map>
						<Legend colorscale={this.props.color} />
					</Grid.Column>
				</Grid>
			</div>
		)
	}
}
