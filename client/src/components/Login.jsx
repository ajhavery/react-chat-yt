import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:5000/api/user/login",
        data: {
          email: email,
          password: password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        roles: response.data.roles,
        token: response.data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      if (response.data.success) {
        toast.success("You have been logged in!");
        navigate("/chats");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="px-6 py-4 bg-blue-500 space-y-6 rounded">
      <h2 className="text-center text-white text-xl font-bold">
        Login to Chat Club
      </h2>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-2 py-1 outline-none col-span-2 rounded"
            />
          </div>
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="email" className="text-white">
              Password
            </label>
            <div className="col-span-2 flex items-center justify-between w-full pl-2 pr-1 py-1 bg-white rounded">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="outline-none "
              />
              <button
                className="bg-blue-500 text-white rounded px-1 py-0.5 text-sm"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="pt-4 w-full space-y-4">
            <button className="bg-white rounded px-4 py-2 uppercase w-full hover:bg-blue-100">
              Submit
            </button>
            <button className="bg-white rounded px-4 py-2 uppercase w-full hover:bg-blue-100">
              Get Guest User Credentials
            </button>
          </div>
          <div className="text-white hover:text-blue-100">
            <Link to="/messenger/register">Register a new account</Link>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
