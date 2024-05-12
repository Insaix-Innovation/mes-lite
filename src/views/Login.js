import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/brand/logo.png";

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// You can handle form submission here
		console.log("Email:", email);
		console.log("Password:", password);

		navigate("/admin/index");
	};

	return (
		<>
			<div className="pt-7">
				<div
					className="mx-auto d-flex flex-wrap justify-content-center align-items-center"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.5)",
						width: "65%",
						padding: "30px 50px",
						height: "500px",
					}}
				>
					<div
						className="d-flex justify-content-center align-items-center"
						style={{
							flex: 1.5,
							height: "100%",
							backgroundImage: `url(${logo})`, // Set the image as background
							backgroundSize: "cover", // Cover the whole div
							backgroundPosition: "center", // Center the background image
							border: "solid 1px",
						}}
					></div>
					<div
						className="bg-secondary shadow border-0 ml-3 d-flex flex-column"
						style={{
							flex: 1,
							height: "100%",
							border: "solid 1px",
							padding: "10px 15px",
						}}
					>
						<h1 className="mx-auto py-2">Sign In</h1>
						<Form
							onSubmit={handleSubmit}
							className="d-flex flex-column"
						>
							<FormGroup controlId="formBasicEmail">
								<Input
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormGroup>

							<FormGroup controlId="formBasicPassword">
								<Input
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</FormGroup>

							<Button
								type="submit"
								className="btn btn-outline-primary w-100"
							>
								Sign In
							</Button>
							<div>
								<input
									type="checkbox"
									id="stayLogged"
									value="stay"
									className="my-4"
								/>
								<span> </span>
								<Label for="stayLogged"> Stay Logged In</Label>
							</div>

							<div
								style={{
									backgroundColor: "rgba(224,224,224,1)",
									marginBottom: "15px",
									padding: "5px",
								}}
							>
								<a href="#">Forgot Password?</a>
							</div>

							<div
								style={{
									backgroundColor: "rgba(224,224,224,1)",
									marginBottom: "15px",
									padding: "5px",
								}}
							>
								<span>Don't have an account? </span>
								<a href="#">Contact us</a>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
