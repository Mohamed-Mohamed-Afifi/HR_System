import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { 
  HiHomeModern, 
  HiBuildingOffice, 
  HiUserGroup,
  HiChartPie,
  HiHeart,
  HiChatBubbleLeftRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import theme from "./theme";
import "./side.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");
  const iconSize = 22;

  const menuItems = [
    { text: "Dashboard", icon: <HiHomeModern size={iconSize} />, path: "/" },
    { text: "Departments", icon: <HiBuildingOffice size={iconSize} />, path: "/departments" },
    { text: "Employees", icon: <HiUserGroup size={iconSize} />, path: "/employees" },
    { text: "Projects", icon: <HiChartPie size={iconSize} />, path: "/projects" },
    { text: "Dependents", icon: <HiHeart size={iconSize} />, path: "/dependents" },
  ];

  return (
    <Drawer
    variant="permanent"
    sx={{
      width: isOpen ? 280 : 80,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        position: 'relative',
        width: isOpen ? 280 : 80,
        height: '100%',
        background: `
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(245, 247, 250, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(136, 152, 170, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.11)',
      },
    }}
  >
      {/* Header Section */}
      <Box sx={{ 
        p: 3, 
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 24,
          right: 24,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <Typography variant="h6" sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  color: 'var(--text-dark)',
                  background: 'linear-gradient(135deg, #3aed96 0%, #2571a7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  HR System
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              background: 'rgba(58, 237, 150, 0.1)',
              '&:hover': { background: 'rgba(58, 237, 150, 0.2)' }
            }}
          >
            {isOpen ? (
              <HiChevronDoubleLeft className="text-[var(--accent-color)]" />
            ) : (
              <HiChevronDoubleRight className="text-[var(--accent-color)]" />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 2, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: '12px',
              mb: 1,
              px: 2,
              transition: 'all 0.3s ease',
              '&.active': {
                background: 'rgba(58, 237, 150, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(58, 237, 150, 0.1)',
                '& .MuiListItemIcon-root': {
                  color: 'var(--accent-color)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent-color)',
                  boxShadow: '0 0 12px var(--accent-color)'
                }
              },
              '&:hover': {
                transform: 'translateX(8px)',
                '& .MuiListItemIcon-root': {
                  transform: 'scale(1.1)'
                }
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'var(--text-secondary)',
              transition: 'all 0.3s ease' 
            }}>
              {item.icon}
            </ListItemIcon>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        color: 'var(--text-dark)',
                        fontSize: '0.95rem',
                        letterSpacing: '-0.2px'
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </ListItem>
        ))}
      </List>

      {/* Chat Section */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 24, 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)'
      }}>
        <motion.div whileHover={{ scale: 1.02 }}>
          <IconButton
            sx={{
              width: '100%',
              borderRadius: '14px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              py: 1.5,
              boxShadow: '0 4px 6px -1px rgba(58, 237, 150, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 12px -2px rgba(58, 237, 150, 0.25)'
              }
            }}
          >
            <HiChatBubbleLeftRight size={20} />
            {isOpen && (
              <Typography sx={{ 
                ml: 1.5, 
                color:'#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '-0.2px'
              }}>
                Support Hub
              </Typography>
            )}
          </IconButton>
        </motion.div>
      </Box>
    </Drawer>
  );
};

export default Sidebar;