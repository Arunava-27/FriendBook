import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => setEditing(!editing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/update", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile updated successfully!");
      setEditing(false);
      toast.success("Details Updated")
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error happened")
    }
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      console.error("New passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/update-password",
        passwords,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password Updated")
    } catch (error) {
      console.error("Error updating password", error);
      toast.error("Couldn't update password")
    }
  };

  const handleCancelEdit = () => {
    setProfileData(user); // Reset to original data
    setEditing(false); // Exit editing mode
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-semibold text-center mb-4 text-blue-700">
        {user.fullName}&apos;s Profile
      </h1>
      <div className="flex justify-center mb-4">
        {user.profilePicture ? (
          <img
            src={`http://localhost:5000/${user.profilePicture}`}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
            No Image
          </div>
        )}
      </div>
      <p className="text-gray-700 text-lg mb-2 text-center">
        Email: {user.email}
      </p>
      <p className="text-gray-700 text-lg mb-2 text-center">
        Location: {user.city}, {user.state}, {user.country}
      </p>
      <p className="text-gray-500 text-md text-center mb-6">
        Joined: {new Date(user.createdAt).toLocaleDateString()}
      </p>

      {editing ? (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            name="fullName"
            value={profileData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="Full Name"
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="Email"
          />
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={profileData.state}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="State"
          />
          <input
            type="text"
            name="country"
            value={profileData.country}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300"
            placeholder="Country"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={updateProfile}
              className="w-1/2 bg-green-500 text-white py-2 rounded-lg"
            >
              Save Profile
            </button>
            <button
              onClick={handleCancelEdit}
              className="w-1/2 bg-gray-400 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <div className="password-update mt-6">
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded-lg border border-gray-300"
              placeholder="Current Password"
            />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded-lg border border-gray-300 mt-2"
              placeholder="New Password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded-lg border border-gray-300 mt-2"
              placeholder="Confirm New Password"
            />
            <button
              onClick={updatePassword}
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
            >
              Update Password
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleEditToggle}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-4"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Profile;
