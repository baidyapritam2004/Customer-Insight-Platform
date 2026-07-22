import { useState } from "react";
import { login } from "../services/authService";

export default function LoginForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await login(username, password);

      alert("Login Successful");

      console.log(response.data);

    } catch (error) {

      alert("Invalid Username or Password");

    }

  };

  return (

    <form onSubmit={handleSubmit} className="space-y-5">

      <div>

        <label className="block mb-2 font-medium">
          Username
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          required
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Password
        </label>

        <input
          type="password"
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold"
      >
        Login
      </button>

    </form>

  );

}