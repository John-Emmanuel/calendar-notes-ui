import { useState } from "react";
import api from "../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.get("/sanctum/csrf-cookie"); 
      if (isLogin) {
        const res = await api.post<User>("/api/login", { email, password });
        onLogin(res.data);
      } else {
        await api.post("/api/register", {
          name,
          email,
          password,
          password_confirmation: passwordConfirm,
        });
        const res = await api.post<User>("/api/login", { email, password });
        onLogin(res.data);
      }
    } catch (err) {
      console.error(err);
      alert((err as any).response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-gray-200 dark:bg-gray-800 rounded-xl w-full max-w-sm space-y-4"
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="text-center mt-2">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}
