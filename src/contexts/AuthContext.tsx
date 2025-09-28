import { createContext, useContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { auth } from "../../firebase";

export interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	signup(email: string, password: string): Promise<UserCredential>;
	login(email: string, password: string): Promise<UserCredential>;
	logout(): Promise<void>;
	resetPassword(email: string): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
	return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, u => {
			setUser(u);
			setIsLoading(false);
		});
		return unsub;
	}, []);

	const signup = (email: string, password: string) =>
		createUserWithEmailAndPassword(auth, email, password);

	const login = (email: string, password: string) =>
		signInWithEmailAndPassword(auth, email, password);

	const logout = async () => {
		await signOut(auth);
	};

	const resetPassword = (email: string) =>
		sendPasswordResetEmail(auth, email);

	const value: AuthContextValue = {
		user,
		isLoading,
		signup,
		login,
		logout,
		resetPassword,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
