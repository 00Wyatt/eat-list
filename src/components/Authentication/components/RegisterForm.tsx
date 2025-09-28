import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";

const schema = z
	.object({
		email: z.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
	})
	.refine(data => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export type RegisterFormData = z.infer<typeof schema>;

interface RegisterFormProps {
	onSuccess?: (cred: unknown) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		reset,
	} = useForm<RegisterFormData>({
		resolver: zodResolver(schema),
	});
	const { signup } = useAuth();

	const onSubmit = async (data: RegisterFormData) => {
		try {
			const userCredential = await signup(data.email, data.password);

			if (onSuccess) onSuccess(userCredential);
			reset();
		} catch (err) {
			if (err instanceof Error) {
				setError("root", { message: err.message });
			} else {
				setError("root", { message: "Registration failed" });
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col">
				<label>Email</label>
				<input
					type="email"
					{...register("email")}
					className="border border-gray-300 p-1"
				/>
				{errors.email && (
					<span className="text-red-500 text-sm">
						{errors.email.message}
					</span>
				)}
			</div>
			<div className="flex flex-col">
				<label>Password</label>
				<input
					type="password"
					{...register("password")}
					className="border border-gray-300 p-1"
				/>
				{errors.password && (
					<span className="text-red-500 text-sm">
						{errors.password.message}
					</span>
				)}
			</div>
			<div className="flex flex-col">
				<label>Confirm Password</label>
				<input
					type="password"
					{...register("confirmPassword")}
					className="border border-gray-300 p-1"
				/>
				{errors.confirmPassword && (
					<span className="text-red-500 text-sm">
						{errors.confirmPassword.message}
					</span>
				)}
			</div>
			{errors.root && (
				<span className="text-red-500 text-sm">
					{errors.root.message}
				</span>
			)}
			<button
				type="submit"
				className="bg-green-600 text-white py-2 rounded">
				Create Account
			</button>
		</form>
	);
};
