import React, { useEffect } from 'react';
import regression from 'regression';
import LineGraph from './LineGraph.component';
import Typography from '@material-ui/core/Typography'

function Regression({
	mappedData,
	currentFilterTerm,
	currentGraphType,
	currentGraphTypeSet,
	currentGraphResultSet,
	region,
	daysFromNow
}) {
	// const data = [[0, 1], [32, 67], [12, 79]]
	const data = mappedData;
	const resultlinear = regression.linear(data);
	// console.log('linear equation:', resultlinear.string, resultlinear.r2, resultlinear);
	const resultexponetial = regression.exponential(data);
	// console.log('exponentional equation:', resultexponetial.string, resultexponetial.r2, resultexponetial);
	// eslint-disable-next-line
	let graphTypeName;
	let graph;
	let prediction
	let days = isNaN(daysFromNow)? 0 : daysFromNow
	if (Math.abs(resultlinear.r2) > Math.abs(resultexponetial.r2) || isNaN(resultexponetial.r2)) {
		graphTypeName = 'Linear';
		graph = resultlinear;
		prediction = resultlinear.predict(data[0][0]+days)
	} else {
		graphTypeName = 'Exponential';
		graph = resultexponetial;
		prediction = resultexponetial.predict(mappedData[0][0]+days)
	}

	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	useEffect(
		() => {
			let data = { Linear: resultlinear, Exponential: resultexponetial };
			currentGraphResultSet(data);
		},
		// eslint-disable-next-line
		[ currentFilterTerm, region ]
	);
	return (
		
		<div>
			<LineGraph
				originalData={mappedData
					.map((data) => {
						return { x: data[0], y: data[1] / 10000 };
					})
					.filter((data) => data.x < day)}
				predictedData={graph.points
					.map((data) => {
						return { x: data[0], y: data[1] / 10000 };
					})
					.filter((data) => data.x < day)}
				currentFilterTerm={currentFilterTerm}
				currentGraphType={currentGraphType}
				currentGraphTypeSet={currentGraphTypeSet}
			/>
			<Typography style={{margin:"20px"}}>Prediction of {days} day(s) from now: {Math.floor(prediction[1])}</Typography>
		</div>
	);
}

export default Regression;
