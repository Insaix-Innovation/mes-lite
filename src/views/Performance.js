import Chart from "chart.js";
import classnames from "classnames";
import pflImage from '../assets/img/pfl.png';
import { useState } from "react";
import { Bar, Line, Pie,Doughnut } from "react-chartjs-2";
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

const Performance = (props) => {
    
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
    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                    <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'120px', backgroundColor: '#120639'}}>
                  <CardBody >
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="mb-3" style={{color: 'white'}}
                        >
                          Overall Target
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0" style={{color: 'white'}}>
                          89,000
                        </span>
                      </div>
                     
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'120px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className=" mb-3"
                        >
                          Overall Output
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">74,845</span>
                      </div>
                     
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'120px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className="mb-3"
                        >
                          Overall Run Time
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">60</span>
                      </div>
                      
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'120px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h3"
                          className=" mb-3"
                        >
                          Overall Performance
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">97%</span>
                      </div>
                      
                    </Row>
                   
                  </CardBody>
                </Card>
              </Col>
            </Row>
                    </div>
                </Container>
            </div>
           
        </>
    );
};

export default Performance;
