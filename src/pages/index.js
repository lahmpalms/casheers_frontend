import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { authAPI } from "../utils/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      console.log("Login successful:", data);
      // Save tokens and user data in localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirect to the projects page
      router.push("/projects");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/CASHEERS - LOGO -01.png"
            alt="CASHEERS Logo"
            width={300}
            height={100}
          />
        </div>
        <form onSubmit={handleSubmit} className="py-6">
          <div className="py-4">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ className: "text-gray-600" }}
              className="bg-white rounded-md"
            />
          </div>
          <div className="py-4">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ className: "text-gray-600" }}
              className="bg-white rounded-md"
            />
          </div>
          {error && (
            <Typography color="error" variant="body2" className="mb-4">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: "#ED6D23",
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e6a323" },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </div>
  );
}
