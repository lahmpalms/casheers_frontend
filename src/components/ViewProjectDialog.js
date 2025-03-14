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
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useRef, useState } from 'react';

export default function ViewProjectDialog({ open, onClose, project, loading }) {
  if (!open) return null;

  const editorRef = useRef(null);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  
  // Number of recipients to show initially
  const INITIAL_RECIPIENTS_DISPLAY = 5;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': { bg: '#FFF4E5', color: '#B76E00', dotColor: '#F59E0B' },
      'completed': { bg: '#E8F5E9', color: '#1B5E20', dotColor: '#22C55E' },
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
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
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
                  {formatDate(project.created_at)}
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {displayedRecipients?.map((recipient, index) => {
                        const statusColor = getStatusColor(recipient.status);
                        const statusText = formatStatus(recipient.status);
                        return (
                          <Chip
                            key={index}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  component="span"
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: statusColor.dotColor,
                                    display: 'inline-block',
                                    boxShadow: `0 0 0 1px ${statusColor.color}`
                                  }}
                                />
                                <span>{recipient.email}</span>
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: '0.7rem',
                                    padding: '0 4px',
                                    borderRadius: '4px',
                                    backgroundColor: statusColor.dotColor,
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    ml: 0.5
                                  }}
                                >
                                  {statusText}
                                </Box>
                              </Box>
                            }
                            title={`Email: ${recipient.email}, Status: ${statusText}`}
                            sx={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              border: `1px solid ${statusColor.color}40`,
                              '& .MuiChip-label': {
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px 8px'
                              }
                            }}
                          />
                        );
                      }) || 'No recipients'}
                    </Box>
                    
                    {hasMoreRecipients && (
                      <Button 
                        onClick={() => setShowAllRecipients(!showAllRecipients)}
                        sx={{ 
                          alignSelf: 'flex-start',
                          color: '#ED6D23',
                          '&:hover': {
                            backgroundColor: 'rgba(237, 109, 35, 0.04)'
                          }
                        }}
                      >
                        {showAllRecipients ? 'Show Less' : `See All (${recipientsCount})`}
                      </Button>
                    )}
                  </Box>
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