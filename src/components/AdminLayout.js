// components/AdminLayout.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import api from "../lib/api";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 280;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout endpoint using api service
      await api.post("/auth/logout");

      // Clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      // Redirect to login page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the logout request fails, we should still clear local storage and redirect
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check for access token and user data
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userDataStr = localStorage.getItem("user");
    
    if (!token) {
      router.push("/");
    } else if (userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
      }
    }
  }, [router]);

  // Get user initials for avatar
  const getInitials = (email) => {
    if (!email) return "U";
    return email.split("@")[0].charAt(0).toUpperCase();
  };

  // Drawer content (sidebar navigation)
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Image
          src="/CASHEERS - LOGO -01.png"
          alt="CASHEERS Logo"
          width={180}
          height={100}
          style={{ objectFit: 'contain' }}
        />
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ 
            display: { sm: 'none' },
            color: '#ED6D23',
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {/* User Profile Section */}
      <Box sx={{ 
        px: 3, 
        py: 2, 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: alpha('#ED6D23', 0.1),
        borderRadius: 2,
        mx: 2
      }}>
        <Tooltip title={userData?.email || ''} arrow placement="right">
          <Avatar sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: '#ED6D23',
            mr: 2,
            cursor: 'pointer'
          }}>
            {userData ? getInitials(userData.email) : <AccountCircleIcon />}
          </Avatar>
        </Tooltip>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {userData?.email?.split('@')[0] || 'User'}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {userData?.role || 'Loading...'}
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        <ListItem
          button
          key="Projects"
          onClick={() => router.push("/projects")}
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: alpha('#ED6D23', 0.1),
            },
            ...(router.pathname === '/projects' && {
              backgroundColor: alpha('#ED6D23', 0.1),
              '& .MuiListItemIcon-root': {
                color: '#ED6D23',
              },
              '& .MuiListItemText-primary': {
                color: '#ED6D23',
                fontWeight: 600,
              },
            }),
          }}
        >
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          disabled={isLoggingOut}
          sx={{
            backgroundColor: '#ED6D23',
            color: 'white',
            py: 1,
            '&:hover': {
              backgroundColor: alpha('#ED6D23', 0.9),
            },
          }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Mobile Menu Button - Only visible on small screens */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200,
          display: { sm: 'none' },
          bgcolor: 'white',
          boxShadow: 1,
          color: '#ED6D23',
          '&:hover': {
            bgcolor: alpha('#ED6D23', 0.1),
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: 'white',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: 'white',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
