import React from 'react';
import { Form } from 'semantic-ui-react';
import * as _ from 'underscore';

import '../styles/Filters.css'

export default class Filters extends React.Component {
	render() {
		let topics = _.chain(this.props.indics)
			.keys()
			.map((d) => {
				return { key: d, value: d, text: d };
			})
			.value();

		let indicators = !_.isEmpty(this.props.indics) ? this.props.indics[this.props.topic].map((d) => ({
			key: d.indicator, value: d.indicator, text: d.indicator
		})) : [];

		return (
			<div className="Filters">
				<Form>
					<Form.Group widths="equal">
						<Form.Select
							name="topic"
							id="topic-select"
							label="Topic"
							value={this.props.topic}
							options={topics}
							onChange={this.props.onChange}
							className="div5000"
						/>
						<Form.Select
							name="indicator"
							id="indicator-select"
							label="Indicator"
							value={this.props.indicator}
							options={indicators}
							onChange={this.props.onChange}
							className="div4000"
						/>
					</Form.Group>
				</Form>
			</div>
		)
	}
}
