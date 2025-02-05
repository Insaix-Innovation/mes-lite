import { Link } from "react-router-dom";
// reactstrap components
import {
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
	DropdownToggle,
	Form,
	FormGroup,
	InputGroupAddon,
	InputGroupText,
	Input,
	InputGroup,
	Navbar,
	Nav,
	Container,
	Media,
} from "reactstrap";
import authService from "../../authService";
import { useEffect, useState } from "react";

const AdminNavbar = (props) => {
	const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
	console.log('Current User:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);
  console.log('User State:', user); // Additional debug log


	return (
		<>
			<Navbar
				className="navbar-top navbar-dark"
				expand="md"
				id="navbar-main"
			>
				<Container fluid>
					<Link
						className="h4 mb-0 font-weight-bold text-dark text-uppercase d-none d-lg-inline-block"
						to="/"
					>
						{props.brandText}
					</Link>

					<Nav className="align-items-center d-none d-md-flex" navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img
											alt="..."
											src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
										/>
									</span>
									<Media className="ml-2 d-none d-lg-block">
										<span className="mb-0 text-sm font-weight-bold text-dark">
										{user ? user.username : "Guest"}
										</span>
									</Media>
								</Media>
							</DropdownToggle>
							{/* <DropdownMenu className="dropdown-menu-arrow" right>
								<DropdownItem
									className="noti-title"
									header
									tag="div"
								>
									<h6 className="text-overflow m-0">
										welcome!
									</h6>
								</DropdownItem>
								<DropdownItem
									to="/admin/user-profile"
									tag={Link}
								>
									<i className="ni ni-single-02" />
									<span>My profile</span>
								</DropdownItem>
								<DropdownItem
									to="/admin/user-profile"
									tag={Link}
								>
									<i className="ni ni-settings-gear-65" />
									<span>Settings</span>
								</DropdownItem>
								<DropdownItem
									to="/admin/user-profile"
									tag={Link}
								>
									<i className="ni ni-calendar-grid-58" />
									<span>Activity</span>
								</DropdownItem>
								<DropdownItem
									to="/admin/user-profile"
									tag={Link}
								>
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
							</DropdownMenu> */}
						</UncontrolledDropdown>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default AdminNavbar;
