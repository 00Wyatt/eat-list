import { Authentication } from "./components/Authentication";
import { AuthProvider } from "./contexts/AuthContext";

const appTitle = "Eat List";

export default function App() {
	return (
		<AuthProvider>
			<div className="p-8">
				<Authentication
					heading={appTitle}
					onAuthSuccess={user =>
						console.log("User authenticated:", user)
					}
				/>
			</div>
		</AuthProvider>
	);
}
