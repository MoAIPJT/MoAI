import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

/**
 * A component to handle the redirect from Google's OAuth 2.0 flow.
 * It extracts the authorization code, sends it to the backend to exchange for tokens,
 * and then navigates the user to the dashboard.
 */
const GoogleCallback = () => {
  const navigate = useNavigate();
  // useSearchParams is the recommended hook from react-router-dom to read the URL's query string.
  const [searchParams] = useSearchParams();

  // useRef to ensure the API call is made only once, even if the component re-renders.
  const hasFetched = useRef(false);

  useEffect(() => {
    // We check if the fetch has already been attempted to prevent multiple API calls.
    if (hasFetched.current) {
      return;
    }

    // Extract the 'code' from the URL search parameters.
    const code = searchParams.get('code');

    const fetchGoogleToken = async () => {
      // If there's no code, we can't proceed. Navigate to an error/login page or log the error.
      if (!code) {
        console.error('Authorization code not found.');
        navigate('/login?error=google_auth_failed'); // Redirect to login with an error message
        return;
      }

      try {
        // Mark that we are attempting to fetch the token.
        hasFetched.current = true;

        // Make the POST request to your backend with the authorization code.
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, { code });

        // Destructure the tokens from the response data.
        const { accessToken, refreshToken } = res.data;

        // Store the tokens securely. localStorage is convenient but be aware of security implications (XSS).
        // For higher security, consider using httpOnly cookies set by the server.
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // On successful authentication, navigate the user to their dashboard.
        navigate('/dashboard');

      } catch (err) {
        console.error('Google login failed:', err);
        // If the API call fails, redirect the user back to the login page with an error indicator.
        navigate('/login?error=token_exchange_failed');
      }
    };

    fetchGoogleToken();

    // The effect depends on 'navigate' and 'searchParams' to function correctly.
    // We include them in the dependency array as per the rules of hooks.
  }, [navigate, searchParams]);

  // Render a user-friendly message while the authentication process is happening.
  return <p>Processing Google login, please wait...</p>;
};

export default GoogleCallback;
