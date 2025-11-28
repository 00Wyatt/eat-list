import { Navigate } from "react-router";
import { LuLoaderCircle } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="flex items-center gap-1 text-lg font-medium text-gray-800">
          <LuLoaderCircle className="animate-spin" /> Loading...
        </span>
      </div>
    );
  return user ? children : <Navigate to="/login" replace />;
}
