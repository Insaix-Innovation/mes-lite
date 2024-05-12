/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

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
				{/* User */}
				{/*<Nav className="align-items-center d-md-none">
					<UncontrolledDropdown nav>
						<DropdownToggle nav className="nav-link-icon">
							<i className="ni ni-bell-55" />
						</DropdownToggle>
						<DropdownMenu
							aria-labelledby="navbar-default_dropdown_1"
							className="dropdown-menu-arrow"
							right
						>
							<DropdownItem>Action</DropdownItem>
							<DropdownItem>Another action</DropdownItem>
							<DropdownItem divider />
							<DropdownItem>Something else here</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
					<UncontrolledDropdown nav>
						<DropdownToggle nav>
							<Media className="align-items-center">
								<span className="avatar avatar-sm rounded-circle">
									<img
										alt="..."
										src={require("../../assets/img/theme/team-1-800x800.jpg")}
									/>
								</span>
							</Media>
						</DropdownToggle>
						<DropdownMenu className="dropdown-menu-arrow" right>
							<DropdownItem
								className="noti-title"
								header
								tag="div"
							>
								<h6 className="text-overflow m-0">Welcome!</h6>
							</DropdownItem>
							<DropdownItem to="/admin/user-profile" tag={Link}>
								<i className="ni ni-single-02" />
								<span>My profile</span>
							</DropdownItem>
							<DropdownItem to="/admin/user-profile" tag={Link}>
								<i className="ni ni-settings-gear-65" />
								<span>Settings</span>
							</DropdownItem>
							<DropdownItem to="/admin/user-profile" tag={Link}>
								<i className="ni ni-calendar-grid-58" />
								<span>Activity</span>
							</DropdownItem>
							<DropdownItem to="/admin/user-profile" tag={Link}>
								<i className="ni ni-support-16" />
								<span>Support</span>
							</DropdownItem>
							<DropdownItem divider />
							<DropdownItem
								href="#pablo"
								onClick={(e) => e.preventDefault()}
							>
								<i className="ni ni-user-run" />
								<span>Logout</span>
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav> */}
				{/* Collapse */}
				<Collapse navbar isOpen={collapseOpen}>
					{/* Collapse header */}
					<div className="navbar-collapse-header d-md-none">
						<Row>
							{logo ? (
								<Col className="collapse-brand" xs="6">
									{logo.innerLink ? (
										<Link to={logo.innerLink}>
											<img
												alt={logo.imgAlt}
												src={logo.imgSrc}
											/>
										</Link>
									) : (
										<a href={logo.outterLink}>
											<img
												alt={logo.imgAlt}
												src={logo.imgSrc}
											/>
										</a>
									)}
								</Col>
							) : null}
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
					{/* Form */}
					<Form className="mt-4 mb-3 d-md-none">
						<InputGroup className="input-group-rounded input-group-merge">
							<Input
								aria-label="Search"
								className="form-control-rounded form-control-prepended"
								placeholder="Search"
								type="search"
							/>
							<InputGroupAddon addonType="prepend">
								<InputGroupText>
									<span className="fa fa-search" />
								</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</Form>
					{/* Navigation */}
					<Nav navbar>{createLinks(routes)}</Nav>
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
						<a href="/auth/login" style={{ color: "#ababab" }}>
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
	// links that will be displayed inside the component
	routes: PropTypes.arrayOf(PropTypes.object),
	logo: PropTypes.shape({
		// innerLink is for links that will direct the user within the app
		// it will be rendered as <Link to="...">...</Link> tag
		innerLink: PropTypes.string,
		// outterLink is for links that will direct the user outside the app
		// it will be rendered as simple <a href="...">...</a> tag
		outterLink: PropTypes.string,
		// the image src of the logo
		imgSrc: PropTypes.string.isRequired,
		// the alt for the img
		imgAlt: PropTypes.string.isRequired,
	}),
};

export default Sidebar;
