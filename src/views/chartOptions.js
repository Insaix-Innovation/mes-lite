//chartjs
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
					display: false,
				},
			},
		],
	},
	elements: {
		bar: {
			borderRadius: 0,
		},
	},
};

//apexchart
export const barChartOptions2 = () => ({
	chart: {
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	xaxis: {
		categories: ["A", "B", "C", "D", "E", "F", "J", "K", "M"],
	},
	yaxis: {
		labels: {
			show: false,
		},
	},
	grid: {
		show: false,
	},
	legend: {
		show: true,
		position: "top",
		horizontalAlign: "center",
	},
});

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
		enabled: true,
	},
	legend: {
		display: true,
	},
};

export const horizontalBarChartOpt = (series) => ({
	options: {
		chart: {
			type: "bar",
			height: 350,
			stacked: true,
			toolbar: {
				show: false,
			},
		},
		series: series,
		plotOptions: {
			bar: {
				horizontal: true,
			},
		},
		stroke: {
			width: 1,
			colors: ["#fff"],
		},
		xaxis: {
			categories: ["MachineStatus"],
			max: 1440,
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		fill: {
			opacity: 1,
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: "top",
			horizontalAlign: "center",
			itemMargin: {
				horizontal: 10, // Adjust spacing between legend items
			},
			labels: {},
			customLegendItems: [
				"Idle",
				"Initializing",
				"Ready",
				"Error",
				"Running",
			],
			onItemClick: {
				toggleDataSeries: false,
			},
			onItemHover: {
				highlightDataSeries: false,
			},
		},
		tooltip: {
			y: {
				formatter: true,
				title: {
					formatter: (label) => {
						const legendLabels = {
							idle: "Idle",
							initializing: "Initializing",
							ready: "Ready",
							running: "Running",
							error: "Error",
						};
						const lab = label.split("-")[0];
						return `${legendLabels[lab]} :`;
					},
				},
			},
		},
		grid: {
			show: false,
		},
	},
});

export { barChartOptions, doughnutOptions, horizontalBarOptions };
