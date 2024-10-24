import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );
      const token = response.data.token;
  
      // Store token in local storage
      localStorage.setItem("token", token);
  
      // Dispatch login action with user data
      dispatch(login({ user: values.email, token }));
  
      // Show success toast
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      // Show error toast
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };  

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-3xl text-center font-semibold mb-6">Login</h2>
          <div className="mb-4">
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
            {/* Password visibility toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold p-2 rounded-md w-full hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <p className="mt-4 text-center">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;