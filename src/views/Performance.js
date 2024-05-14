import Chart from "chart.js";
import classnames from "classnames";
import pflImage from "../assets/img/pfl.png";
import { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {barChartOptions, doughnutOptions} from "./chartOptions.js";
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
import Pagination from "components/Pagination";

const Performance = (props) => {

	const barChartData = {
		labels: ["A", "B", "C", "D", "E", "F", "J", "K", "M"],
		datasets: [
			{
				label: "Performance",
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
				data: [30, 40, 50],
				backgroundColor: ["#051548", "#33FAFF", "#a0a0a0"],
			},
		],
		labels: ["A", "B", "C"],
	};

	const sampleData = [
		{
			machine: "A",
			date: "2024-05-12",
			cycleTime: 10,
			target: 12,
			output: 100,
			runTime: "08:00 - 16:00",
			performance: "85%",
		},
		{
			machine: "B",
			date: "2024-05-12",
			cycleTime: 8,
			target: 10,
			output: 120,
			runTime: "07:00 - 15:00",
			performance: "90%",
		},
		{
			machine: "C",
			date: "2024-05-12",
			cycleTime: 12,
			target: 15,
			output: 80,
			runTime: "09:00 - 17:00",
			performance: "80%",
		},
		{
			machine: "D",
			date: "2024-05-12",
			cycleTime: 9,
			target: 11,
			output: 110,
			runTime: "08:30 - 16:30",
			performance: "95%",
		},
		{
			machine: "E",
			date: "2024-05-12",
			cycleTime: 11,
			target: 14,
			output: 95,
			runTime: "08:00 - 16:00",
			performance: "68%",
		},
	];

	const [currentPage, setCurrentPage] = useState(1);
	let pageSize = 4;

	const firstPageIndex = (currentPage - 1) * pageSize;
	const lastPageIndex = firstPageIndex + pageSize;
	const currentTableData = sampleData.slice(firstPageIndex, lastPageIndex);

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="header-body">
						<Row className="mb-4">
							<Col lg="6" xl="3">
								<Card
									className="card-stats mb-4 mb-xl-0"
									style={{
										height: "120px",
										backgroundColor: "#120639",
									}}
								>
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle
													tag="h3"
													className="mb-3"
													style={{ color: "white" }}
												>
													Overall Target
												</CardTitle>
												<span
													className="h2 font-weight-bold mb-0"
													style={{ color: "white" }}
												>
													89,000
												</span>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col lg="6" xl="3">
								<Card
									className="card-stats mb-4 mb-xl-0"
									style={{ height: "120px" }}
								>
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle
													tag="h3"
													className=" mb-3"
												>
													Overall Output
												</CardTitle>
												<span className="h2 font-weight-bold mb-0">
													74,845
												</span>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col lg="6" xl="3">
								<Card
									className="card-stats mb-4 mb-xl-0"
									style={{ height: "120px" }}
								>
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle
													tag="h3"
													className="mb-3"
												>
													Overall Run Time
												</CardTitle>
												<span className="h2 font-weight-bold mb-0">
													60
												</span>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col lg="6" xl="3">
								<Card
									className="card-stats mb-4 mb-xl-0"
									style={{ height: "120px" }}
								>
									<CardBody>
										<Row>
											<div className="col">
												<CardTitle
													tag="h3"
													className=" mb-3"
												>
													Overall Performance
												</CardTitle>
												<span className="h2 font-weight-bold mb-0">
													97%
												</span>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
						</Row>
						<Row className="mb-4">
							<Col md="8">
								<Card>
									<CardHeader>Performance Per Day</CardHeader>
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
									<CardHeader>Overall Performance</CardHeader>
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
													<th scope="col">
														Cycle Time
													</th>
													<th scope="col">Target</th>
													<th scope="col">Output</th>
													<th scope="col">
														Run Time
													</th>
													<th scope="col">
														Performance
													</th>
												</tr>
											</thead>
											<tbody>
												{currentTableData.map(
													(data, index) => (
														<tr key={index}>
															<td>
																{data.machine}
															</td>
															<td>{data.date}</td>
															<td>
																{data.cycleTime}
															</td>
															<td>
																{data.target}
															</td>
															<td>
																{data.output}
															</td>
															<td>
																{data.runTime}
															</td>
															<td>
																{
																	data.performance
																}
															</td>
														</tr>
													)
												)}
											</tbody>
											<tr>
												<td colSpan={7}>
													<div className="pagination d-flex justify-content-center">
													<Pagination
														className="pagination-bar mb-0"
														currentPage={
															currentPage
														}
														totalCount={
															sampleData.length
														}
														pageSize={pageSize}
														onPageChange={(page) =>
															setCurrentPage(page)
														}
													/>
													</div>
												</td>
											</tr>
										</Table>
									</Card>
								</div>
							</Col>
						</Row>
					</div>
				</Container>
			</div>
		</>
	);
};

export default Performance;
