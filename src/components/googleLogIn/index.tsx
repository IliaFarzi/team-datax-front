import { signIn } from "next-auth/react";

const LoginButton = () => {
  const handleSignIn = async () => {
    console.log("Attempting to sign in with Google...");
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      ورود با گوگل
    </button>
  );
};

export default LoginButton;