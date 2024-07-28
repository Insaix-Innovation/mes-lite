import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    if (document.documentElement && document.scrollingElement && mainContent.current) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "MES Lite";
  };

  const token = localStorage.getItem("token"); // Assuming you store the authentication token in localStorage

  if (!token) {
    // If there is no token, redirect to login page
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/summary",
          imgSrc: require("../assets/img/brand/logo.png"),
          imgAlt: "logo",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />

        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Admin;
