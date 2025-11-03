import { useNavigate } from "react-router";
import { LoginForm } from "./components/LoginForm";

interface AuthPanelProps {
  onAuthSuccess?: (user: unknown, navigate: (path: string) => void) => void;
  heading?: string;
}

export const Authentication = ({
  onAuthSuccess,
  heading = "Welcome",
}: AuthPanelProps) => {
  let navigate = useNavigate();

  const handleSuccess = (cred: unknown) => {
    if (onAuthSuccess) onAuthSuccess(cred, navigate);
  };

  return (
    <div className="mx-auto my-6 flex max-w-sm flex-col gap-4 rounded border p-6 shadow">
      <h2 className="text-center text-xl font-semibold">{heading}</h2>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};
