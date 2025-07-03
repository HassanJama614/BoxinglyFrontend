// staff-dashboard/src/services/adminApi.js
import axios from 'axios';

// Get the API URL from environment variables.
// In local development, this will come from a .env file (e.g., REACT_APP_ADMIN_API_URL=http://localhost:5001/api).
// In Vercel deployment, this will come from the Environment Variables you set in the Vercel project settings.
const baseURL = process.env.REACT_APP_ADMIN_API_URL;

// Add a check to ensure the environment variable is set. This helps catch configuration errors early.
if (!baseURL) {
    console.error(
        "CRITICAL ERROR: REACT_APP_ADMIN_API_URL is not defined." +
        " For local development, create a .env.development file in your staff-dashboard root and set the variable." +
        " For Vercel deployment, set it in your project's Environment Variables settings."
    );
}

const adminApi = axios.create({
    baseURL: baseURL, // Use the dynamic baseURL from the environment variable
});

// This interceptor correctly adds the admin authentication token to every request.
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminAuthToken'); // Using 'adminAuthToken' for the staff dashboard
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // This part handles errors that occur before the request is even sent.
        return Promise.reject(error);
    }
);

// Optional but recommended: Add a response interceptor to handle global errors like 401 Unauthorized
adminApi.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401) {
            // If API returns 401, the token is bad. Log the user out automatically.
            console.error("API request unauthorized (401). Token might be invalid or expired. Logging out.");
            localStorage.removeItem('adminAuthToken'); // Clear the bad token
            // Force a reload to the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default adminApi;