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
import { Bar, Line, Pie, Doughnut, HorizontalBar } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
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
import { formatDate, formatDateWithTimezone } from './helper.js';
import Chart from "react-apexcharts";
const Availability = (props) => {
	const [dateSelect, setCalendarDateChange] = useState(new Date());
	const [toggledDates, setToggledDates] = useState([]);
	const [error, setError] = useState("");
	const handleDateChange = (date) => {
		setCalendarDateChange(date);
		setError("");
	};
	const [flagData, setFlagData] = useState({});
	useEffect(() => {
		// Fetch toggled dates from the database on component mount
		const fetchToggledDates = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/getToggledDates"
				);
				const data = await response.json();
				setToggledDates(data.map((d) => new Date(d.date)));
				setFlagData(data.map((d) => d.overtime_flag));
			} catch (error) {
				console.error("Error fetching toggled dates:", error);
			}
		};

		fetchToggledDates();
	}, []);

	const handleToggle = async (date) => {
		setCalendarDateChange(date);
		const formattedDate = formatDate(date);
		const newFlagData = { ...flagData };
		newFlagData[formattedDate] = !newFlagData[formattedDate];
		setFlagData(newFlagData);
		setError("");
		const currentDate = new Date();
		const currentTimeInMinutes =
			currentDate.getHours() * 60 + currentDate.getMinutes();
		const toggleTimeLimit = 17 * 60; // 17:00 in minutes

		const isToday = date.toDateString() === currentDate.toDateString();
		const isFutureDate = dateSelect > currentDate;

		if (
			isFutureDate ||
			(isToday && currentTimeInMinutes < toggleTimeLimit)
		) {
			// const index = toggledDates.findIndex(
			// 	(d) => d.toDateString() === dateSelect.toDateString()
			// );
			// const newFlag = index === -1;
			const flagEntry = toggledDates.find(
				(entry) => entry.timestamp === formattedDate
			);
			// Toggle the overtime flag
			const newOvertimeFlag = !flagEntry?.overtime_flag;

			try {
				const response = await fetch(
					"http://localhost:5000/updateOvertimeFlag",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							timestamp: formattedDate,
							overtimeFlag: newOvertimeFlag,
						}),
					}
				);

				if (!response.ok) {
					throw new Error("Failed to update the database");
				}
				setToggledDates((prevData) => {
					const updatedData = [...prevData];
					const dataIndex = updatedData.findIndex(
						(entry) => entry.timestamp === formattedDate
					);
					if (dataIndex !== -1) {
						updatedData[dataIndex].overtime_flag = newOvertimeFlag;
					} else {
						updatedData.push({
							timestamp: formattedDate,
							overtime_flag: newOvertimeFlag,
						});
					}
					return updatedData;
				});
				// if (newFlag) {
				// 	setToggledDates([...toggledDates, dateSelect]);
				// } else {
				// 	setToggledDates(
				// 		toggledDates.filter(
				// 			(d) =>
				// 				d.toDateString() !== dateSelect.toDateString()
				// 		)
				// 	);
				// }
			} catch (error) {
				console.error("Error updating database:", error);
				setError("Failed to update the database");
			}
		} else {
			setError(
				"You can only toggle for today before 17:00 or for future dates."
			);
		}
	};

	const tileClassName = ({ date }) => {
		const formattedDate = formatDate(date);
		const flag = flagData[formattedDate];
		return flag === false ? "toggled-date" : "";
	};

	const tileDisabled = ({ date, view }) => {
		const today = new Date();
		return view === "month" && date < new Date(today.setHours(17, 0, 0, 0));
	};
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
		running: "#55cf4a",
		error: "#ff2b0f",
	};

	const series = statusData.map(({ start, end, status }, index) => ({
		name: `${status}-${index}`,
		data: [end - start],
		color: colors[status],
	}));

	const horizontalChartOptions = horizontalBarChartOpt(series);
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
	const [machineOption, setMachineOption] = useState("all");
	const [doughnutError, setDoughnutError] = useState("");

	// Handle date changes and ensure they don't exceed today's date
	const handleFromDateChange = (e) => {
		console.log(today);
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

	const handleMachineIDOptionChange = (e) => {
		setMachineOption(e.target.value);
		if (e.target.value == "all") {
			setMachineID("");
		}
	};

	const handleMachineIDChange = (e) => {
		setMachineID(e.target.value);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		fetchData();
	};

	useEffect(() => {
		setFromDate(today);
		setToDate(today);
	}, [today]);

	const [doughnutData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	const fetchData = async () => {
		try {
			let url = `http://localhost:5000/availabilityDoughnut?startTime=${formatDateWithTimezone(
				fromDate
			)}&endTime=${formatDateWithTimezone(toDate)}`;
			if (machineID) {
				url += `&machineId=${machineID}`;
			}
			const response = await fetch(url);
			const data = await response.json();
			if (data.length === 0) {
				setDoughnutError("No data found");
				return;
			} else {
				setDoughnutError("");
			}
			const labels = [
				"Idle",
				"Initializing",
				"Ready",
				"Running",
				"Error",
			];
			const colors = ["blue", "orange", "yellow", "green", "red"];
			const durations = [0, 0, 0, 0, 0];

			data.forEach((item) => {
				switch (item.machine_status) {
					case 0:
						durations[0] = item.total_duration;
						break;
					case 1:
						durations[1] = item.total_duration;
						break;
					case 2:
						durations[2] = item.total_duration;
						break;
					case 3:
						durations[3] = item.total_duration;
						break;
					case 4:
						durations[4] = item.total_duration;
						break;
					default:
						break;
				}
			});

			setChartData({
				labels: labels,
				datasets: [
					{
						label: "Machine Status Duration",
						data: durations,
						backgroundColor: colors,
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const [barChartData, setBarChartData] = useState({
		labels: [],
		dataset: [],
	});

	const [barChartError, setBarchartError] = useState("");

	const fetchBarChartData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/availabilityBarChart?startTime=${fromDate}&endTime=${toDate}`
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

			const options = {
				timeZone: "Asia/Kuala_Lumpur",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			};

			const labels = data.map((item) =>
				new Date(item.timestamp).toLocaleString("en-MY", options)
			);
			const availability = data.map((item) => item.availability);
			setBarChartData({
				labels: labels,
				datasets: [
					{
						label: "Availability",
						data: availability,
						backgroundColor: "rgba(75, 192, 192, 0.6)",
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};
	const [summaryTableData, setSummaryTableData] = useState([]);
	const [summaryTableError, setSummaryTableError] = useState("");

	const options = {
		timeZone: "Asia/Kuala_Lumpur",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	};

	const fetchSummaryData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/availabilitySummary?startTime=${fromDate}&endTime=${toDate}&startTimeTS=${formatDateWithTimezone(
					fromDate
				)}&endTimeTS=${formatDateWithTimezone(
					toDate
				)}&machineId=${machineID}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			if (data.length === 0) {
				setSummaryTableError("No data found");
			} else {
				setSummaryTableError("");
			}
			setSummaryTableData(data);
			return;
		} catch (e) {}
	};

	const [jobOrderTableData, setJobOrderTableData] = useState([]);
	const [jobOrderError, setJobOrderError] = useState("");
	const fetchJobOrderData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/getJobOrder?startTime=${formatDateWithTimezone(
					fromDate
				)}&endTime=${formatDateWithTimezone(toDate)}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			if (data.length === 0) {
				setJobOrderError("No data found");
			} else {
				setJobOrderError("");
			}
			setJobOrderTableData(data);
			return;
		} catch (e) {}
	};

	useEffect(() => {
		fetchJobOrderData();
		fetchSummaryData();
		fetchData();
		fetchBarChartData();
	}, [fromDate, toDate, machineID]);

	//availability summary
	const [currentPage, setCurrentPage] = useState(1);
	let pageSize = 4;

	const firstPageIndex = (currentPage - 1) * pageSize;
	const lastPageIndex = firstPageIndex + pageSize;
	const valuesArray = Object.values(summaryTableData);
	const currentSummaryTableData = valuesArray.slice(
		firstPageIndex,
		lastPageIndex
	);

	//Job order summary
	const [currentPageJO, setCurrentPageJO] = useState(1);
	// let pageSize = 4;

	const firstPageIndexJO = (currentPageJO - 1) * pageSize;
	const lastPageIndexJO = firstPageIndexJO + pageSize;
	const valuesArrayJO = Object.values(jobOrderTableData);
	const currentJOTableData = valuesArrayJO.slice(
		firstPageIndexJO,
		lastPageIndexJO
	);

	const [editingCell, setEditingCell] = useState({
		job_order_no: null,
		column: "",
		value: "",
	});

	const handleDoubleClick = (job_order_no, column, value) => {
		setEditingCell({ job_order_no, column, value });
	};

	const handleChange = (e) => {
		const { column, value } = editingCell;
		let newValue = e.target.value;
		if (column === "planned_output" || column === "planned_uph") {
			if (!/^\d*$/.test(newValue)) {
				return; // Only allow integer values
			}
		}

		if (column === "planned_duration_hrs") {
			if (!/^\d*\.?\d{0,2}$/.test(newValue)) {
				return; // Only allow floats up to 2 decimal points
			}
		}

		setEditingCell({ ...editingCell, value: newValue });
	};

	const handleSave = async (job_order_no, column) => {
		try {
			const response = await fetch(
				`http://localhost:5000/updateJobOrder`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						job_order_no: job_order_no,
						[column]: editingCell.value,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			// Update the local state with the new data
			setJobOrderTableData((prevData) =>
				prevData.map((row) =>
					row.job_order_no === job_order_no
						? { ...row, [column]: editingCell.value }
						: row
				)
			);

			// Clear editing state
			setEditingCell({ job_order_no: null, column: "", value: "" });
		} catch (error) {
			console.error("Error updating row:", error);
		}
	};

	const handleKeyDown = (e, job_order_no, column) => {
		if (e.key === "Enter") {
			handleSave(job_order_no, column);
		}
	};

	const handleBlur = (job_order_no, column) => {
		handleSave(job_order_no, column);
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
									value={machineOption}
									onChange={handleMachineIDOptionChange}
								>
									<option value="all">All</option>
									<option value="specific">
										Specific Machine ID
									</option>
								</select>
								{machineOption === "specific" && (
									<input
										type="text"
										id="machineID"
										onChange={handleMachineIDChange}
										value={machineID}
										className="form-control mr-2 p-1"
										style={{ height: "fit-content" }}
										placeholder="machineID"
									></input>
								)}
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
								{barChartError === "" ? (
									<CardBody>
										<Bar
											data={barChartData}
											options={barChartOptions}
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
								<CardHeader>Overall Availability</CardHeader>

								{doughnutError !== "" ? (
									<CardBody>
										<div>{doughnutError}</div>
									</CardBody>
								) : (
									<CardBody>
										<Doughnut
											data={doughnutData}
											options={doughnutOptions}
										/>
									</CardBody>
								)}
							</Card>
						</Col>
					</Row>
					<Col>
						<Row className="mb-4 bg-white">
							<Col className="p-0">
								<Card className="border-0">
									<CardHeader className="border-0">
										Availability Summary
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
											{currentSummaryTableData.map(
												(data, index) => (
													<tr key={index}>
														<td>
															{data.MachineID}
														</td>
														<td>
															{new Date(
																data.Date
															).toLocaleString(
																"en-MY",
																options
															)}
														</td>
														<td>
															{
																data.TotalRunningTime
															}
														</td>
														<td>
															{data.TotalDownTime}
														</td>
														<td>
															{data.Availability}
														</td>
													</tr>
												)
											)}
											{summaryTableError !== "" && (
												<tr>
													<td
														colSpan={5}
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
											<td colSpan={5}>
												<div className="pagination d-flex justify-content-center">
													<Pagination
														className="pagination-bar mb-0"
														currentPage={
															currentPage
														}
														totalCount={
															summaryTableData.length
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
								<div className="d-flex flex-column">
									<div style={{ textAlign: "center" }}>
										Overtime mode
									</div>
									<Calendar
										className="mx-auto"
										onClickDay={handleToggle}
										tileClassName={tileClassName}
										tileDisabled={tileDisabled}
										value={dateSelect}
									/>
								</div>
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
												<th scope="col">Planned UPH</th>
											</tr>
										</thead>
										<tbody>
											{currentJOTableData.map(
												(data, index) => (
													<tr key={index}>
														<td>
															{data.job_order_no}
														</td>
														<td>
															{new Date(
																data.job_start_time
															).toLocaleString(
																"en-MY",
																options
															)}
														</td>
														<td>
															{new Date(
																data.job_end_time
															).toLocaleString(
																"en-MY",
																options
															)}
														</td>
														<td
															onDoubleClick={() =>
																handleDoubleClick(
																	data.job_order_no,
																	"planned_output",
																	data.planned_output
																)
															}
														>
															{editingCell.job_order_no ===
																data.job_order_no &&
															editingCell.column ===
																"planned_output" ? (
																<input
																	type="text"
																	value={
																		editingCell.value
																	}
																	onChange={
																		handleChange
																	}
																	onKeyDown={(
																		e
																	) =>
																		handleKeyDown(
																			e,
																			data.job_order_no,
																			"planned_output"
																		)
																	}
																	onBlur={() =>
																		handleBlur(
																			data.job_order_no,
																			"planned_output"
																		)
																	}
																	autoFocus
																/>
															) : (
																data.planned_output
															)}
														</td>
														<td
															onDoubleClick={() =>
																handleDoubleClick(
																	data.job_order_no,
																	"planned_duration_hrs",
																	data.planned_duration_hrs
																)
															}
														>
															{editingCell.job_order_no ===
																data.job_order_no &&
															editingCell.column ===
																"planned_duration_hrs" ? (
																<input
																	type="text"
																	value={
																		editingCell.value
																	}
																	onChange={
																		handleChange
																	}
																	onKeyDown={(
																		e
																	) =>
																		handleKeyDown(
																			e,
																			data.job_order_no,
																			"planned_duration_hrs"
																		)
																	}
																	onBlur={() =>
																		handleBlur(
																			data.job_order_no,
																			"planned_duration_hrs"
																		)
																	}
																	autoFocus
																/>
															) : (
																data.planned_duration_hrs
															)}
														</td>
														<td
															onDoubleClick={() =>
																handleDoubleClick(
																	data.job_order_no,
																	"planned_uph",
																	data.planned_uph
																)
															}
														>
															{editingCell.job_order_no ===
																data.job_order_no &&
															editingCell.column ===
																"planned_uph" ? (
																<input
																	type="text"
																	value={
																		editingCell.value
																	}
																	onChange={
																		handleChange
																	}
																	onKeyDown={(
																		e
																	) =>
																		handleKeyDown(
																			e,
																			data.job_order_no,
																			"planned_uph"
																		)
																	}
																	onBlur={() =>
																		handleBlur(
																			data.job_order_no,
																			"planned_uph"
																		)
																	}
																	autoFocus
																/>
															) : (
																data.planned_uph
															)}
														</td>
													</tr>
												)
											)}
											{jobOrderError !== "" && (
												<tr>
													<td
														colSpan={6}
														style={{
															textAlign: "center",
														}}
													>
														{jobOrderError}
													</td>
												</tr>
											)}
										</tbody>
										<tr>
											<td colSpan={6}>
												<div className="pagination d-flex justify-content-center">
													<Pagination
														className="pagination-bar mb-0"
														currentPage={
															currentPageJO
														}
														totalCount={
															jobOrderTableData.length
														}
														pageSize={pageSize}
														onPageChange={(page) =>
															setCurrentPageJO(
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
