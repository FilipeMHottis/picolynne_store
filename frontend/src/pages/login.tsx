import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import { FormEvent } from "react";
import "../animations/shack.css"

const LOGIN_URL = `${BACKEND_URL}/login`;

interface LoginRequest {
  username: string;
  password: string;
}

const login = async (
  username: string,
  password: string
) => {
  const requestBody: LoginRequest = { username, password };

  try {
    const response = await apiRequest<string>({
      method: "POST",
      url: LOGIN_URL,
      body: requestBody,
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

function Login() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login(username, password);
      const token = response.data;
      const user = { username, token };

      // Store user and token in session storage
      StorageUtil.setItem("user", user);
      StorageUtil.setItem("token", token);

      // Redirect to the home page
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      
      // Animation form-box
      const formBox = document.getElementById("form-box");
      if (formBox) {
        formBox.classList.add("animate-shake");
        setTimeout(() => {
          formBox.classList.remove("animate-shake");
        }, 500);
      }

      // Show error message
      const errorBox = document.getElementById("error-box");
      if (errorBox) {
        errorBox.classList.remove("hidden");

        setTimeout(() => {
          errorBox.classList.add("hidden");
        }, 3000);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-600 to-red-500">
      <div id="form-box" className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md m-3.5">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Login</h2>

        <div id="error-box" className="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> Usuário ou senha inválidos.</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
