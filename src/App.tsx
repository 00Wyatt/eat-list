import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Authentication } from "./components/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { SelectMeals } from "./pages/SelectMeals";
import { Layout } from "./components/Layout";

const appTitle = "Eat List";

export default function App() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col text-gray-900">
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
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/select-meals"
                element={
                  <ProtectedRoute>
                    <SelectMeals />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
