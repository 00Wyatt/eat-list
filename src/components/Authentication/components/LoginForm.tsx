import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common/Button";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof schema>;

interface LoginFormProps {
  onSuccess?: (cred: unknown) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userCredential = await login(data.email, data.password);

      if (onSuccess) onSuccess(userCredential);
    } catch (err) {
      if (err instanceof Error) {
        setError("root", { message: err.message });
      } else {
        setError("root", { message: "Login failed" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="rounded border border-gray-300 p-1"
        />
        {errors.email && (
          <span className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="rounded border border-gray-300 p-1"
        />
        {errors.password && (
          <span className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      {errors.root && (
        <span className="text-sm text-red-500">{errors.root.message}</span>
      )}
      <Button type="submit" color="emphasized" className="mt-1">
        Login
      </Button>
    </form>
  );
};
