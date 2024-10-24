import PropTypes from "prop-types";

const Navbar = ({ toggleSidebar, isCollapsed }) => {
  return (
    <div className="bg-blue-600 p-4 flex items-center justify-between">
      <h1 className="text-white text-lg">My App</h1>
      
      {/* Search Field - hidden on small screens */}
      <input
        type="text"
        placeholder="Search..."
        className="hidden md:block p-2 rounded-lg border border-gray-300"
      />
      
      {/* Sidebar Toggle Button for mobile */}
      <button
        onClick={toggleSidebar}
        className="text-white md:hidden"
      >
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
