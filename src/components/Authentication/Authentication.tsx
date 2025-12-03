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
    <div className="mx-auto my-6 flex w-full flex-col gap-4 p-6">
      <h2 className="text-center text-xl font-medium text-gray-800 underline decoration-sky-600 underline-offset-5">
        {heading}
      </h2>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};
