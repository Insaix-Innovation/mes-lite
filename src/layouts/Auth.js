import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

const Auth = (props) => {
	const mainContent = React.useRef(null);
	const location = useLocation();

	React.useEffect(() => {
		// document.body.classList.add("bg-default");
		return () => {
			// document.body.classList.remove("bg-default");
		};
	}, []);
	React.useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		mainContent.current.scrollTop = 0;
	}, [location]);

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === "/auth") {
				console.log(prop.path);
				return (
					<Route
						path={prop.path}
						element={prop.component}
						key={key}
						exact
					/>
				);
			} else {
				return null;
			}
		});
	};

	return (
		<>
			<div className="bg-primary" ref={mainContent}>
				{/* Page content */}
				<div className="vh-100">
					<Routes>
						{getRoutes(routes)}
						<Route
							path="*"
							element={<Navigate to="/auth/login" replace />}
						/>
					</Routes>
				</div>
			</div>
			{/* <AuthFooter /> */}
		</>
	);
};

export default Auth;
