import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice"; // If you have a logout action in Redux

const SidebarWithNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeOption, setActiveOption] = useState("Home");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = [
    { name: "Home", path: "/" },
    { name: "Notifications", path: "/notifications" },
    { name: "Messages", path: "/messages" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Dispatch logout action to clear Redux store (if applicable)
    dispatch(logout());

    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } bg-gray-800 text-white flex flex-col transition-all duration-300`}
        >
          <ul className="flex flex-col mt-4">
            {options.map((option) => (
              <li key={option.name}>
                <Link
                  to={option.path}
                  onClick={() => setActiveOption(option.name)}
                  className={`p-3 block hover:bg-gray-700 ${
                    activeOption === option.name ? "bg-gray-700" : ""
                  }`}
                >
                  {isCollapsed ? option.name.charAt(0) : option.name}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="p-3 block hover:bg-gray-700"
              >
                {isCollapsed ? "L" : "Logout"}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Outlet /> {/* This will render the selected page content */}
        </div>
      </div>
    </div>
  );
};

export default SidebarWithNavbar;
