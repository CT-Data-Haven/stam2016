import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import * as _ from 'underscore';

import '../styles/Profile.css';

export default class Profile extends React.Component {
	render() {
		let flat = _.chain(this.props.data)
			.values()
			.flatten()
			.filter((d) => d.neighborhood === this.props.hood)
			.value();

		let rows = flat.map((d, i) => (
			<Table.Row key={i}>
				<Table.Cell className={`list-${d.type}`}>{d.indicator}</Table.Cell>
				<Table.Cell textAlign="right">{d.displayVal}</Table.Cell>
			</Table.Row>
		));

		return (
			<div className="Profile">
				<Header as="h4" attached="top">{this.props.topic} - {this.props.hood}</Header>
				<Table definition attached compact unstackable>
					<Table.Body>{rows}</Table.Body>
				</Table>
			</div>
		);
	}
}
