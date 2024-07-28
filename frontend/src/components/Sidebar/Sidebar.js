import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Collapse,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Media,
	NavbarBrand,
	Navbar,
	NavItem,
	NavLink,
	Nav,
	Progress,
	Table,
	Container,
	Row,
	Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
	const [collapseOpen, setCollapseOpen] = useState();
	const navigate = useNavigate();;
	// verifies if routeName is the one active (in browser input)
	const activeRoute = (routeName) => {
		return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
	};
	// toggles collapse between opened and closed (true/false)
	const toggleCollapse = () => {
		setCollapseOpen((data) => !data);
	};
	// closes the collapse
	const closeCollapse = () => {
		setCollapseOpen(false);
	};
	// creates the links that appear in the left menu / Sidebar
	const createLinks = (routes) => {
		return routes.map((prop, key) => {
			if (prop.path == "/login") {
				return null;
			} else {
				return (
					<NavItem key={key}>
						<NavLink
							to={prop.layout + prop.path}
							tag={NavLinkRRD}
							onClick={closeCollapse}
							style={{ color: "white", fontWeight: "600" }}
						>
							<i className={prop.icon} />
							{prop.name}
						</NavLink>
					</NavItem>
				);
			}
		});
	};
	// logout function
	const logout = () => {
		localStorage.removeItem("token"); 
		localStorage.removeItem("user"); 
		navigate("/auth/login");
	};

	const { bgColor, routes, logo } = props;
	let navbarBrandProps;
	if (logo && logo.innerLink) {
		navbarBrandProps = {
			to: logo.innerLink,
			tag: Link,
		};
	} else if (logo && logo.outterLink) {
		navbarBrandProps = {
			href: logo.outterLink,
			target: "_blank",
		};
	}
	return (
		<Navbar
			className="navbar-vertical fixed-left navbar-light"
			expand="md"
			id="sidenav-main"
			style={{ backgroundColor: "#120639" }}
		>
			<Container fluid>
				{/* Toggler */}
				<button
					className="navbar-toggler"
					type="button"
					onClick={toggleCollapse}
				>
					<span style={{ color: "white" }}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							fill="currentColor"
							class="bi bi-list"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
							/>
						</svg>
					</span>
				</button>
				{/* Brand */}
				{logo ? (
					<NavbarBrand className="pt-0" {...navbarBrandProps}>
						{/* <img
							alt={logo.imgAlt}
							className="navbar-brand-img"
							src={logo.imgSrc}
						/> */}
						<h1
							style={{
								color: "white",
								fontWeight: "bold",
								margin: "30px 0 20px",
							}}
						>
							<span style={{ color: "#44a2f8" }}>MES</span> Lite
						</h1>
					</NavbarBrand>
				) : null}
		
				<Collapse navbar isOpen={collapseOpen}>
					<div className="navbar-collapse-header d-md-none">
						<Row>
							<Col className="collapse-brand" xs="6">
								
								<Link to={logo.innerLink}>
									<h1
										style={{
											color: "white",
											fontWeight: "bold",
											margin: "30px 0 20px",
											backgroundColor: "#120639",
											width: "fit-content",
											padding: "0 10px",
										}}
									>
										<span style={{ color: "#44a2f8" }}>
											MES
										</span>{" "}
										Lite
									</h1>
								</Link>
							</Col>
							<Col className="collapse-close" xs="6">
								<button
									className="navbar-toggler"
									type="button"
									onClick={toggleCollapse}
								>
									<span />
									<span />
								</button>
							</Col>
						</Row>
					</div>
					{/* Navigation */}
					<Nav navbar>
						{createLinks(routes)}
						<div className="logoutCollapse btn">
							<NavLink
								to="/auth/login"
								tag={NavLinkRRD}
								onClick={closeCollapse}
								style={{ color: "white", fontWeight: "600" }}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-box-arrow-in-right"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
									/>
									<path
										fill-rule="evenodd"
										d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
									/>
								</svg>
								<span className="ml-2">Log Out</span>
							</NavLink>
						</div>
					</Nav>
				</Collapse>
				<div className="logout">
					<span className="mr-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-box-arrow-in-right"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
							/>
							<path
								fill-rule="evenodd"
								d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
							/>
						</svg>
					</span>
					<span>
					<a href="#" onClick={logout} style={{ color: "#ababab" }}>
							Log Out
						</a>
					</span>
				</div>
			</Container>
		</Navbar>
	);
};

Sidebar.defaultProps = {
	routes: [{}],
};

Sidebar.propTypes = {
	routes: PropTypes.arrayOf(PropTypes.object),
	logo: PropTypes.shape({
		innerLink: PropTypes.string,
		outterLink: PropTypes.string,
		imgSrc: PropTypes.string.isRequired,
		imgAlt: PropTypes.string.isRequired,
	}),
};

export default Sidebar;
