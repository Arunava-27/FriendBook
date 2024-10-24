import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-blue-600">404</h1>

        {/* Error Message */}
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Button to Navigate Home */}
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-all duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
