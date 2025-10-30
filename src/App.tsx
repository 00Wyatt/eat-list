import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Authentication } from "./components/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { CreateList } from "./pages/CreateList";

const appTitle = "Eat List";

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
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/create-list"
						element={
							<ProtectedRoute>
								<CreateList />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
