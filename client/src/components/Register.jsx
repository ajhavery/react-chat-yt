import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    setUserState({
      ...userState,
      [e.target.name]: e.target.value,
    });
  };

  // const handleFile = (e) => {
  //   if (e.target.files.length !== 0) {
  //     setUserState({
  //       ...userState,
  //       [e.target.name]: e.target.files[0],
  //     });
  //   }

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setLoadImage(reader.result);
  //   };
  //   reader.readAsDataURL(e.target.files[0]);
  // };

  // const handleUploadImage = (e) => {
  //   const formData = new FormData();
  //   formData.append("avatar", image);
  // }

  const handleRegistration = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = userState;

    if (password !== confirmPassword) return false;

    const response = await axios({
      method: "POST",
      url: "http://localhost:5000/api/user/register",
      data: { name, email, password },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    if (response.data.success) {
      navigate("/chats");
      localStorage.setItem("token", response.data.token);
      setUserState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="px-6 py-4 bg-blue-500 space-y-6 rounded">
      <h2 className="text-center text-white text-xl font-bold">
        Register to Chat Club
      </h2>
      <form onSubmit={handleRegistration}>
        <div className="flex flex-col space-y-6 pt-6 w-full">
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="name" className="text-white">
              Username
            </label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              id="name"
              value={userState.name}
              onChange={handleInput}
              required
              className="px-2 py-1 outline-none col-span-2 rounded"
            />
          </div>
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              value={userState.email}
              onChange={handleInput}
              required
              className="px-2 py-1 outline-none col-span-2 rounded"
            />
          </div>
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="email" className="text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              value={userState.password}
              onChange={handleInput}
              required
              className="px-2 py-1 outline-none col-span-2 rounded"
            />
          </div>
          <div className="grid grid-cols-3 w-full">
            <label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              value={userState.confirmPassword}
              onChange={handleInput}
              required
              className="px-2 py-1 outline-none col-span-2 rounded"
            />
          </div>

          {/* <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border overflow-hidden">
              {loadImage ? (
                <img
                  src={loadImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <label
                htmlFor="image"
                className="p-2 w-32 text-center rounded-full cursor-pointer bg-[#253C68] text-white"
              >
                Select Image
              </label>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleFile}
                name="image"
                className="sr-only"
                id="image"
              />
            </div>
          </div> */}
          <div className="pt-4 w-full">
            <button className="bg-white rounded px-4 py-2 uppercase w-full hover:bg-blue-100">
              Submit
            </button>
          </div>
          <div className="text-white hover:text-blue-100 text-center">
            <Link to="/messenger/login">Login to Chat Club</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
