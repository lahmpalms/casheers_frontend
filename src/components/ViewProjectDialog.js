"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
  Grid,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useRef, useState, useEffect } from 'react';
import { formatDate, formatISOToThailandTime, toThailandTime } from '../utils/dateUtils';
import api from '../lib/api';

export default function ViewProjectDialog({ open, onClose, project, loading }) {
  if (!open) return null;

  const editorRef = useRef(null);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  const [isSettingDraft, setIsSettingDraft] = useState(false);
  
  // Format the created_at date when the project changes
  useEffect(() => {
    if (project?.created_at) {
      // Format the date directly using our utility function
      const formattedDate = formatDate(project.created_at);
      setFormattedCreatedAt(formattedDate);
      
      // Log the raw and formatted dates for debugging
      console.log('Raw created_at:', project.created_at);
      console.log('Formatted Thailand time:', formattedDate);
      
      // Also log the raw date object for comparison
      const rawDate = new Date(project.created_at);
      console.log('Raw Date object:', rawDate.toString());
      console.log('Raw Date ISO:', rawDate.toISOString());
      
      // Log the Thailand time date object
      const thailandDate = toThailandTime(project.created_at);
      console.log('Thailand Date object:', thailandDate?.toString());
      console.log('Thailand Date ISO:', thailandDate?.toISOString());
    }
  }, [project]);
  
  // Number of recipients to show initially
  const INITIAL_RECIPIENTS_DISPLAY = 5;

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': { bg: '#FFF4E5', color: '#B76E00', dotColor: '#F59E0B' },
      'sent': { bg: '#E8F5E9', color: '#1B5E20', dotColor: '#22C55E' },
      'success': { bg: '#E8F5E9', color: '#1B5E20', dotColor: '#22C55E' },
      'failed': { bg: '#FEEBEE', color: '#B71C1C', dotColor: '#EF4444' },
      'in_progress': { bg: '#E3F2FD', color: '#0D47A1', dotColor: '#3B82F6' }
    };
    return statusColors[status?.toLowerCase()] || statusColors.pending;
  };

  // Format status text for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    // Replace underscores with spaces and capitalize first letter of each word
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get recipients count
  const recipientsCount = project?.recipients?.length || 0;
  
  // Get recipients to display based on showAllRecipients state
  const displayedRecipients = showAllRecipients 
    ? project?.recipients 
    : project?.recipients?.slice(0, INITIAL_RECIPIENTS_DISPLAY);

  // Check if we need to show "See More" button
  const hasMoreRecipients = project?.recipients?.length > INITIAL_RECIPIENTS_DISPLAY;

  // Function to handle setting project to draft status
  const handleSetToDraft = async () => {
    if (!project?.id) return;
    
    setIsSettingDraft(true);
    try {
      await api.post(`/project/${project.id}/set-draft`, {}, {
        headers: {
          accept: "application/json",
        },
      });
      
      // Close dialog and refresh data
      onClose(true); // Pass true to indicate successful update that requires refresh
    } catch (error) {
      console.error("Error setting project to draft:", error);
    } finally {
      setIsSettingDraft(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth 
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
        <Typography variant="h6" component="div">
          Project Details
        </Typography>
        <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 1 }}>
          {project && project.status !== 'draft' && (
            <Tooltip title="Set to Draft">
              <IconButton
                size="small"
                onClick={handleSetToDraft}
                disabled={isSettingDraft}
                sx={{ 
                  color: '#4B5563',
                  '&:hover': { backgroundColor: 'rgba(75, 85, 99, 0.04)' }
                }}
              >
                {isSettingDraft ? <CircularProgress size={20} sx={{ color: '#4B5563' }} /> : <DraftsIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading || !project ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: "#ED6D23" }} />
          </Box>
        ) : (
          <Box sx={{ p: 1 }}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#ED6D23', fontWeight: 500 }}>
                {project.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={project.status?.replace('_', ' ')}
                  sx={{
                    backgroundColor: getStatusColor(project.status).bg,
                    color: getStatusColor(project.status).color,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                />
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  {formattedCreatedAt}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Project Info Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Project Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Subject
                      </Typography>
                      <Typography variant="body1">
                        {project.subject || 'No subject'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Message
                      </Typography>
                      <Typography variant="body1">
                        {project.message || 'No message'}
                      </Typography>
                    </Box>
                    {project.googleSheetLink && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Google Sheet Link
                        </Typography>
                        <Typography variant="body1">
                          <a href={project.googleSheetLink} target="_blank" rel="noopener noreferrer" 
                             style={{ color: '#ED6D23', textDecoration: 'underline' }}>
                            View Google Sheet
                          </a>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Creator Info Section */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Created By
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#ED6D23',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="body1">
                        {project.created_by?.email || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Creator
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Recipients Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Recipients ({recipientsCount})
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Email Address</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedRecipients?.length > 0 ? (
                          displayedRecipients.map((recipient, index) => {
                            const statusColor = getStatusColor(recipient.status);
                            const statusText = formatStatus(recipient.status);
                            return (
                              <TableRow key={index}>
                                <TableCell>{recipient.email}</TableCell>
                                <TableCell>
                                  {recipient.status === "success" || recipient.status === "completed" || recipient.status === "sent" ? (
                                    <Typography variant="body2" color="success.main">
                                      Sent {recipient.sent_at ? formatDate(recipient.sent_at) : ""}
                                    </Typography>
                                  ) : recipient.status === "failed" ? (
                                    <Tooltip title={recipient.error_message || "Failed to send"}>
                                      <Typography variant="body2" color="error.main">
                                        Failed
                                      </Typography>
                                    </Tooltip>
                                  ) : recipient.status === "in_progress" ? (
                                    <Typography variant="body2" color="primary.main">
                                      In Progress
                                    </Typography>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      Pending
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No recipients
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {hasMoreRecipients && (
                    <Button 
                      onClick={() => setShowAllRecipients(!showAllRecipients)}
                      sx={{ 
                        mt: 2,
                        color: '#ED6D23',
                        '&:hover': {
                          backgroundColor: 'rgba(237, 109, 35, 0.04)'
                        }
                      }}
                    >
                      {showAllRecipients ? 'Show Less' : `See All (${recipientsCount})`}
                    </Button>
                  )}
                </Paper>
              </Grid>

              {/* Template Preview Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Email Template Preview
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: 1,
                    }}
                  >
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      value={project.htmlTemplate || project.template}
                      init={{
                        height: 400,
                        width: "100%",
                        menubar: false,
                        toolbar: false,
                        statusbar: false,
                        readonly: true,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        // Email-friendly content styles
                        content_style: `
                          body { 
                            font-family: Arial, Helvetica, sans-serif; 
                            font-size: 14px;
                            line-height: 1.5;
                            margin: 0;
                            padding: 16px;
                          }
                          div { margin: 0 0 1em 0; }
                          table { border-collapse: collapse; }
                          table td, table th { border: 1px solid #ddd; padding: 8px; }
                          img { max-width: 100%; height: auto; }
                          .mce-content-body [data-mce-selected=inline-boundary] { background-color: transparent; }
                        `,
                        // Email-specific settings
                        forced_root_block: "div",
                        remove_trailing_brs: false,
                        paste_as_text: false,
                        branding: false,
                        resize: false,
                        convert_urls: false,
                        valid_elements: '*[*]', // Allow all elements and attributes
                        extended_valid_elements: 'style,link[href|rel],div[*],span[*],br[*]',
                        entity_encoding: 'raw',
                        // Ensure newlines are preserved
                        newline_behavior: "block",
                      }}
                      disabled={true}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#ED6D23',
            borderColor: '#ED6D23',
            '&:hover': {
              borderColor: '#d65a1c',
              backgroundColor: 'rgba(237, 109, 35, 0.04)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 