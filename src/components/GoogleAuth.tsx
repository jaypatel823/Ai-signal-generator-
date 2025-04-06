import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// Import the hook from its own file
import { useAuth } from "./useAuth";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface GoogleAuthProps {
  onSuccess?: () => void;
}

function GoogleAuthComponent({ onSuccess }: GoogleAuthProps) {
  const { login } = useAuth();

  return (
    <GoogleOAuthProvider clientId="1072944905753-vm5hf7jh2evmhf9nsj8a4dgqkdqcf8oi.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Sign in to continue</h2>
        <p className="text-gray-600 mb-6">
          Please sign in with your Google account to access the trading signals.
        </p>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded: GoogleUser = jwtDecode(
                credentialResponse.credential,
              );
              login(decoded);
              if (onSuccess) onSuccess();
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">AI Signal Generator</h1>
          <p className="text-gray-600 mt-2">
            High accuracy trading signals powered by AI
          </p>
        </div>
        <GoogleAuthComponent />
      </div>
    </div>
  );
}

// Export components
export { GoogleAuthComponent, LoginPage };
