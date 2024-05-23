import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Row,
	Table,
} from "reactstrap";
import pflImage from "../assets/img/machine.png";
import { doughnutOptions } from "./chartOptions.js";

const Machine = (props) => {
	const [selectedPage, setSelectedPage] = useState("OEE_UPH");

	const handlePageChange = (page) => {
		setSelectedPage(page);
	};

	const oeeValue = 50;
	const doughnutData = {
		datasets: [
			{
				data: [oeeValue, 100 - oeeValue],
				backgroundColor: ["#051548", "#33FAFF"], // Blue for OEE, light gray for remaining
			},
		],
		labels: ["OEE", "Target"],
	};

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<Row>
						<Col className="mb-5 mb-xl-0" xl="8">
							<Card>
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<Col>
											<h2 className="mb-0">
												Production Line
												<select
													style={{
														paddingLeft: "20px",
														paddingRight: "20px",
														marginLeft: "20px",
														borderRadius: "20px",
														border: "1px solid lightgray",
														fontSize: "1rem",
													}}
												>
													<option>Line A</option>
													<option>Line B</option>
													<option>Line C</option>
												</select>
											</h2>
										</Col>
										<Col>
											<div className="btn-group">
												<button
													onClick={() =>
														handlePageChange(
															"Live"
														)
													}
													className={`btn ${selectedPage === "Live"
														? "btn-success"
														: "btn-secondary"
														}`}
												>
													Live
												</button>
												<button
													onClick={() =>
														handlePageChange(
															"OEE_UPH"
														)
													}
													className={`btn ${selectedPage ===
														"OEE_UPH"
														? "btn-success"
														: "btn-secondary"
														}`}
												>
													OEE & UPH
												</button>
											</div>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<img
										src={pflImage}
										alt="Production Floor Layout"
										style={{
											width: "100%",
											marginBottom: "20px",
										}}
									/>
								</CardBody>
							</Card>
						</Col>
						<Col xl="4">
							<Card className="shadow">
								<CardHeader className="bg-transparent">
									<Row className="align-items-center">
										<div className="col">
											<h3 className="mb-0">
												Assets Info
											</h3>
										</div>

										<div
											className="col"
											style={{ paddingTop: "5px" }}
										>
											<span>
												<h6 className=" text-muted ls-1 mb-1">
													Click for details{" "}
													<i className="ni ni-bulb-61"></i>
												</h6>
											</span>
										</div>
									</Row>
								</CardHeader>
								<CardBody>
									{selectedPage === "OEE_UPH" ? (
										<>
											<div className="fromToDateSelection"style={{ fontSize: '10px', width: '50%' }} >
												<div
													className="mb-3 mx-auto p-2"
													style={{
														width: "fit-content",
														backgroundColor: "rgb(225 236 255)",
														borderRadius: "10px",
													}}
												>
													<form className="text-center d-flex align-items-center" >
														<label htmlFor="fromDate" className="mb-0 mr-2">
															From:{" "}
														</label>
														<input
															type="date"
															id="fromDate"
															className="form-control mr-2 p-1"
															style={{ height: "fit-content" ,width:'100px'}}
														></input>

														<label htmlFor="toDate" className="mb-0 mr-2">
															To:{" "}
														</label>
														<input
															type="date"
															id="toDate"
															className="form-control mr-2 p-1"
															style={{ height: "fit-content" ,width:'100px'}}
														></input>

														<input
															type="submit"
															value={"go"}
															className="btn btn-primary py-1 px-2"
														/>
													</form>
												</div>
											</div>
											<CardHeader className="bg-transparent">
												<Row className="align-items-center">
													<div className="col">
														<h3 className="mb-0">OEE</h3>

														<table style={{ width: "100%" }}>
															<tr>
																<td
																	style={{ width: "33%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Target: 800
																	</h6>
																</td>
																<td
																	style={{ width: "33%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Actual: 47
																	</h6>
																</td>
																<td
																	style={{ width: "33%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Reject: 3
																	</h6>
																</td>
															</tr>
														</table>
													</div>
												</Row>
											</CardHeader>
											<CardBody>
												{/* Chart */}
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
													}}
												>
													<div
														className="chart"
														style={{
															width: "100px",
															height: "100px",
														}}
													>
														<Doughnut
															data={doughnutData}
															options={{
																...doughnutOptions,
																legend: {
																	display: false,
																	position: "top",
																},
															}}
														/>
													</div>
													<Table style={{ margin: 0 }}>
														<tr>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																	width: "50%",
																}}
															>
																Availability{" "}
															</td>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																}}
															>
																: 80%
															</td>
														</tr>
														<tr>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																}}
															>
																Performance{" "}
															</td>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																}}
															>
																: 80%
															</td>
														</tr>
														<tr>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																}}
															>
																Quality{" "}
															</td>
															<td
																style={{
																	padding: "4px 10px",
																	border: "none",
																}}
															>
																: 80%
															</td>
														</tr>
													</Table>
												</div>
											</CardBody>
											<CardHeader className="bg-transparent">
												<Row className="align-items-center">
													<div className="col">
														<h3 className="mb-0">UPH</h3>
														<table style={{ width: "100%" }}>
															<tr>
																<td
																	style={{ width: "50%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Target: 80
																	</h6>
																</td>
																<td
																	style={{ width: "50%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Actual: 40
																	</h6>
																</td>
															</tr>
														</table>
													</div>
												</Row>
											</CardHeader>
											<CardBody>
												{/* Chart */}
												<center>
													<div
														className="chart "
														style={{
															width: "100px",
															height: "100px",
														}}
													>
														<Doughnut
															data={doughnutData}
															options={{
																...doughnutOptions,
																legend: {
																	display: false,
																	position: "top",
																},
															}}
														/>
													</div>
												</center>
											</CardBody>
										</>
									) : (
										<>
											<h3 className="mb-0">Live Data</h3>
											<Table className="table-no-border">
												<tbody>
													<tr>
														<td>Job Order:</td>
														<td>32134</td>
													</tr>
													<tr>
														<td>Machine Up Time (hour):</td>
														<td>21 hours</td>
													</tr>
													<tr>
														<td>Machine Stop Time (hour):</td>
														<td>2 hours</td>
													</tr>
													<tr>
														<td>Total Output:</td>
														<td>40</td>
													</tr>
													<tr>
														<td>Total Reject:</td>
														<td>40</td>
													</tr>
													<tr>
														<td>Machine Status:</td>
														<td>Running</td>
													</tr>
												</tbody>
											</Table>
											<h3 className="mb-0">Tester Data</h3>
											<Table className="table-no-border">
												<tbody>
													<tr>
														<td>Pass:</td>
														<td>40</td>
													</tr>
													<tr>
														<td>Fail Live:</td>
														<td>2</td>

													</tr>
													<tr>
														<td>Fail Neutral:</td>
														<td>2</td>

													</tr>
													<tr>
														<td>Fail Earth:</td>
														<td>4</td>

													</tr>
													<tr>
														<td>Fail Live x Neutral:</td>
														<td>4</td>
													</tr>
													<tr>
														<td>Fail Neutral x Earth:</td>
														<td>2</td>
													</tr>
													<tr><td>Fail Earth x Live:</td>
														<td>2</td></tr>

													<tr><td>Short When Off:</td>
														<td>4</td></tr>
												</tbody>
											</Table>
											<h3 className="mb-0">Vision Data</h3>
											<Table className="table-no-border">
												<tbody>
													<tr>
														<td>Pass:</td>
														<td>40</td>
													</tr>
													<tr>
														<td>Fail Flow Mark:</td>
														<td>2</td>

													</tr>
													<tr>
														<td>Fail Burr:</td>
														<td>2</td>

													</tr>
													<tr>
														<td>Fail Colouring:</td>
														<td>2</td>
													</tr>
													<tr><td>Fail Colour Uneven:</td>
														<td>2</td></tr>
													<tr><td>Fail Scratches:</td>
														<td>2</td></tr>
												</tbody>
											</Table>
										</>
									)}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Machine;
