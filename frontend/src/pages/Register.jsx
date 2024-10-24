// pages/Register.jsx
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from "react-toastify";
import { useState } from 'react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    profilePicture: Yup.mixed().required('Profile Picture is required'),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const token = response.data.token;
  
      // Store token in local storage
      localStorage.setItem('token', token);
  
      // Dispatch login action with user data
      dispatch(login({ user: values.email, token }));
  
      // Show success toast
      toast.success("Registration successful!");
      navigate('/');
    } catch (error) {
      // Show error toast
      toast.error("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <Formik
        initialValues={{
          fullName: '',
          dateOfBirth: '',
          gender: '',
          country: '',
          state: '',
          city: '',
          email: '',
          password: '',
          confirmPassword: '',
          profilePicture: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-3xl text-center font-semibold mb-6">Register</h2>
            <div className="mb-4">
              <Field
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field type="date" name="dateOfBirth" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field as="select" name="gender" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" label="Select gender" />
                <option value="male" label="Male" />
                <option value="female" label="Female" />
                <option value="other" label="Other" />
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field type="text" name="country" placeholder="Country" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field type="text" name="state" placeholder="State" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field type="text" name="city" placeholder="City" className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue('profilePicture', event.currentTarget.files[0]);
                }}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none"
              />
              <ErrorMessage name="profilePicture" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold p-2 rounded-md w-full hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;