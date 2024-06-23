import Chart from "chart.js";
import classnames from "classnames";
import pflImage from "../assets/img/pfl.png";
import host from "./host.js";

import { useState, useEffect } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import Pagination from "components/Pagination";
import { barChartOptions, doughnutOptions } from "./chartOptions.js";
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

const Quality = (props) => {
	const localhost = host.localhost;

	const [machineIdOptions, setMachineIdOption] = useState([]);
	const fetchMachineIdOptions = async () => {
		try {
			const response = await fetch(
				`http://${localhost}:5000/getMachineIdOptions`
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
		fetchDoughnutData();
		fetchSummaryTableData();
		fetchBarChartData();
	};

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
				`http://${localhost}:5000/rejectsParetoBarChart?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			if (data.length === 0) {
				setBarchartError("No data found");
				return;
			} else {
				setBarchartError("");
			}

			const labels = [
				"fail_live_no",
				"fail_neutral_no",
				"fail_earth_no",
				"fail_livexneutral_no",
				"fail_neutralxearth_no",
				"fail_earthxlive_no",
				"short_when_off_no",
				"flow_mark_no",
				"burr_no",
				"colour_uneven_no",
				"colour_no",
				"scratches_no",
			];
			const dataFR = data[0];
			const rejectQuantities = [
				dataFR.total_fail_live_no,
				dataFR.total_fail_neutral_no,
				dataFR.total_fail_earth_no,
				dataFR.total_fail_livexneutral_no,
				dataFR.total_fail_neutralxearth_no,
				dataFR.total_fail_earthxlive_no,
				dataFR.total_short_when_off_no,
				dataFR.total_flow_mark_no,
				dataFR.total_burr_no,
				dataFR.total_colour_uneven_no,
				dataFR.total_colour_no,
				dataFR.total_scratches_no,
			];
			setBarChartData({
				labels: labels,
				datasets: [
					{
						label: "Reject Quantity",
						data: rejectQuantities,
						backgroundColor: "rgba(166,167,247,1)",
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	const [summaryTable, setSummaryTable] = useState([]);
	const [summaryTableError, setSummaryTableError] = useState("");
	const fetchSummaryTableData = async () => {
		try {
			let url = `http://${localhost}:5000/qualitySummary?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`;
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
	const [doughnutData, setDoughnutChartData] = useState({
		labels: [],
		datasets: [],
	});
	const [doughnutError, setDoughnutError] = useState("");
	const fetchDoughnutData = async () => {
		try {
			let url = `http://${localhost}:5000/qualityDoughnut?startTime=${fromDate}&endTime=${toDate}&machineId=${machineID}`;
			const response = await fetch(url);
			const data = await response.json();
			if (data.length === 0) {
				setDoughnutError("No data found");
				setDoughnutChartData({
					labels: [],
					datasets: [],
				});
				return;
			} else {
				setDoughnutError("");
			}
			let labels = ["Good", "Bad"];
			let colors = ["#56db4d", "#b9bdb9"];
			let dataset = [data[0].good, data[0].bad];
			console.log(dataset);
			setDoughnutChartData({
				labels: labels,
				datasets: [
					{
						label: "Overall Quality",
						data: dataset,
						backgroundColor: colors,
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchDoughnutData();
		fetchSummaryTableData();
		fetchBarChartData();
		fetchMachineIdOptions();
	}, []);

	const [currentPage, setCurrentPage] = useState(1);
	let pageSize = 4;

	const firstPageIndex = (currentPage - 1) * pageSize;
	const lastPageIndex = firstPageIndex + pageSize;
	const currentTableData = summaryTable.slice(firstPageIndex, lastPageIndex);

	const options = {
		timeZone: "Asia/Kuala_Lumpur",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};

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

								<label for="machineID" className="mb-0 mr-2">
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
						<Col md="8">
							<Card>
								<CardHeader>Rejects Pareto Chart</CardHeader>
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
								<CardHeader>Overall Quality</CardHeader>
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
												<th scope="col">Target</th>
												<th scope="col">Output</th>
												<th scope="col">Good</th>
												<th scope="col">Bad</th>
												<th scope="col">Quality</th>
											</tr>
										</thead>
										<tbody>
											{currentTableData.map(
												(data, index) => (
													<tr key={index}>
														<td>
															{data.machine_id}
														</td>
														<td>
															{new Date(
																data.date
															).toLocaleString(
																"en-MY",
																options
															)}
														</td>
														<td>
															{
																data
																	.targetOutput
																	.target
															}
														</td>
														<td>
															{data.output_qty}
														</td>
														<td>{data.good}</td>
														<td>{data.bad}</td>
														<td>{data.quality}</td>
													</tr>
												)
											)}
											{summaryTableError !== "" && (
												<tr>
													<td
														colSpan={7}
														style={{
															textAlign: "center",
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
				</Container>
			</div>
		</>
	);
};

export default Quality;
