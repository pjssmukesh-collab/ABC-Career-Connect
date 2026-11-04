import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import "./LoginCard.css";
import api from "../services/api";

const roleOptions = [
	{
		value: "student",
		label: "Student"
	},
	{
		value: "placement-admin",
		label: "Placement Admin"
	},
	{
		value: "recruiter",
		label: "Recruiter"
	}
];

const fieldConfig = {
	student: {
		label: "Roll Number",
		placeholder: "Enter your roll number (e.g. 23331A05D3)",
		icon: FiUser,
		type: "text",
		demoUser: "23331A05D3",
		demoPass: "student@123"
	},
	"placement-admin": {
		label: "Email Address",
		placeholder: "Enter your email address (e.g. mukesh@gmail.com)",
		icon: FiMail,
		type: "email",
		demoUser: "mukesh@gmail.com",
		demoPass: "mukesh@123"
	},
	recruiter: {
		label: "Company Email Address",
		placeholder: "Enter company email (e.g. google@gmail.com)",
		icon: FiMail,
		type: "email",
		demoUser: "google@gmail.com",
		demoPass: "google@123"
	}
};

function LoginCard() {
	const navigate = useNavigate();
	const [role, setRole] = useState("student");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const currentField = fieldConfig[role];
	const InputIcon = currentField.icon;

	const handleQuickFill = () => {
		setUsername(currentField.demoUser);
		setPassword(currentField.demoPass);
	};

	async function handleSubmit(event) {
		event.preventDefault();
		let url = "";
		let loginData = {};

		if (role === "student") {
			url = "/student/login";
			loginData = {
				roll_number: username,
				password: password
			};
		} else if (role === "placement-admin") {
			url = "/admin/login";
			loginData = {
				email_id: username,
				password: password
			};
		} else if (role === "recruiter") {
			url = "/recruiter/login";
			loginData = {
				email_id: username,
				password: password
			};
		}

		try {
			setLoading(true);
			const response = await api.post(url, loginData);

			if (role === "student") {
				localStorage.setItem("userRole", "student");
				localStorage.setItem("studentRoll", response.data.roll_number || username);
				localStorage.setItem("studentName", response.data.student_name || "");
				localStorage.setItem("studentData", JSON.stringify(response.data));
				navigate("/student");
			} else if (role === "placement-admin") {
				localStorage.setItem("userRole", "admin");
				localStorage.setItem("adminEmail", response.data.email_id || username);
				localStorage.setItem("adminName", response.data.name || "Placement Administrator");
				localStorage.setItem("adminData", JSON.stringify(response.data));
				navigate("/admin");
			} else if (role === "recruiter") {
				localStorage.setItem("userRole", "recruiter");
				localStorage.setItem("recruiterEmail", response.data.email_id || username);
				localStorage.setItem("recruiterCompany", response.data.company_name || "");
				localStorage.setItem("recruiterName", response.data.name || "");
				localStorage.setItem("recruiterData", JSON.stringify(response.data));
				navigate("/recruiter");
			}
		} catch (error) {
			console.error("Login Error:", error.response?.data);
			alert(
				error.response?.data?.detail || "Invalid username or password"
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="login-card">
			<div className="login-card__header">
				<h2 className="login-card__title">Welcome Back</h2>
				<p className="login-card__subtitle">Login to your portal account</p>
			</div>

			<form className="login-card__form" onSubmit={handleSubmit}>
				{/* ROLE */}
				<div>
					<label className="login-card__label">Login As</label>
					<select
						value={role}
						className="login-card__select"
						onChange={(e) => {
							setRole(e.target.value);
							setUsername("");
							setPassword("");
						}}
					>
						{roleOptions.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
				</div>

				{/* USERNAME */}
				<div>
					<label className="login-card__label">{currentField.label}</label>
					<div className="input-box">
						<InputIcon className="input-icon" size={18} />
						<input
							type={currentField.type}
							value={username}
							placeholder={currentField.placeholder}
							className="login-card__input"
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
				</div>

				{/* PASSWORD */}
				<div>
					<label className="login-card__label">Password</label>
					<div className="input-box">
						<FiLock className="input-icon" size={18} />
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							placeholder="Enter your password"
							className="login-card__input password-input"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							className="eye-btn"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
						</button>
					</div>
				</div>

				<button type="submit" className="login-card__submit" disabled={loading}>
					{loading ? "Authenticating..." : "Login"}
				</button>
			</form>

			{/* Quick Fill Demo Credentials Helper */}
			<div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #e2e8f0", textAlign: "center" }}>
				<p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 6px 0" }}>
					Need test credentials for <strong>{roleOptions.find(r => r.value === role)?.label}</strong>?
				</p>
				<button
					type="button"
					onClick={handleQuickFill}
					style={{
						background: "#f1f5f9",
						border: "1px solid #cbd5e1",
						borderRadius: "6px",
						padding: "4px 10px",
						fontSize: "12px",
						color: "#1e293b",
						cursor: "pointer",
						fontWeight: 500
					}}
				>
					Auto-fill Demo: {currentField.demoUser}
				</button>
			</div>
		</div>
	);
}

export default LoginCard;
