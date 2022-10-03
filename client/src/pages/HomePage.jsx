import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  const [showIndex, setShowIndex] = useState(1);

  return (
    <div className="bg-login-bg min-h-screen bg-no-repeat bg-cover bg-center">
      <div className="container">
        <div className="w-[40rem] pt-20 mx-auto space-y-4">
          {/* header */}
          <div className="bg-white w-full rounded-lg p-6 text-center">
            <h1 className="text-3xl font-bold">Talk-A-Tive</h1>
          </div>
          {/* login register section */}
          <div className="bg-white w-full rounded-lg p-6 text-center space-y-6">
            <div className="w-full grid grid-cols-2 items-center gap-4">
              <button
                className={`px-2 py-1 rounded-full ${
                  showIndex === 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border border-blue-500"
                }`}
                onClick={() => setShowIndex(1)}
              >
                Login
              </button>
              <button
                className={`px-2 py-1 rounded-full ${
                  showIndex === 2
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500 border border-blue-500"
                }`}
                onClick={() => setShowIndex(2)}
              >
                Register
              </button>
            </div>
            {/* login register component */}
            <div>
              {/* login component */}
              <div className={showIndex === 1 ? "block" : "hidden"}>
                <Login />
              </div>
              {/* register component */}
              <div className={showIndex === 2 ? "block" : "hidden"}>
                <Register />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
