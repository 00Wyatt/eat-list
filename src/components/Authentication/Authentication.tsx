import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

interface AuthPanelProps {
	initialMode?: "login" | "register";
	onAuthSuccess?: (user: unknown) => void;
	heading?: string;
}

export const Authentication = ({
	initialMode = "login",
	onAuthSuccess,
	heading = "Welcome",
}: AuthPanelProps) => {
	const [mode, setMode] = useState<"login" | "register">(initialMode);
	const [justRegistered, setJustRegistered] = useState(false);

	const handleSuccess = (cred: unknown) => {
		if (mode === "register") {
			setJustRegistered(true);
			setMode("login");
		}
		if (onAuthSuccess) onAuthSuccess(cred);
	};

	return (
		<div className="max-w-sm mx-auto p-6 border rounded shadow flex flex-col gap-4">
			<h2 className="text-xl font-semibold text-center">{heading}</h2>
			{justRegistered && (
				<div className="text-green-600 text-sm text-center">
					Account created. Please log in.
				</div>
			)}
			{mode === "login" ? (
				<LoginForm onSuccess={handleSuccess} />
			) : (
				<RegisterForm onSuccess={handleSuccess} />
			)}
			<div className="text-sm text-center">
				{mode === "login" ? (
					<button
						type="button"
						className="text-blue-600 hover:underline"
						onClick={() => setMode("register")}>
						Need an account? Register
					</button>
				) : (
					<button
						type="button"
						className="text-blue-600 hover:underline"
						onClick={() => setMode("login")}>
						Already have an account? Log in
					</button>
				)}
			</div>
		</div>
	);
};
