import React from 'react';
import { Header, Message } from 'semantic-ui-react';

const text = 'Select a topic and indicator to view either a map or a chart. Clicking a neighborhood on the map, chart, or table will bring up detailed information on that neighborhood. See all neighborhoods in the table below.';


const Intro = () => (
	<div>
		<Header as="h1">Stamford Neighborhood Profiles, 2016</Header>
		<Message info>
			<p>{text}</p>
			<p>For more information on Connecticut's communities and cities, visit DataHaven's <a href="http://www.ctdatahaven.org/communities">Communities</a> page or <a href="http://www.ctdatahaven.org">main website</a>.</p>
		</Message>
	</div>
);

export default Intro;
