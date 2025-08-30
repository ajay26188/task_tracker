import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { alertMessageHandler } from "../reducers/alertReducer";
import type { AppDispatch } from "../store";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    //Call backend API
    try {
      const user = await loginService.login({email, password});

      //save the value to local storage using stringify method
      window.localStorage.setItem('loggedUser',JSON.stringify(user));

      dispatch(alertMessageHandler(
        { message: 'Login successful.', type: "success" }, 
        5
      ));

      console.log("Login with:", { email, password });
      navigate("/dashboard");

  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Backend error:", error.response.data.error);

        dispatch(alertMessageHandler(
          { message: error.response.data.error, type: "error" }, 
          5
        ));
        
      } else {
        console.error("Network error:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-96 bg-white p-8 rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
