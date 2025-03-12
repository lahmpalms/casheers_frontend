import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { authAPI } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Check for saved email if remember me was checked
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const data = await authAPI.login(formData.email, formData.password);

      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Save tokens and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      router.push("/projects");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-300 dark:to-gray-800 p-4"
    >
      <Box className="bg-white dark:bg-gray-500 p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <Image
            src="/CASHEERS - LOGO -01.png"
            alt="CASHEERS Logo"
            width={isMobile ? 200 : 250}
            height={isMobile ? 67 : 83}
            className="mb-6"
          />
          <Typography
            variant="h5"
            className="text-gray-800 dark:text-white font-semibold mb-2"
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-600 dark:text-gray-300"
          >
            Please sign in to continue
          </Typography>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="text-gray-400 dark:text-gray-300" />
                </InputAdornment>
              ),
            }}
            className="bg-gray-50 dark:bg-gray-500 rounded-lg"
          />

          <TextField
            name="password"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="bg-gray-50 dark:bg-gray-500 rounded-lg"
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
              >
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="h-12"
            sx={{
              background: "linear-gradient(45deg, #ED6D23 30%, #e6a323 90%)",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                background: "linear-gradient(45deg, #e6a323 30%, #ED6D23 90%)",
              },
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Typography
              variant="body2"
              className="text-gray-600 dark:text-gray-400 text-center col-span-2"
            >
              Don&apos;t have an account?{" "}
              <span
                onClick={() => {
                  setShowGif(!showGif);
                  setTimeout(() => {
                    setShowGif(false);
                  }, 5000);
                }}
                className="text-[#ED6D23] hover:text-[#e6a323] cursor-pointer"
              >
                Pray to developer
              </span>
              {showGif && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  <iframe
                    src="https://giphy.com/embed/jLUtZxEUjQa3e"
                    width="480"
                    height="360"
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
                  />
                </div>
              )}
            </Typography>
          </div>
        </form>
      </Box>
      <ToastContainer position="bottom-right" />
    </motion.div>
  );
}
