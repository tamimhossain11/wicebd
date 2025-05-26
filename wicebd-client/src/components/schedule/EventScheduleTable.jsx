import React from "react";
import { motion } from "framer-motion";
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Chip,
  useTheme
} from "@mui/material";
import { 
  Schedule as ScheduleIcon, 
  Event as EventIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  EmojiEvents as AwardsIcon,
  Groups as GroupsIcon
} from "@mui/icons-material";

const EventScheduleTable = () => {
  const theme = useTheme();
  
  const scheduleData = [
    { 
      program: "Reporting Time and Setup (Project and Wall Magazine)", 
      time: "08:30 AM - 10:00 AM",
      icon: <ScienceIcon fontSize="small" />
    },
    { 
      program: "Opening Ceremony", 
      time: "10:00 AM - 11:00 AM",
      icon: <SchoolIcon fontSize="small" />
    },
    { 
      program: "Project and Wall Magazine Showcasing", 
      time: "11:30 AM - 01:30 PM",
      icon: <ScienceIcon fontSize="small" />
    },
    { 
      program: "Science & Technology Olympiad", 
      time: "12:00 PM - 12:30 PM",
      icon: <SchoolIcon fontSize="small" />
    },
    { 
      program: "Lunch Break", 
      time: "01:00 PM - 02:00 PM",
      icon: <RestaurantIcon fontSize="small" />
    },
    { 
      program: "Judgement Session", 
      time: "02:00 PM - 04:30 PM",
      icon: <AwardsIcon fontSize="small" />
    },
    { 
      program: "Closing Ceremony", 
      time: "04:45 PM - 05:45 PM",
      icon: <SchoolIcon fontSize="small" />
    },
    { 
      program: "Cultural Program", 
      time: "05:45 PM - 06:30 PM",
      icon: <GroupsIcon fontSize="small" />
    },
    { 
      program: "Namaz", 
      time: "06:40 PM - 07:00 PM",
      icon: <GroupsIcon fontSize="small" />
    },
    { 
      program: "Get Together Session", 
      time: "07:00 PM - 08:00 PM",
      icon: <GroupsIcon fontSize="small" />
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const getTimeColor = (time) => {
    if (time.includes("AM")) return "rgba(255, 255, 255, 0.2)";
    if (time.includes("PM")) return "rgba(255, 255, 255, 0.3)";
    return "rgba(255, 255, 255, 0.1)";
  };

  return (
    <Box
      sx={{
        maxWidth: '950px',
        mx: 'auto',
        p: 4,
        background: 'linear-gradient(to bottom, #ec407a, #6a0f24)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ 
            textAlign: 'center',
            mb: 4,
            background: 'rgba(255, 255, 255, 0.15)',
            p: 3,
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'white',
                mb: 1,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              gutterBottom
            >
              <ScienceIcon sx={{ 
                fontSize: '2.5rem', 
                verticalAlign: 'middle', 
                mr: 2,
                color: 'white' 
              }} />
              7th World Invention Competition
              <br />
              and Exhibition 2025
            </Typography>
            <Chip 
              label="Bangladesh National Round" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.25)', 
                color: 'white',
                fontWeight: 800,
                px: 2,
                py: 1,
                backdropFilter: 'blur(10px)'
              }} 
            />
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TableContainer 
            component={Paper}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Table>
              <TableHead sx={{ 
                background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.4) 100%)'
              }}>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '1.25rem',
                    width: '70%'
                  }}>
                    <EventIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'white' }} />
                    Program Schedule
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '1.25rem',
                    width: '30%'
                  }}>
                    <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'white' }} />
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={itemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                    sx={{ color: 'white' }}
                  >
                    <TableCell sx={{ 
                      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Box sx={{
                        mr: 2,
                        color: 'white'
                      }}>
                        {item.icon}
                      </Box>
                      {item.program}
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
                      fontWeight: 800,
                      background: getTimeColor(item.time)
                    }}>
                      <Chip 
                        label={item.time} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          color: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(5px)'
                        }} 
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ 
            mt: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderLeft: '4px solid rgba(76, 175, 80, 0.7)',
            backdropFilter: 'blur(5px)'
          }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ScienceIcon sx={{ mr: 1, color: 'rgba(76, 175, 80, 0.7)' }} />
              <strong>Scientific Note:</strong> All participants should adhere to the schedule for optimal event flow. 
              The judging criteria follow international scientific exhibition standards.
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default EventScheduleTable;