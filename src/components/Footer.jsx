import React from 'react';
import { Segment } from 'semantic-ui-react';

const text1 = 'Source: DataHaven analysis (2017) of US Census Bureau American Community Survey 2016 5-year estimates.';
const text2 = 'Note on neighborhood boundaries: Some smaller Stamford neighborhoods were combined to ensure more accurate calculations. These are Palmers Hill, Roxbury, and Westover; and Cove and East Side.';

const Footer = () => (
	<Segment secondary basic>
		<p>{text1}</p>
		<p>{text2}</p>
		<p><a href="https://github.com/ct-data-haven/stam2016/blob/master/public/data/2016_stam_display.csv">Download all Stamford 2016 profile data</a></p>
	</Segment>
);

export default Footer;
