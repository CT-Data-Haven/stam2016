import React from 'react';
import { Mercator } from '@vx/geo';
import { ScaleSVG } from '@vx/responsive';
import { LegendThreshold } from '@vx/legend';
import * as topojson from 'topojson-client';
import { format } from 'd3-format';
import Tooltip from 'react-portal-tooltip';
import { Grid } from 'semantic-ui-react';

import '../styles/CityMap.css';

const tipStyle = {
	style: {
		background: '#333',
		opacity: 0.85,
		boxShadow: 0,
		color: 'white',
		fontFamily: 'Barlow',
		fontSize: '0.9em'
	},
	arrowStyle: {
		color: '#333',
		opacity: 0.85,
		borderColor: false
	}
};

export default class CityMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tipString: '',
			hovering: false,
			hoverOver: 'path-belltown'
		};
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
	}
	updateColor = (geography) => {
		let name = geography.properties.Name;
		return this.props.data[name] ? this.props.colorscale(this.props.data[name].value) : '#ccc';
	};

	makeId = (geography) => {
		let name = geography.properties.Name.toLowerCase().replace(/\W/gi, '');
		return `path-${name}`;
	};

	showTooltip = (geography, event) => {
		let name = geography.properties.Name;
		let string = this.props.data[name] ? `${name}: ${this.props.data[name].displayVal}` : `${name}: N/A`;
		let id = `path-${name.toLowerCase().replace(/\W/gi, '')}`;
		this.setState({
			tipString: string,
			hovering: true,
			hoverOver: id
		});
	};

	hideTooltip = () => {
		this.setState({
			hovering: false
		});
	};

	percentFormat(label) {
		return label ? format('.0%')(label) : '';
	}

	render() {
		let topo = topojson.feature(this.props.shape, this.props.shape.objects.stamford);

		return (
			<div className="CityMap">
				<Grid reversed="mobile" container stackable>
					<Grid.Column width={6}>
						<div className="legend-container"
							style={{
								// position: this.props.collapse ? 'relative' : 'absolute',
								// bottom: '3em'
							}}>
							<LegendThreshold
								scale={this.props.colorscale}
								direction="column"
								itemDirection="row"
								labelMargin="2px 0 0 10px"
								shapeMargin="1px 0 0"
								labelFormat={this.percentFormat}
							/>
						</div>
					</Grid.Column>
					<Grid.Column width={10}>
						<div className="map-container"
							style={{
								// maxWidth: this.props.width
							}}>
							<ScaleSVG width={this.props.width} height={this.props.height}>
								<Mercator
									data={topo.features}
									id={this.makeId}
									fitSize={[[this.props.width, this.props.height], topo]}
									stroke="#777"
									fill={this.updateColor}
									onClick={geography => e => this.props.handleClick(geography.properties.Name, 'map')}
									onMouseEnter={(geography) => (event) => {
										this.showTooltip(geography, event);
									}}
									onMouseLeave={(geography) => (event) => {
										this.hideTooltip();
									}}
								/>
							</ScaleSVG>
						</div>
					</Grid.Column>
				</Grid>
				<Tooltip
					active={this.state.hovering}
					position="top"
					arrow="center"
					parent={`#${this.state.hoverOver}`}
					style={tipStyle}
					tooltipTimeout={300}
				>
					<div className="tooltip-content">{this.state.tipString}</div>
				</Tooltip>
			</div>
		)
	}
}
