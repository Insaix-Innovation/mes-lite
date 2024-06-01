import { useEffect, useState } from "react";
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
	const [selectedPage, setSelectedPage] = useState("Live");
    const [selectedMachine, setSelectedMachine] = useState("M01");

	const handlePageChange = (page) => {
		setSelectedPage(page);
	};

	const handleMachineChange = (e) => {
        const machineId = e.target.value;
        setSelectedMachine(machineId);
    };

	
	const [machineData, setMachineData] = useState({
		jobOrder: 0,
		machineUptime: 0,
		machineDowntime: 0,
		totalOutputQty: 0,
		totalRejectQty: 0,
		machineStatus: 0
	});

	const [testerData, setTesterData] = useState({
		pass: 0,
		failLive: 0,
		failNeutral: 0,
		failEarth: 0,
		failLiveNeutral: 0,
		failNeutralEarth: 0,
		failEarthLive: 0,
		shortWhenOff: 0
	});

	const [visionData, setVisionData] = useState({
		good: 0,
		flowmark: 0,
		burrno: 0,
		coloruneven: 0,
		color:0,
		scratches:0
	});

	const [machineUPHData, setMachineUPHData] = useState({
		target:0,
		current:0,
		uphPercentageMachine:0
	});


	const doughnutData = {
		datasets: [
			{
				data: [100, 100 - 50],
				backgroundColor: ["#051548", "#33FAFF"], // Blue for UPH, light gray for remaining
			},
		],
		labels: [`(%)`, `(%)`],
	};

	
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const machineResponse = await fetch('http://localhost:5000/getMachineLive');
	// 			if (!machineResponse.ok) {
	// 				throw new Error('Network response was not ok for /getMachineLive');
	// 			}
	// 			const machineResult = await machineResponse.json();
	// 			setMachineData(machineResult);

	// 			const testerResponse = await fetch('http://localhost:5000/getTesterLive');
	// 			if (!testerResponse.ok) {
	// 				throw new Error('Network response was not ok for /getTesterLive');
	// 			}
	// 			const testerResult = await testerResponse.json();
	// 			setTesterData(testerResult);

	// 			const visionResponse = await fetch('http://localhost:5000/getVisionLive');
	// 			if (!visionResponse.ok) {
	// 				throw new Error('Network response was not ok for /getVisionLive');
	// 			}
	// 			const visionResult = await visionResponse.json();
	// 			setVisionData(visionResult);
	// 		} catch (error) {
	// 			console.error('Error fetching data:', error);
	// 		}
	// 	};
	// 	fetchData();
	// }, []);

	const fetchData = async (machineId) => {
        try {
            const machineResponse = await fetch(`http://localhost:5000/getMachineLive?machineId=${machineId}`);
            if (!machineResponse.ok) {
                throw new Error("Network response was not ok for /getMachineLive");
            }
            const machineResult = await machineResponse.json();
            setMachineData(machineResult);

            const testerResponse = await fetch(`http://localhost:5000/getTesterLive?machineId=${machineId}`);
            if (!testerResponse.ok) {
                throw new Error("Network response was not ok for /getTesterLive");
            }
            const testerResult = await testerResponse.json();
            setTesterData(testerResult);

            const visionResponse = await fetch(`http://localhost:5000/getVisionLive?machineId=${machineId}`);
            if (!visionResponse.ok) {
                throw new Error("Network response was not ok for /getVisionLive");
            }
            const visionResult = await visionResponse.json();
            setVisionData(visionResult);

			const machineUPHResponse = await fetch(`http://localhost:5000/calculateMachineUPHdropDown?machineId=${machineId}`);
            if (!machineUPHResponse.ok) {
                throw new Error("Network response was not ok for /calculateMachineUPHdropDown");
            }
            const machineUPHResult = await machineUPHResponse.json();
            setMachineUPHData(machineUPHResult);


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(selectedMachine);
    }, [selectedMachine]);

	const doughnutData2 = {
		datasets: [
			{
				data: [machineUPHData.uphPercentageMachine, 100 - machineUPHData.uphPercentageMachine],
				backgroundColor: ["#051548", "#33FAFF"], // Blue for UPH, light gray for remaining
			},
		],
		labels: [`UPH(%)`, `Target(%)`],
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
													onChange={handleMachineChange}
                                                    value={selectedMachine}
												>
													<option value="M01">M01</option>
                                                    <option value="M02" disabled>M02</option>
                                                    <option value="M03" disabled>M03</option>
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
											<div className="fromToDateSelection" style={{ fontSize: '10px', width: '50%' }} >
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
															style={{ height: "fit-content", width: '100px' }}
														></input>

														<label htmlFor="toDate" className="mb-0 mr-2">
															To:{" "}
														</label>
														<input
															type="date"
															id="toDate"
															className="form-control mr-2 p-1"
															style={{ height: "fit-content", width: '100px' }}
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
																		Target: {machineUPHData.target}
																	</h6>
																</td>
																<td
																	style={{ width: "50%" }}
																>
																	{" "}
																	<h6 className=" text-muted ls-1 mb-1">
																		Current: {machineUPHData.current}
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
															data={doughnutData2}
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
														<td>{machineData.jobOrder}</td>
													</tr>
													<tr>
														<td>Machine Up Time (hour):</td>
														<td>{machineData.machineUptime} hours</td>
													</tr>
													<tr>
														<td>Machine Stop Time (hour):</td>
														<td>{machineData.machineDowntime} hours</td>
													</tr>
													<tr>
														<td>Total Output:</td>
														<td>{machineData.totalOutputQty}</td>
													</tr>
													<tr>
														<td>Total Reject:</td>
														<td>{machineData.totalRejectQty}</td>
													</tr>
													<tr>
														<td>Machine Status:</td>
														<td>{machineData.machineStatus}</td>
													</tr>
												</tbody>
											</Table>
											<h3 className="mb-0">Tester Data</h3>
											<Table className="table-no-border">
												<tbody>
													<tr>
														<td>Pass:</td>
														<td>{testerData.pass}</td>
													</tr>
													<tr>
														<td>Fail Live:</td>
														<td>{testerData.failLive}</td>

													</tr>
													<tr>
														<td>Fail Neutral:</td>
														<td>{testerData.failNeutral}</td>

													</tr>
													<tr>
														<td>Fail Earth:</td>
														<td>{testerData.failEarth}</td>

													</tr>
													<tr>
														<td>Fail Live x Neutral:</td>
														<td>{testerData.failLiveNeutral}</td>
													</tr>
													<tr>
														<td>Fail Neutral x Earth:</td>
														<td>{testerData.failNeutralEarth}</td>
													</tr>
													<tr><td>Fail Earth x Live:</td>
														<td>{testerData.failEarthLive}</td></tr>

													<tr><td>Short When Off:</td>
														<td>{testerData.shortWhenOff}</td></tr>
												</tbody>
											</Table>
											<h3 className="mb-0">Vision Data</h3>
											<Table className="table-no-border">
												<tbody>
													<tr>
														<td>Pass:</td>
														<td>{visionData.good}</td>
													</tr>
													<tr>
														<td>Fail Flow Mark:</td>
														<td>{visionData.flowmark}</td>

													</tr>
													<tr>
														<td>Fail Burr:</td>
														<td>{visionData.burrno}</td>

													</tr>
													<tr>
														<td>Fail Colouring:</td>
														<td>{visionData.color}</td>
													</tr>
													<tr><td>Fail Colour Uneven:</td>
														<td>{visionData.coloruneven}</td></tr>
													<tr><td>Fail Scratches:</td>
														<td>{visionData.scratches}</td></tr>
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
