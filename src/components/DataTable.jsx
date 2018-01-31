import React from 'react';
import { Table } from 'semantic-ui-react';
import * as _ from 'underscore';
import { format } from 'd3-format';
import '../styles/DataTable.css';

const percent = format('.0%');
const comma = format(',');

const formatNumber = (s) => (s > 0 && s < 1) ? percent(s) : comma(s);


export default class DataTable extends React.Component {
	render() {
		let header;
		let rows;
		let data;

		if (this.props.data.length) {
			data = this.props.data;
			let direction = this.props.isAscending ? 'ascending' : 'descending';
			header = _.chain(data[0])
				.keys()
				.map((d, i) => (
					<Table.HeaderCell
						key={i}
						onClick={this.props.handleSort(d)}
						sorted={this.props.sortCol === d ? direction : null}>{d}</Table.HeaderCell>
				))
				.value();
			rows = _.chain(data)
				.values()
				.map((row, i) => {
					let hood = row.Neighborhood;
					let cells = _.map(row, (d, j) => {
						return _.isNumber(d) ?
							<Table.Cell key={j} textAlign="right">{formatNumber(d)}</Table.Cell> :
							<Table.Cell key={j} textAlign="left">{d}</Table.Cell>;
					});
					return <Table.Row
						key={i}
						positive={this.props.hood === hood}
						onClick={(e) => this.props.handleClick(hood)}
						>{cells}</Table.Row>;
				})
				.value();
		} else {
			header = null;
			rows = null;
			data = [];
		}

		return (
			<div className="DataTable">

				<Table compact unstackable selectable sortable celled color="blue" size="small">
					<Table.Header>
						<Table.Row>{header}</Table.Row>
					</Table.Header>
					<Table.Body>{rows}</Table.Body>
				</Table>

			</div>
		);
	}
}
