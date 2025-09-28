import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	if (isLoading) return <div>Loading...</div>;
	return user ? children : <Navigate to="/login" replace />;
}
