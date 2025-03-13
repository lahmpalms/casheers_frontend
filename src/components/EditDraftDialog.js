"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  DialogContentText,
} from "@mui/material";
import api from "../lib/api";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

export default function EditDraftDialog({ open, onClose, projectId }) {
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  // Send confirmation dialog
  const [openSendConfirm, setOpenSendConfirm] = useState(false);
  
  // Project data state
  const [projectData, setProjectData] = useState({
    name: "",
    subject: "",
    htmlTemplate: "",
    recipients: [],
  });

  // New email state
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Fetch project data when dialog opens
  useEffect(() => {
    if (open && projectId) {
      fetchProjectData();
    }
  }, [open, projectId]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/project/${projectId}`, {
        headers: { accept: "application/json" },
      });
      
      const project = response.data;
      setProjectData({
        name: project.name || "",
        subject: project.subject || "",
        htmlTemplate: project.htmlTemplate || project.template || "",
        recipients: project.recipients || [],
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to load project data",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (!isSubmitting && !isSending) {
      onClose();
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setProjectData((prev) => ({ ...prev, htmlTemplate: content }));
  };

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle adding a new email
  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      setEmailError("Email cannot be empty");
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Check if email already exists in recipients
    if (projectData.recipients.some(recipient => recipient.email === newEmail)) {
      setEmailError("This email already exists in the list");
      return;
    }

    // Add new recipient with default values
    setProjectData(prev => ({
      ...prev,
      recipients: [
        ...prev.recipients, 
        {
          email: newEmail,
          status: "pending",
          error_message: null,
          sent_at: null
        }
      ]
    }));
    setNewEmail("");
    setEmailError("");
  };

  // Handle removing an email
  const handleRemoveEmail = (emailToRemove) => {
    setProjectData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(recipient => recipient.email !== emailToRemove)
    }));
  };

  // Handle email input change
  const handleEmailInputChange = (e) => {
    setNewEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const validateForm = () => {
    if (!projectData.name.trim()) {
      setNotification({
        open: true,
        message: "Project name is required",
        severity: "error",
      });
      return false;
    }
    
    if (!projectData.subject.trim()) {
      setNotification({
        open: true,
        message: "Subject is required",
        severity: "error",
      });
      return false;
    }
    
    if (!projectData.htmlTemplate.trim()) {
      setNotification({
        open: true,
        message: "Email template is required",
        severity: "error",
      });
      return false;
    }
    
    if (projectData.recipients.length === 0) {
      setNotification({
        open: true,
        message: "At least one recipient is required",
        severity: "error",
      });
      return false;
    }
    
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Show updating draft notification
      setNotification({
        open: true,
        message: "Updating draft project...",
        severity: "info",
      });

      // API call to update project
      await api.patch(`/project/${projectId}`, {
        name: projectData.name,
        subject: projectData.subject,
        htmlTemplate: projectData.htmlTemplate,
        recipients: projectData.recipients,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Show success notification
      setNotification({
        open: true,
        message: "Draft project updated successfully!",
        severity: "success",
      });
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose(true); // Pass true to indicate successful update
      }, 1500);
      
    } catch (error) {
      console.error("Error updating draft:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update draft project",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      handleEditorChange(content);
      handleSaveDraft();
    } else {
      handleSaveDraft();
    }
  };

  const handleSendClick = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      handleEditorChange(content);
    }
    
    if (!validateForm()) return;
    
    setOpenSendConfirm(true);
  };

  const handleSendEmails = async () => {
    // First save the draft to ensure all changes are saved
    setIsSending(true);
    try {
      // Show saving notification
      setNotification({
        open: true,
        message: "Saving draft before sending...",
        severity: "info",
      });

      // Save draft first
      await api.patch(`/project/${projectId}`, {
        name: projectData.name,
        subject: projectData.subject,
        htmlTemplate: projectData.htmlTemplate,
        recipients: projectData.recipients,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Show sending notification
      setNotification({
        open: true,
        message: "Sending emails...",
        severity: "info",
      });

      // Send emails
      const response = await api.post(`/project/${projectId}/send`, {}, {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      });

      // Show success notification
      setNotification({
        open: true,
        message: response.data.message || "Emails sent successfully!",
        severity: "success",
      });
      
      // Close dialogs after a short delay
      setTimeout(() => {
        setOpenSendConfirm(false);
        onClose(true); // Pass true to indicate successful update
      }, 1500);
      
    } catch (error) {
      console.error("Error sending emails:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to send emails",
        severity: "error",
      });
      setOpenSendConfirm(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleDialogClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          Edit Draft Project
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress sx={{ color: "#ED6D23" }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Project Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      name="name"
                      value={projectData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={projectData.subject}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Email Recipients
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Email Address"
                    value={newEmail}
                    onChange={handleEmailInputChange}
                    error={!!emailError}
                    helperText={emailError}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEmail}
                    sx={{
                      backgroundColor: "#ED6D23",
                      '&:hover': {
                        backgroundColor: "#d65a1c",
                      },
                      height: '56px',
                    }}
                  >
                    Add
                  </Button>
                </Box>
                
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email Address</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell align="right" sx={{ width: '80px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectData.recipients.length > 0 ? (
                        projectData.recipients.map((recipient, index) => (
                          <TableRow key={index}>
                            <TableCell>{recipient.email}</TableCell>
                            <TableCell>
                              {recipient.status === "sent" ? (
                                <Typography variant="body2" color="success.main">
                                  Sent {recipient.sent_at ? new Date(recipient.sent_at).toLocaleString() : ""}
                                </Typography>
                              ) : recipient.status === "failed" ? (
                                <Tooltip title={recipient.error_message || "Failed to send"}>
                                  <Typography variant="body2" color="error.main">
                                    Failed
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Pending
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Remove Email">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleRemoveEmail(recipient.email)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No email addresses added yet
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              
              <Paper sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Email Template
                </Typography>
                <Box sx={{ mt: 2, height: '400px' }}>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={projectData.htmlTemplate}
                    init={{
                      height: "100%",
                      menubar: true,
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
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
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
                      paste_block_drop: false,
                      paste_data_images: true,
                      paste_merge_formats: true,
                      paste_webkit_styles: "all",
                      paste_retain_style_properties: "all",
                      convert_urls: false,
                      valid_elements: '*[*]', // Allow all elements and attributes
                      extended_valid_elements: 'style,link[href|rel],div[*],span[*],br[*]',
                      entity_encoding: 'raw',
                      // Ensure newlines are preserved
                      newline_behavior: "block",
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            disabled={isSubmitting || isSending}
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(0, 0, 0, 0.23)',
              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSendClick}
              variant="contained"
              disabled={isSubmitting || isSending}
              startIcon={<SendIcon />}
              sx={{
                backgroundColor: "#4CAF50",
                '&:hover': {
                  backgroundColor: "#388E3C",
                }
              }}
            >
              Send Emails
            </Button>
            <Button
              onClick={handleSaveClick}
              variant="contained"
              disabled={isSubmitting || isSending}
              sx={{
                backgroundColor: "#ED6D23",
                '&:hover': {
                  backgroundColor: "#d65a1c",
                }
              }}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? "Saving..." : "Save Draft"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      
      {/* Send Confirmation Dialog */}
      <Dialog
        open={openSendConfirm}
        onClose={() => !isSending && setOpenSendConfirm(false)}
        aria-labelledby="send-dialog-title"
        aria-describedby="send-dialog-description"
      >
        <DialogTitle id="send-dialog-title">
          Send Emails
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="send-dialog-description">
            Are you sure you want to send emails to {projectData.recipients.length} recipient{projectData.recipients.length !== 1 ? 's' : ''}? 
            This action will save your draft and send the emails immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenSendConfirm(false)} 
            disabled={isSending}
            sx={{ color: 'rgba(0, 0, 0, 0.67)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmails} 
            color="primary" 
            variant="contained"
            disabled={isSending}
            startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{
              backgroundColor: "#4CAF50",
              '&:hover': {
                backgroundColor: "#388E3C",
              }
            }}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
} 