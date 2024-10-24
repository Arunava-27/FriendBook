import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Developer success message
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log("User data fetched successfully:", response.data); // Developer success message
      } catch (error) {
        console.error("Error fetching user data", error); // Developer error message
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="profile-page max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-40"></div>
        <div className="flex justify-center -mt-16">
          {user.profilePicture ? (
            <img
              src={`http://localhost:5000/${user.profilePicture}`}
              alt="Profile"
              className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <p>No Image</p>
            </div>
          )}
        </div>
        <div className="text-center mt-2">
          <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-700">Profile Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Date of Birth:</p>
              <p className="text-md text-gray-800">{new Date(user.dateOfBirth).toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender:</p>
              <p className="text-md text-gray-800">{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location:</p>
              <p className="text-md text-gray-800">
                {user.city.charAt(0).toUpperCase() + user.city.slice(1)}, {user.state.charAt(0).toUpperCase() + user.state.slice(1)}, {user.country.charAt(0).toUpperCase() + user.country.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since:</p>
              <p className="text-md text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
