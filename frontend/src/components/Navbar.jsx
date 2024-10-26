import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const Navbar = ({ toggleSidebar, isCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setShowResults(false);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="bg-blue-600 p-4 flex items-center justify-between">
      <h1 className="text-white text-lg">My App</h1>

      {/* Search Field */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="hidden md:block p-2 rounded-lg border border-gray-300"
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full max-w-xs overflow-hidden z-10">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleResultClick(user._id)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {user.fullName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Toggle Button for mobile */}
      <button onClick={toggleSidebar} className="text-white md:hidden">
        {isCollapsed ? "➤" : "☰"}
      </button>
    </div>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export default Navbar;
