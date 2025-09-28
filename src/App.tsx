import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Authentication } from "./components/Authentication";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const appTitle = "Eat List";

function HomePage() {
	const { user, logout } = useAuth();
	return (
		<div className="p-8">
			<h1>Welcome, {user?.email}</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={
							<Authentication
								heading={appTitle}
								onAuthSuccess={(_, navigate) => navigate("/")}
							/>
						}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<HomePage />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
