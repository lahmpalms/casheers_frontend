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
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useRef } from 'react';

export default function ViewProjectDialog({ open, onClose, project, loading }) {
  if (!open) return null;

  const editorRef = useRef(null);

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
      'pending': { bg: '#FFF4E5', color: '#B76E00' },
      'completed': { bg: '#E8F5E9', color: '#1B5E20' },
      'failed': { bg: '#FEEBEE', color: '#B71C1C' },
      'in_progress': { bg: '#E3F2FD', color: '#0D47A1' }
    };
    return statusColors[status?.toLowerCase()] || statusColors.pending;
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
                      Recipients
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.emails?.map((email, index) => (
                      <Chip
                        key={index}
                        label={email}
                        sx={{
                          backgroundColor: 'rgba(237, 109, 35, 0.08)',
                          color: '#ED6D23',
                          '& .MuiChip-label': {
                            fontSize: '0.875rem',
                          }
                        }}
                      />
                    )) || 'No recipients'}
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
                        content_style: `
                          body { 
                            font-family: Helvetica, Arial, sans-serif; 
                            font-size: 14px;
                            margin: 0;
                            padding: 16px;
                          }
                          img {
                            max-width: 100%;
                            height: auto;
                          }
                        `,
                        forced_root_block: "p",
                        paste_as_text: false,
                        branding: false,
                        resize: false,
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