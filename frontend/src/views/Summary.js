import React, { useEffect, useState } from 'react';
import { Doughnut } from "react-chartjs-2";
import {
	Badge, Card,
	CardBody,
	CardHeader,
	CardTitle,
	Col,
	Container, Row
	, Table
} from "reactstrap";
import pflImage from "../assets/img/pfl.png";

// core components
import { doughnutOptions } from "./chartOptions.js";

const Summary = (props) => {


	const [data, setData] = useState({
		totalOutput: 0,
		totalRejects: 0,
		totalRunTime: '00:00:00',
		totalStopTime: '00:00:00',
		uniqueErrorCodes: 0
	});

	const [uph, setUPH] = useState({
		target: 0,
		current: 0,
	});

	const [machineUPHData, setMachineUPHData] = useState([]);

	const [lastUpdate, setLastUpdate] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const now = new Date();
				setLastUpdate(`${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'pm' : 'am'}`);

				const response = await fetch('http://localhost:5000/getOverview');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const result = await response.json();
				setData(result);

				const UPHresponse = await fetch('http://localhost:5000/calculateUPH');
				if (!UPHresponse.ok) {
					throw new Error('Network response was not ok');
				}

				const UPHresult = await UPHresponse.json();
				setUPH(UPHresult);

				const machineUPHresponse = await fetch('http://localhost:5000/calculateMachineUPH');
				if (!machineUPHresponse.ok) {
					throw new Error('Network response was not ok');
				}

				const machineUPHresult = await machineUPHresponse.json();
				setMachineUPHData(machineUPHresult.machineUphData);


			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
		const intervalId = setInterval(fetchData, 5000);

		return () => clearInterval(intervalId); // Cleanup interval on component unmount
	}, []);

	const uphPercentage = Math.round((uph.current / uph.target) * 100);

	const doughnutData = {
		datasets: [
			{
				data: [uphPercentage, 100 - uphPercentage],
				backgroundColor: ["#051548", "#33FAFF"], // Blue for UPH, light gray for remaining
			},
		],
		labels: [`UPH(%)`, `Target(%)`],
	};
	// if (window.Chart) {
	//     parseOptions(Chart, chartOptions());
	// }

	return (
		<>
			<div className="header pb-8 pt-5 pt-md-8">
				<Container fluid>
					<div className="header-body">
						<div style={{ paddingBottom: '10px', textAlign: 'right' }}>
							<h6 className="text-muted ls-1 mb-1">
								Last Update: {lastUpdate}

							</h6>
						</div>
						<Row>

							<Col>
								<Card className="card-stats mb-4 mb-xl-4 ">
									<CardBody>
										<Row>
											<div className="col">
												<span className="h2 font-weight-bold mb-0">
													{data.totalOutput}
												</span>
												<CardTitle
													tag="h5"
													className="text-muted mb-0"
												>
													Total Output
												</CardTitle>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col>
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<span
													style={{ color: "red" }}
													className="h2 font-weight-bold mb-0"
												>
													{data.totalRejects}
												</span>
												<CardTitle
													style={{ color: "red" }}
													tag="h5"
													className=" mb-0"
												>
													Rejects
												</CardTitle>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col>
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<span className="h2 font-weight-bold mb-0">
													{data.totalRunTime}
												</span>

												<CardTitle
													tag="h5"
													className=" text-muted mb-0"
												>
													Total Run Time
												</CardTitle>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col>
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<span className="h2 font-weight-bold mb-0">
													{data.totalStopTime}
												</span>

												<CardTitle
													tag="h5"
													className=" text-muted mb-0"
												>
													Total Stop Time
												</CardTitle>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
							<Col>
								<Card className="card-stats mb-4 mb-xl-0">
									<CardBody>
										<Row>
											<div className="col">
												<span
													style={{ color: "red" }}
													className="h2 font-weight-bold mb-0"
												>
													{data.uniqueErrorCodes}
												</span>
												<CardTitle
													style={{ color: "red" }}
													tag="h5"
													className=" mb-0"
												>
													Error Encountered
												</CardTitle>
											</div>
										</Row>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</Container>
			</div>
			<Container className="mt--7" fluid>
				<Row>
					<Col className="mb-5 mb-xl-0" xl="8">
						<Card>
							<CardHeader className="bg-transparent">
								<Row className="align-items-center">
									<div className="col">
										<h6 className="text-uppercase text-light ls-1 mb-1"></h6>
										<h2 className="mb-0">
											Production Floor Layout
										</h2>
									</div>
									<div className="col"></div>
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
								<Badge
									style={{
										backgroundColor: "lightgreen",
										color: "black",
										textTransform: "none",
									}}
									className="h5 mb-0"
								>
									Machine 1
								</Badge>

								<Table className="table-no-border" style={{ justifyContent: 'flex-end', display: 'flex' }}>

									<tr>
										<td style={{ display: "flex", alignItems: "center", border: "none" }}>
											<div style={{ width: "20px", height: "20px", backgroundColor: "lightgreen", borderRadius: "50%", marginRight: "10px" }}></div>
											<span>Machine Running</span>
										</td>
										<td style={{ display: "flex", alignItems: "center", border: "none" }}>
											<div style={{ width: "20px", height: "20px", backgroundColor: "yellow", borderRadius: "50%", marginRight: "10px" }}></div>
											<span>Machine Ready</span>
										</td>
									</tr>
									<tr>

										<td style={{ display: "flex", alignItems: "center", border: "none" }}>
											<div style={{ width: "20px", height: "20px", backgroundColor: "orange", borderRadius: "50%", marginRight: "10px" }}></div>
											<span>Machine Initializing</span>
										</td>
										<td style={{ display: "flex", alignItems: "center", border: "none" }}>
											<div style={{ width: "20px", height: "20px", backgroundColor: "blue", borderRadius: "50%", marginRight: "10px" }}></div>
											<span>Machine Idle</span>
										</td>

									</tr>

									<tr>
										<td style={{ display: "flex", alignItems: "center", border: "none" }}>
											<div style={{ width: "20px", height: "20px", backgroundColor: "red", borderRadius: "50%", marginRight: "10px" }}></div>
											<span>Machine Down</span>
										</td>

									</tr>

								</Table>
							</CardBody>
						</Card>
					</Col>
					<Col xl="4">
						<Card className="shadow">

							<CardHeader className="bg-transparent">
								<Row className="align-items-center">
									<div className="col">
										<h2 className="mb-0">Overall UPH</h2>
										<table style={{ width: "100%" }}>
											<tr>
												<td style={{ width: "50%" }}>
													{" "}
													<h6 className=" text-muted ls-1 mb-1">
														Target: {uph.target}
													</h6>
												</td>
												<td style={{ width: "50%" }}>
													{" "}
													<h6 className=" text-muted ls-1 mb-1">
														Current: {uph.current}
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
											width: "150px",
											height: "150px",
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

							<CardHeader className="bg-transparent">
								<Row className="align-items-center">
									<div className="col">
										<h2 className="mb-0">Machine UPH</h2>

										<table style={{ width: "100%" }}>
											{machineUPHData.map(machine => (
												<tr key={machine.machine_id}>
													<td style={{ width: "33%" }}>
														<h6 className="text-muted ls-1 mb-1">
															Machine {machine.machine_id}: {machine.uph !== null ? machine.uph : 'N/A'}
														</h6>
													</td>
												</tr>
											))}
										</table>
									</div>
								</Row>
							</CardHeader>

						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Summary;
