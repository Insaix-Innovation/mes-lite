import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Summary from "views/Summary.js";
import Machine from "views/Machine.js";
import Performance from "views/Performance.js";
import Utilization from "views/Utilization.js";
import Quality from "views/Quality.js";

var routes = [
	{
		path: "/index",
		name: "Dashboard",
		icon: "ni ni-tv-2 text-white",
		component: <Index />,
		layout: "/admin",
	},
	{
		path: "/summary",
		name: "Summary",
		icon: "ni ni-align-center text-white",
		component: <Summary />,
		layout: "/admin",
	},
	{
		path: "/machine",
		name: "Machine",
		icon: "ni ni-settings text-white",
		component: <Machine />,
		layout: "/admin",
	},
	{
		path: "/login",
		name: "Login",
		icon: "ni ni-key-25 text-info",
		component: <Login />,
		layout: "/auth",
	},
	{
		path: "/utilization",
		name: "Utilization",
		icon: "ni ni-calendar-grid-58 text-black",
		component: <Utilization />,
		layout: "/admin",
	},
	{
		path: "/performance",
		name: "Performance",
		icon: "ni ni-watch-time text-white",
		component: <Performance />,
		layout: "/admin",
	},
	{
		path: "/quality",
		name: "Quality",
		icon: "ni ni-watch-time text-white",
		component: <Quality />,
		layout: "/admin",
	},
];
export default routes;
