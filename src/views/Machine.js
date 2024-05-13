import Chart from "chart.js";
import classnames from "classnames";
import pflImage from '../assets/img/machine.png';
import { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Badge } from 'reactstrap';
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

const Summary = (props) => {

    const [activeNav, setActiveNav] = useState(1);
    const [chartExample1Data, setChartExample1Data] = useState("data1");

    const oeeValue = 50;

    const doughnutData = {
        datasets: [{
            data: [oeeValue, 100 - oeeValue],
            backgroundColor: ['#051548', '#33FAFF'], // Blue for OEE, light gray for remaining
        }],
        labels: ['OEE', 'Target'],
    };
    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }


    const toggleNavs = (e, index) => {
        e.preventDefault();
        setActiveNav(index);
        setChartExample1Data("data" + index);
    };
    return (
        <>
            <div className="header pb-8 pt-5 pt-md-8">
                <Container fluid>
                    
              
            
                <Row>
                    <Col className="mb-5 mb-xl-0" xl="8">
                        <Card >
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h6 className="text-uppercase text-light ls-1 mb-1">
                                        </h6>
                                        <h2 className="mb-0">Production Line
                                            <select style={{ paddingLeft: '20px', paddingRight: '20px', marginLeft: '20px', borderRadius: '20px', border: '1px solid lightgray', fontSize: '1rem' }}>
                                                <option selected>Line A</option>
                                                <option>Line B</option>
                                                <option>Line C</option>
                                            </select>
                                        </h2>
                                    </div>
                                    <div className="col">

                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <img src={pflImage} alt="Production Floor Layout" style={{ width: '100%', marginBottom: '20px' }} />

                            </CardBody>

                        </Card>
                    </Col>
                    <Col xl="4">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">Assets Info</h3></div>

                                    <div className="col" style={{ paddingTop: '5px' }}>
                                        <span ><h6 className=" text-muted ls-1 mb-1">Click for details <i className="ni ni-bulb-61"></i></h6></span>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">OEE</h3>

                                        <table style={{ width: '100%' }}>
                                            <tr>
                                                <td style={{ width: '33%' }}> <h6 className=" text-muted ls-1 mb-1">Target: 800</h6></td>
                                                <td style={{ width: '33%' }}> <h6 className=" text-muted ls-1 mb-1">Actual: 47</h6></td>
                                                <td style={{ width: '33%' }}> <h6 className=" text-muted ls-1 mb-1">Reject: 3</h6></td>
                                            </tr>
                                        </table>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/* Chart */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="chart" style={{ width: '100px', height: '100px' }}>
                                        <Doughnut
                                            data={doughnutData}
                                            options={{
                                                cutoutPercentage: 75
                                            }}
                                        />
                                    </div>
                                    <Table style={{ margin: 0 }}> 
                                        <tr>
                                            <td style={{ padding: '4px 10px' , border: 'none', width:'50%'}}>Availability </td> 
                                            <td style={{ padding: '4px 10px' , border: 'none'}}>: 80%</td> 
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '4px 10px' , border: 'none'}}>Performance </td> 
                                            <td style={{ padding: '4px 10px' , border: 'none'}}>: 80%</td> 
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '4px 10px' , border: 'none'}}>Quality </td> 
                                            <td style={{ padding: '4px 10px' , border: 'none'}}>: 80%</td> 
                                        </tr>
                                    </Table>
                                </div>
                            </CardBody>
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                    <div className="col">
                                        <h3 className="mb-0">UPH</h3>
                                        <table style={{ width: '100%' }}>
                                            <tr>
                                                <td style={{ width: '50%' }}> <h6 className=" text-muted ls-1 mb-1">Target: 80</h6></td>
                                                <td style={{ width: '50%' }}> <h6 className=" text-muted ls-1 mb-1">Actual: 40</h6></td>
                                            </tr>

                                        </table>

                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/* Chart */}
                                <center>
                                    <div className="chart " style={{ width: '100px', height: '100px' }}>
                                        <Doughnut
                                            data={doughnutData}
                                            options={{
                                                cutoutPercentage: 75
                                            }}
                                        />
                                    </div>
                                </center>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                </Container>
            </div>
            
        </>
    );
};

export default Summary;
