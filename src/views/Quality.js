import Chart from "chart.js";
import classnames from "classnames";
import pflImage from "../assets/img/pfl.png";
import { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Badge } from "reactstrap";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Col,
	Container,
	Nav,
	NavItem,
	NavLink,
	Progress,
	Row,
	Table,
} from "reactstrap";

// core components
import {
	chartExample1,
	chartExample2,
	chartOptions,
	parseOptions,
} from "variables/charts.js";

const Quality = (props) => {
	const [activeNav, setActiveNav] = useState(1);
	const [chartExample1Data, setChartExample1Data] = useState("data1");

	if (window.Chart) {
		parseOptions(Chart, chartOptions());
	}

	const toggleNavs = (e, index) => {
		e.preventDefault();
		setActiveNav(index);
		setChartExample1Data("data" + index);
	};

	const barChartData = {
		labels: ["A", "B", "C", "D", "E", "F", "J", "K", "M"],
		datasets: [
			{
				label: "Utilization",
				backgroundColor: "rgba(166,167,247,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(196,187,247,1)",
				data: [65, 59, 80, 81, 56, 55, 40, 20, 50, 80],
			},
		],
	};

	const doughnutData = {
		datasets: [
			{
				data: [30, 40],
				backgroundColor: ["#051548", "#33FAFF", "#a0a0a0"],
			},
		],
		labels: ["Good", "Bad"],
	};

	const barChartOptions = {
		maintainAspectRatio: false,
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
		plugins: {
			legend: {
				position: "top", // Place legend at the top
			},
		},
	};

	const sampleData = [
		{
			machine: "A",
			date: "2024-05-12",
			target: 1000,
			output: 950,
			good: 920,
			bad: 30,
			quality: "92%",
		},
		{
			machine: "B",
			date: "2024-05-12",
			target: 1200,
			output: 1150,
			good: 1100,
			bad: 50,
			quality: "95%",
		},
		{
			machine: "C",
			date: "2024-05-12",
			target: 800,
			output: 780,
			good: 750,
			bad: 30,
			quality: "96%",
		},
		{
			machine: "D",
			date: "2024-05-12",
			target: 1500,
			output: 1400,
			good: 1370,
			bad: 30,
			quality: "98%",
		},
		{
			machine: "E",
			date: "2024-05-12",
			target: 1100,
			output: 1000,
			good: 970,
			bad: 30,
			quality: "97%",
		},
	];

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<Row className="mb-4">
						<Col md="8">
							<Card>
								<CardHeader>Rejects Pareto Chart</CardHeader>
								<CardBody>
									<Bar
										data={barChartData}
										options={barChartOptions}
									/>
								</CardBody>
							</Card>
						</Col>
						<Col md="4">
							<Card>
								<CardHeader>Overall Quality</CardHeader>
								<CardBody>
									<Doughnut
										data={doughnutData}
										options={doughnutOptions}
									/>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<Row className="mb-4">
						<Col>
							<div>
								<Card>
									<CardHeader>Summary</CardHeader>
									<Table
										className="align-items-center table-flush"
										responsive
									>
										<thead>
											<tr className="tableHeader">
												<th scope="col">Machine</th>
												<th scope="col">Date</th>
												<th scope="col">Target</th>
												<th scope="col">Output</th>
												<th scope="col">Good</th>
												<th scope="col">Bad</th>
												<th scope="col">Quality</th>
											</tr>
										</thead>
										<tbody>
											{sampleData.map((data, index) => (
												<tr key={index}>
													<td>{data.machine}</td>
													<td>{data.date}</td>
													<td>{data.target}</td>
													<td>{data.output}</td>
													<td>{data.good}</td>
													<td>{data.bad}</td>
													<td>{data.quality}</td>
												</tr>
											))}
										</tbody>
										<tr>
											<td colSpan={7}>
												<div className="pagination d-flex justify-content-center">
													<Button>1</Button>
													<Button>2</Button>
													<Button>3</Button>
													<Button>4</Button>
													<Button>5</Button>
												</div>
											</td>
										</tr>
									</Table>
								</Card>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Quality;
