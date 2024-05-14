const barChartOptions = {
	maintainAspectRatio: false,
	legend: {
		display: true,
		position: "top",
	},
	scales: {
		xAxes: [
			{
				gridLines: {
					display: false,
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					min: 0,
                    display: false
				},
			},
		],
	},
	elements: {
		bar: {
			borderRadius: 20, // Set border radius of bars to 0
		},
	},
};

const doughnutOptions = {
	responsive: true,
	maintainAspectRatio: false,
	cutoutPercentage: 74,
	legend: {
		display: true,
		position: "top",
	},
};

const horizontalBarOptions = {
	maintainAspectRatio: false,
	responsive: true,
	scales: {
		xAxes: [
			{
				stacked: true,
				gridLines: {
					display: false,
				},
			},
		],
		yAxes: [
			{
				stacked: true,
				gridLines: {
					display: false,
				},
			},
		],
	},
	tooltips: {
		enabled: false,
	},
	legend: {
		display: false, // Disable legend
	},
};

export { barChartOptions, doughnutOptions, horizontalBarOptions };
