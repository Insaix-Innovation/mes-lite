import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { barChartOptions, doughnutOptions } from "./chartOptions.js";
import { formatDateWithTimezone } from "./helper";
import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Col,
	Container,
	Row,
	Table,
} from "reactstrap";
import Pagination from "components/Pagination";

const Performance = (props) => {
	const [machineIdOptions, setMachineIdOption] = useState([]);
	const fetchMachineIdOptions = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/getMachineIdOptions`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			setMachineIdOption(data);
			return;
		} catch (e) {}
	};

	const getMalaysiaDate = () => {
		const now = new Date();
		const utcTime = now.getTime() + now.getTimezoneOffset() * 6000;
		const malaysiaTime = new Date(utcTime + 8 * 3600000); // Malaysia is UTC+8
		return malaysiaTime.toISOString().split("T")[0];
	};
	const today = getMalaysiaDate(); // Get today's date in YYYY-MM-DD format
	const [fromDate, setFromDate] = useState(today);
	const [toDate, setToDate] = useState(today);
	const [machineID, setMachineID] = useState("");

	// Handle date changes and ensure they don't exceed today's date
	const handleFromDateChange = (e) => {
		console.log(e.target.value);
		const selectedDate = e.target.value;
		if (selectedDate <= today) {
			setFromDate(selectedDate);
		}
	};

	const handleToDateChange = (e) => {
		const selectedDate = e.target.value;
		if (selectedDate <= today) {
			setToDate(selectedDate);
		}
	};

	const handleMachineIDChange = (e) => {
		setMachineID(e.target.value);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		fetchOverallTargetOutput();
		fetchSummaryTableData();
		fetchDoughnutData();
		fetchBarChartData();
		fetchOverallRunTime();
		fetchOverallPerformance();
	};

	useEffect(() => {
		setFromDate(today);
		setToDate(today);
	}, [today]);

	//get overall target & output
	const [overallTarget, setOverallTarget] = useState("");
	const [overallOutput, setOverallOutput] = useState("");
	const fetchOverallTargetOutput = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/getOverallTargetOutput?machineId=${machineID}&startDate=${fromDate}&endDate=${toDate}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			console.log(data);
			if (data.target === undefined || data.target === null) {
				setOverallTarget(`-`);
			} else {
				setOverallTarget(data.target);
			}

			if (data.current === undefined || data.current === null) {
				setOverallOutput(`0`);
			} else {
				setOverallOutput(data.current);
			}
			return;
		} catch (e) {}
	};

	//get Overall run time
	const [overallRunTime, setOverallRunTime] = useState("");
	const fetchOverallRunTime = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/getOverallRunTime?startTime=${formatDateWithTimezone(
					fromDate
				)}&endTime=${formatDateWithTimezone(
					toDate
				)}&machineId=${machineID}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			if (
				data.overall_run_time === undefined ||
				data.overall_run_time === null
			) {
				// Check if overall_run_time is undefined
				setOverallRunTime(`-`);
				return;
			}
			setOverallRunTime(data.overall_run_time);
			return;
		} catch (e) {}
	};

	//get Overall Performance
	const [overallPerformance, setOverallPerformance] = useState("");
	const fetchOverallPerformance = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/getOverallPerformance?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			if (
				data.overall_performance === undefined ||
				data.overall_performance === null
			) {
				setOverallPerformance(`-`);
				return;
			}
			let percentage = data.overall_performance * 100;
			setOverallPerformance(`${percentage}%`);
			return;
		} catch (e) {}
	};

	// bar chart

	const [barChartData, setBarChartData] = useState({
		labels: [],
		dataset: [],
	});

	const [barChartError, setBarchartError] = useState("");
	const barChartOption = {
		...barChartOptions,
		tooltips: {
			callbacks: {
				label: function (tooltipItem, data) {
					const value = tooltipItem.yLabel;
					return `${value}%`;
				},
			},
		},
	};
	const fetchBarChartData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/performanceBarChart?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			console.log(data.performance);
			if (data.length === 0) {
				setBarchartError("No data found");
				// return;
			} else {
				setBarchartError("");
			}

			const options = {
				timeZone: "Asia/Kuala_Lumpur",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			};

			const labels = data.map((item) =>
				new Date(item.timestamp).toLocaleString("en-MY", options)
			);
			const performance = data.map((item) => item.performance * 100);
			setBarChartData({
				labels: labels,
				datasets: [
					{
						label: "Performance",
						data: performance,
						backgroundColor: "rgba(166,167,247,1)",
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	// doughnut chart

	const [doughnutData, setDoughnutChartData] = useState({
		labels: [],
		datasets: [],
	});
	const [doughnutError, setDoughnutError] = useState("");
	const doughnutOption = {
		...doughnutOptions,
		// tooltips: {
		//   callbacks: {
		// 	label: function (context) {
		// 	  const value = context.x;
		// 	  console.log(context)
		// 	  return `${context.label}: ${value}%`;
		// 	},
		//   },
		// },
	};
	const fetchDoughnutData = async () => {
		try {
			let url = `http://localhost:5000/performanceDoughnutChart?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`;
			const response = await fetch(url);
			const data = await response.json();
			if (data.length === 0 || data.performance === null) {
				setDoughnutError("No data found");
				setDoughnutChartData({
					labels: [],
					datasets: [],
				});
				return;
			} else {
				setDoughnutError("");
			}
			let labels = [data.machine_id];
			let dataset = [data.performance * 100];
			setDoughnutChartData({
				labels: labels,
				datasets: [
					{
						label: "Overall Performance",
						data: dataset,
						backgroundColor: ["#525f7f"],
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// summary table
	const [summaryTable, setSummaryTable] = useState([]);
	const [summaryTableError, setSummaryTableError] = useState("");

	const fetchSummaryTableData = async () => {
		try {
			let url = `http://localhost:5000/performanceSummary?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`;
			const response = await fetch(url);
			const data = await response.json();
			console.log(data);
			if (data.length === 0) {
				setSummaryTableError("No data found");
			} else {
				setSummaryTableError("");
			}
			setSummaryTable(data);
			return;
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchOverallTargetOutput();
		fetchSummaryTableData();
		fetchDoughnutData();
		fetchBarChartData();
		fetchOverallRunTime();
		fetchOverallPerformance();
		fetchMachineIdOptions();
	}, []);

	const options = {
		timeZone: "Asia/Kuala_Lumpur",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};

	const [currentPage, setCurrentPage] = useState(1);
	let pageSize = 4;

	const firstPageIndex = (currentPage - 1) * pageSize;
	const lastPageIndex = firstPageIndex + pageSize;
	const currentTableData = summaryTable.slice(firstPageIndex, lastPageIndex);

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="header-body">
						<div className="fromToDateSelection">
							<div
								className="mb-3 mx-auto p-2"
								style={{
									width: "fit-content",
									backgroundColor: "rgb(225 236 255)",
									borderRadius: "10px",
								}}
							>
								<form
									className="text-center d-flex align-items-center"
									onSubmit={handleFormSubmit}
								>
									<label for="fromDate" className="mb-0 mr-2">
										From:{" "}
									</label>
									<input
										type="date"
										id="fromDate"
										onChange={handleFromDateChange}
										value={fromDate}
										className="form-control mr-2 p-1"
										style={{ height: "fit-content" }}
									></input>

									<label for="toDate" className="mb-0 mr-2">
										To:{" "}
									</label>
									<input
										type="date"
										id="toDate"
										onChange={handleToDateChange}
										value={toDate}
										className="form-control mr-2 p-1"
										style={{ height: "fit-content" }}
									></input>

									<label
										for="machineID"
										className="mb-0 mr-2"
									>
										MachineID:{" "}
									</label>

									<select
										id="machineID"
										value={machineID}
										onChange={handleMachineIDChange}
										style={{
											border: "1px solid #cad1d7",
											"border-radius": "5px",
											padding: "3px 5px",
											"font-size": "0.875rem",
											color: "#8898aa",
											"margin-right": "5px",
										}}
									>
										<option value="">All</option>
										{machineIdOptions.map((machineid) => {
											return (
												<option
													key={machineid}
													value={machineid}
												>
													{machineid}
												</option>
											);
										})}
									</select>

									<input
										type="submit"
										value={"go"}
										className="btn btn-primary py-1 px-2"
									/>
								</form>
							</div>
						</div>

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
													{overallTarget}
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
													{overallOutput}
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
													{overallRunTime}
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
													{overallPerformance}
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
									{barChartError === "" ? (
										<CardBody>
											<Bar
												data={barChartData}
												options={barChartOption}
											/>
										</CardBody>
									) : (
										<CardBody>
											<div>{barChartError}</div>
										</CardBody>
									)}
								</Card>
							</Col>
							<Col md="4">
								<Card>
									<CardHeader>Overall Performance</CardHeader>
									{doughnutError === "" ? (
										<CardBody>
											<Doughnut
												data={doughnutData}
												options={doughnutOptions}
											/>
										</CardBody>
									) : (
										<CardBody>
											<div>{doughnutError}</div>
										</CardBody>
									)}
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
																{
																	data.machine_id
																}
															</td>
															<td>
																{new Date(
																	data.timestamp
																).toLocaleString(
																	"en-MY",
																	options
																)}
															</td>
															<td>
																{
																	data.cycle_time
																}
															</td>
															<td>
																{
																	data.target
																		.target
																}
															</td>
															<td>
																{
																	data.sum_output_qty
																}
															</td>
															<td>
																{data.run_time}
															</td>
															<td>
																{
																	data.performance
																}
															</td>
														</tr>
													)
												)}
												{summaryTableError !== "" && (
													<tr>
														<td
															colSpan={7}
															style={{
																textAlign:
																	"center",
															}}
														>
															{summaryTableError}
														</td>
													</tr>
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
																summaryTable.length
															}
															pageSize={pageSize}
															onPageChange={(
																page
															) =>
																setCurrentPage(
																	page
																)
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
