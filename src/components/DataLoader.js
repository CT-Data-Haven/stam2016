import { csv } from 'd3-request';
import { queue } from 'd3-queue';
import { format } from 'd3-format';
import { nest } from 'd3-collection';
import * as _ from 'underscore';
import { uniqWith } from 'lodash';

const url = './data/stamdata.csv';

export const loadData = (callback = _.noop) => {
	queue()
		.defer(csv, url)
		.await((error, datacsv) => {
			if (error) throw error;

			// let data = cleanData(datacsv);
			let data = _.sortBy(cleanData(datacsv), 'topicOrder', 'order', 'geoType', 'neighborhood');
			let indics = makeIndicators(data);

			callback({
				initData: data,
				indics: indics
			});
		});
};

const cleanData = (data) => {
	return _.each(data, (d) => {
		d.value = +d.value;
		d.displayVal = format(d.format)(d.value);
		d.topicOrder = +d.topicOrder;
		d.order = +d.order;
	});
};

const makeIndicators = (data) => {
	let indics = _.chain(data)
		.filter((d) => d.type === 'map')
		.map((d) => _.pick(d, 'topic', 'indicator'))
		.value();
	let uniques = uniqWith(indics, _.isEqual);
	return nest()
		.key((d) => d.topic)
		.object(uniques);
};
