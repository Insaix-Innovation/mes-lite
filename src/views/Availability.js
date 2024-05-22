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
import ApexCharts from "apexcharts";
import { Bar, Line, Pie, Doughnut, HorizontalBar } from "react-chartjs-2";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Pagination from "components/Pagination";
import {
	barChartOptions,
	doughnutOptions,
	horizontalBarOptions,
	horizontalBarChartOpt,
	barChartOptions2,
} from "./chartOptions.js";
import Chart from "react-apexcharts";
const Availability = (props) => {
	const [dateSelect, onCalendarDateChange] = useState(new Date());

	// chartjs
	const barChartData = {
		labels: ["A", "B", "C", "D", "E", "F", "J", "K", "M"],
		datasets: [
			{
				label: "Availability",
				backgroundColor: "rgba(166,167,247,1)",
				borderWidth: 1,
				borderRadius: 0,
				hoverBackgroundColor: "rgba(196,187,247,1)",
				data: [65, 59, 80, 81, 56, 55, 40, 220, 50, 80],
			},
		],
	};

	// apexchart
	// const barChartData = [65, 59, 80, 81, 56, 55, 40, 220, 50, 80];
	// const barChartOptions = barChartOptions2(barChartData);

	const doughnutData = {
		datasets: [
			{
				data: [30, 40, 50],
				backgroundColor: ["#051548", "#33FAFF", "#a0a0a0"],
			},
		],
		labels: ["Idle", "Stop", "Error"],
	};

	const sampleData = [
		{
			machine: "Machine 1",
			date: "2024-05-01",
			startTime: "08:00 AM",
			endTime: "04:00 PM",
			runTime: "7 hours",
			downTime: "1 hour",
			breakRest: "0.5 hour",
			Availability: "85%",
		},
		{
			machine: "Machine 1",
			date: "2024-05-01",
			startTime: "08:00 AM",
			endTime: "04:00 PM",
			runTime: "7 hours",
			downTime: "1 hour",
			breakRest: "0.5 hour",
			Availability: "85%",
		},
		{
			machine: "Machine 1",
			date: "2024-05-01",
			startTime: "08:00 AM",
			endTime: "04:00 PM",
			runTime: "7 hours",
			downTime: "1 hour",
			breakRest: "0.5 hour",
			Availability: "85%",
		},
		{
			machine: "Machine 2",
			date: "2024-05-02",
			startTime: "07:30 AM",
			endTime: "03:30 PM",
			runTime: "7 hours",
			downTime: "0.5 hour",
			breakRest: "0.75 hour",
			Availability: "90%",
		},
		{
			machine: "Machine 3",
			date: "2024-05-03",
			startTime: "08:15 AM",
			endTime: "04:15 PM",
			runTime: "7 hours",
			downTime: "0.75 hour",
			breakRest: "0.25 hour",
			Availability: "88%",
		},
		{
			machine: "Machine 4",
			date: "2024-05-04",
			startTime: "07:45 AM",
			endTime: "03:45 PM",
			runTime: "7 hours",
			downTime: "1.5 hour",
			breakRest: "0.5 hour",
			Availability: "82%",
		},
		{
			machine: "Machine 5",
			date: "2024-05-05",
			startTime: "08:30 AM",
			endTime: "04:30 PM",
			runTime: "7 hours",
			downTime: "0.25 hour",
			breakRest: "0.5 hour",
			Availability: "87%",
		},
	];

	const statusData = [
		{ start: 0, end: 60, status: "idle" },
		{ start: 60, end: 120, status: "initializing" },
		{ start: 120, end: 300, status: "ready" },
		{ start: 300, end: 360, status: "error" },
		{ start: 360, end: 700, status: "running" },
		{ start: 700, end: 1440, status: "error" },
	];

	const colors = {
		idle: "#ebebeb",
		initializing: "#ffa64d",
		ready: "#ffea4a",
		running: "#5fff2e",
		error: "#ff2b0f",
	};

	const series = statusData.map(({ start, end, status }, index) => ({
		name: `${status}-${index}`,
		data: [end - start],
		color: colors[status],
	}));

	const horizontalChartOptions = horizontalBarChartOpt(series);

	const [currentPage, setCurrentPage] = useState(1);
	let pageSize = 4;

	const firstPageIndex = (currentPage - 1) * pageSize;
	const lastPageIndex = firstPageIndex + pageSize;
	const currentTableData = sampleData.slice(firstPageIndex, lastPageIndex);

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="fromToDateSelection">
						<div
							className="mb-3 mx-auto p-2"
							style={{
								width: "fit-content",
								backgroundColor: "rgb(225 236 255)",
								borderRadius: "10px",
							}}
						>
							<form className="text-center d-flex align-items-center">
								<label for="fromDate" className="mb-0 mr-2">
									From:{" "}
								</label>
								<input
									type="date"
									id="fromDate"
									className="form-control mr-2 p-1"
									style={{ height: "fit-content" }}
								></input>

								<label for="toDate" className="mb-0 mr-2">
									To:{" "}
								</label>
								<input
									type="date"
									id="toDate"
									className="form-control mr-2 p-1"
									style={{ height: "fit-content" }}
								></input>

								<input
									type="submit"
									value={"go"}
									className="btn btn-primary py-1 px-2"
								/>
							</form>
						</div>
					</div>
					<Row className="mb-4">
						<Col md="8">
							<Card>
								<CardHeader>Availability Per Day</CardHeader>
								<CardBody>
									<Bar
										data={barChartData}
										options={barChartOptions}
									/>
									{/* <Chart
										options={barChartOptions.options}
										series={barChartOptions.options.series}
										type="bar"
										height={150}
									/> */}
								</CardBody>
							</Card>
						</Col>
						<Col md="4">
							<Card>
								<CardHeader>Overall Availability</CardHeader>
								<CardBody>
									<Doughnut
										data={doughnutData}
										options={doughnutOptions}
									/>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<Col>
						<Row className="mb-4 bg-white">
							<Col className="p-0">
								<Card className="border-0">
									<CardHeader className="border-0">
										Summary
									</CardHeader>
									<Table
										className="align-items-center table-flush"
										responsive
									>
										<thead>
											<tr className="tableHeader">
												<th scope="col">Machine</th>
												<th scope="col">Date</th>
												<th scope="col">
													Total Running Time
												</th>
												<th scope="col">
													Total Stop Time
												</th>
												<th scope="col">
													Availability
												</th>
											</tr>
										</thead>
										<tbody>
											{currentTableData.map(
												(data, index) => (
													<tr key={index}>
														<td>{data.machine}</td>
														<td>{data.date}</td>
														<td>{data.runTime}</td>
														<td>{data.downTime}</td>
														<td>
															{data.Availability}
														</td>
													</tr>
												)
											)}
										</tbody>
										<tr>
											<td colSpan={5}>
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
							</Col>
							<Col className="d-flex align-items-center">
								<Calendar
									className="mx-auto"
									onChange={onCalendarDateChange}
									value={dateSelect}
								/>
							</Col>
						</Row>
					</Col>

					<Row className="mb-4">
						<Col>
							<div>
								<Card>
									<CardHeader>Job Order Summary</CardHeader>
									<Table
										className="align-items-center table-flush"
										responsive
									>
										<thead>
											<tr className="tableHeader">
												<th scope="col">Job Order</th>
												<th scope="col">Start Time</th>
												<th scope="col">End Time</th>
												<th scope="col">
													Planned Output
												</th>
												<th scope="col">
													Planned Duration (hrs)
												</th>
											</tr>
										</thead>
										<tbody>
											{currentTableData.map(
												(data, index) => (
													<tr key={index}>
														<td>{data.machine}</td>
														<td>{data.date}</td>
														<td>{data.runTime}</td>
														<td>{data.downTime}</td>
														<td>
															{data.Availability}
														</td>
													</tr>
												)
											)}
										</tbody>
										<tr>
											<td colSpan={5}>
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
					<Row>
						<Col>
							<div>
								<Card>
									<CardHeader>Machine Status</CardHeader>
									<CardBody>
										<div
											style={{ height: "fit-content" }}
											id="machineStatusChart"
										>
											<Chart
												options={
													horizontalChartOptions.options
												}
												series={
													horizontalChartOptions
														.options.series
												}
												type="bar"
												height={150}
											/>
										</div>
									</CardBody>
								</Card>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Availability;
