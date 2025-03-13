"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Box,
  Typography,
  StepConnector,
  styled,
  Paper,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
  IconButton,
  LinearProgress,
  MobileStepper,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../lib/api";
import { Editor } from "@tinymce/tinymce-react";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";

// Custom StepConnector style
const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 10,
  },
  [`& .${StepConnector.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#ED6D23",
    borderRadius: 1,
  },
}));

export default function NewProjectDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [uploadedEmails, setUploadedEmails] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [errors, setErrors] = useState({
    name: "",
    subject: "",
    message: "",
    emails: "",
    template: "",
  });
  const [projectId, setProjectId] = useState(null);
  const [recipientsData, setRecipientsData] = useState(null);
  const [projectProgress, setProjectProgress] = useState(null);

  // Tutorial state variables
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const [projectData, setProjectData] = useState({
    name: "",
    message: "",
    subject: "",
    emails: "",
    googleSheetLink: "",
    template: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors], a {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
</head>

<body style="background-color: #ffffff; margin: 0; padding: 0;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
        <tbody>
            <tr>
                <td>
                    <table align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <img src="https://img2.pic.in.th/pic/Picture155db830009334f28.png" width="600" alt="Header Image">
                                    <img src="https://img5.pic.in.th/file/secure-sv1/Picture1ae93ae40cdd2734e.jpg" width="600" alt="Event Image">
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <p style="font-size: 18px; font-weight: bold;">From CASHEERS For SIAM SONGKRAN MUSIC FESTIVAL 2025</p>
                                    <p style="font-size: 14px;">Thank you for being a part of SIAM Songkran Music Festival 2025! 🎉</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Footer Section -->
    <table style="background-color: #f97316; color: #ffffff; width: 100%; border-collapse: collapse;" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td align="center" style="padding: 1rem 0;">
                    <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">DOWNLOAD CASHEERS APP</h2>
                    <div>
                        <a href="https://apps.apple.com/th/app/casheers/id1620837410" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 2rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/7vq/fe0/51o/New%20Project%20%281%29.png" alt="App Store">
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.casheers.events" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 2rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/wpc/v5t/mtl/New%20Project.png" alt="Google Play">
                        </a>
                    </div>
                    <div>
                        <a href="https://www.facebook.com/Casheers" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/t4s/43l/0vm/Facebook_Icon.png" alt="Facebook">
                        </a>
                        <a href="https://www.instagram.com/casheers_th" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/xp8/0mo/kn8/Instagram_Icon.png" alt="Instagram">
                        </a>
                        <a href="https://x.com/casheers_th" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gom/n3z/x0d/X_Icon.png" alt="Twitter">
                        </a>
                        <a href="https://www.tiktok.com/@casheers" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gs4/yor/wku/Tiktok_Icon.png" alt="TikTok">
                        </a>
                    </div>
                    <p style="font-size: 1rem; font-weight: bold;">
                        หากคุณมีข้อติดต่อสอบถามเพิ่มเติม<br />
                        ติดต่อเรา <a href="https://casheers.com/" style="text-decoration: none; color: inherit;">https://casheers.com/</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`,
  });

  // Steps for the Stepper.
  const steps = useMemo(
    () => ["Project Template", "Email Recipient", "Recipients Status"],
    []
  );

  // Tutorial slides data
  const tutorialSlides = useMemo(
    () => [
      {
        label: "Data requirement",
        imgPath:
          "https://img2.pic.in.th/pic/Screenshot-2568-03-12-at-17.26.38.png",
        description: "The file should have a column with email addresses.",
      },
      {
        label: "Access to Google Sheet requirement",
        imgPath:
          "https://img5.pic.in.th/file/secure-sv1/Screenshot-2568-03-12-at-17.30.42.png",
        description:
          "This step is give access to Google Sheet to this email address `emailservice@casheer-email.iam.gserviceaccount.com`",
      },
      {
        label: "Access to Google Sheet requirement",
        imgPath:
          "https://img2.pic.in.th/pic/Screenshot-2568-03-12-at-17.30.52.png",
        description:
          "This step is give access to Google Sheet to this email address `emailservice@casheer-email.iam.gserviceaccount.com`",
      },
      {
        label: "Access to Google Sheet requirement",
        imgPath:
          "https://img2.pic.in.th/pic/Screenshot-2568-03-12-at-17.31.15.png",
        description:
          "This step is give access to Google Sheet to this email address `emailservice@casheer-email.iam.gserviceaccount.com`",
      },
    ],
    []
  );

  // Tutorial handlers
  const handleTutorialOpen = () => {
    setTutorialOpen(true);
    setActiveSlide(0);
  };

  const handleTutorialClose = () => {
    setTutorialOpen(false);
  };

  const handleNextSlide = () => {
    setActiveSlide((prevActiveSlide) => prevActiveSlide + 1);
  };

  const handleBackSlide = () => {
    setActiveSlide((prevActiveSlide) => prevActiveSlide - 1);
  };

  // Copy to clipboard handler
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      "emailservice@casheer-email.iam.gserviceaccount.com"
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Download example file handler
  const handleDownloadExample = () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1NWphpsRazGMeEQWKN2Ft2sPLJQJfqOtI/edit?usp=sharing&ouid=115139448074908525703&rtpof=true&sd=true",
      "_blank"
    );
  };

  // Reset function to clear all states
  const resetDialog = useCallback(() => {
    setActiveStep(0);
    setIsLoading(false);
    setIsSubmitting(false);
    setEditingRowId(null);
    setEditEmailValue("");
    setUploadedEmails([]);
    setSelectionModel([]);
    setProjectId(null);
    setRecipientsData(null);
    setProjectProgress(null);
    setTutorialOpen(false);
    setActiveSlide(0);
    setCopied(false);
    setProjectData({
      name: "",
      message: "",
      subject: "",
      emails: "",
      googleSheetLink: "",
      template: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors], a {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
</head>

<body style="background-color: #ffffff; margin: 0; padding: 0;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
        <tbody>
            <tr>
                <td>
                    <table align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <img src="https://img2.pic.in.th/pic/Picture155db830009334f28.png" width="600" alt="Header Image">
                                    <img src="https://img5.pic.in.th/file/secure-sv1/Picture1ae93ae40cdd2734e.jpg" width="600" alt="Event Image">
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <p style="font-size: 18px; font-weight: bold;">From CASHEERS For SIAM SONGKRAN MUSIC FESTIVAL 2025</p>
                                    <p style="font-size: 14px;">Thank you for being a part of SIAM Songkran Music Festival 2025! 🎉</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Footer Section -->
    <table style="background-color: #f97316; color: #ffffff; width: 100%; border-collapse: collapse;" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td align="center" style="padding: 1rem 0;">
                    <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">DOWNLOAD CASHEERS APP</h2>
                    <div>
                        <a href="https://apps.apple.com/th/app/casheers/id1620837410" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 2rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/7vq/fe0/51o/New%20Project%20%281%29.png" alt="App Store">
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.casheers.events" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 2rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/wpc/v5t/mtl/New%20Project.png" alt="Google Play">
                        </a>
                    </div>
                    <div>
                        <a href="https://www.facebook.com/Casheers" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/t4s/43l/0vm/Facebook_Icon.png" alt="Facebook">
                        </a>
                        <a href="https://www.instagram.com/casheers_th" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/xp8/0mo/kn8/Instagram_Icon.png" alt="Instagram">
                        </a>
                        <a href="https://x.com/casheers_th" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gom/n3z/x0d/X_Icon.png" alt="Twitter">
                        </a>
                        <a href="https://www.tiktok.com/@casheers" target="_blank" style="text-decoration: none; color: inherit;">
                            <img style="height: 1.5rem; border: none;" src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1mrlgx30/gs4/yor/wku/Tiktok_Icon.png" alt="TikTok">
                        </a>
                    </div>
                    <p style="font-size: 1rem; font-weight: bold;">
                        หากคุณมีข้อติดต่อสอบถามเพิ่มเติม<br />
                        ติดต่อเรา <a href="https://casheers.com/" style="text-decoration: none; color: inherit;">https://casheers.com/</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`,
    });
    setNotification({
      open: false,
      message: "",
      severity: "info",
    });
  }, []);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    resetDialog();
    onClose();
  }, [onClose, resetDialog]);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Function: Fetch emails from Google Sheet using your API.
  const handleFetchFromGoogleSheet = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = new URLSearchParams();
      data.append("sheet_url", projectData.googleSheetLink);
      const response = await api.post(
        "/project/extract-emails-from-google-sheet",
        data.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      setUploadedEmails(response.data.emails);
    } catch (error) {
      console.error("Error fetching emails from Google Sheet", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectData.googleSheetLink]);

  // DataGrid columns definition.
  const emailColumns = useMemo(() => {
    const handleEditClick = (e, params) => {
      e.stopPropagation();
      setEditingRowId(params.row.id);
      setEditEmailValue(params.row.email);
    };

    const renderEmailCell = (params) => {
      const isEditing = editingRowId === params.row.id;
      return isEditing ? (
        <TextField
          size="small"
          value={editEmailValue}
          onChange={(e) => setEditEmailValue(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-input": {
              padding: "8px 12px",
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.87)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.value}
        </Typography>
      );
    };

    const renderActionsCell = (params) => {
      const isEditing = editingRowId === params.row.id;
      return isEditing ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
              color: "white",
              minWidth: "32px",
              padding: "4px 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setUploadedEmails((prev) =>
                prev.map((email, idx) =>
                  idx + 1 === params.row.id ? editEmailValue : email
                )
              );
              setEditingRowId(null);
              setEditEmailValue("");
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#666",
              color: "#666",
              "&:hover": {
                borderColor: "#333",
                color: "#333",
              },
              minWidth: "32px",
              padding: "4px 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setEditingRowId(null);
              setEditEmailValue("");
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: "#ED6D23",
            color: "#ED6D23",
            "&:hover": {
              borderColor: "#d65a1c",
              backgroundColor: "rgba(237, 109, 35, 0.04)",
            },
            minWidth: "32px",
            padding: "4px 12px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(e, params);
          }}
        >
          Edit
        </Button>
      );
    };

    return [
      {
        field: "id",
        headerName: "#",
        width: 70,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            #
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: "Email Address",
        flex: 1,
        minWidth: 250,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Email Address
          </Typography>
        ),
        renderCell: renderEmailCell,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.87)",
            }}
          >
            Actions
          </Typography>
        ),
        renderCell: renderActionsCell,
      },
    ];
  }, [editingRowId, editEmailValue]);

  // Generic field change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle submit validation
  const validateForm = useCallback(() => {
    const newErrors = {
      name: "",
      subject: "",
      message: "",
      emails: "",
      template: "",
    };

    let isValid = true;

    // Validate project name
    if (!projectData.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    }

    // Validate subject
    if (!projectData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    // Validate template
    if (!projectData.template.trim()) {
      newErrors.template = "Email template is empty";
      isValid = false;
    }

    // Validate emails (only on step 1)
    if (
      activeStep === 1 &&
      selectionModel.length === 0 &&
      uploadedEmails.length > 0
    ) {
      newErrors.emails = "Please select at least one email";
      isValid = false;
    }

    if (activeStep === 1 && uploadedEmails.length === 0) {
      newErrors.emails = "Please upload or fetch emails";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [projectData, activeStep, selectionModel, uploadedEmails]);

  // Step navigation handlers.
  const handleNext = useCallback(() => {
    if (validateForm()) {
      setActiveStep((prev) => prev + 1);
    }
  }, [validateForm]);

  const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

  // File upload handler to extract emails.
  const handleFileUpload = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/project/extract-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { emails } = response.data;
      setUploadedEmails(emails);
    } catch (err) {
      console.error("Error extracting emails:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch recipients data
  const fetchRecipientsData = useCallback(async () => {
    if (!projectId) return;

    try {
      const response = await api.get(`/project/${projectId}/recipients`);
      setRecipientsData(response.data);
    } catch (error) {
      console.error("Error fetching recipients data:", error);
    }
  }, [projectId]);

  // Fetch project progress
  const fetchProjectProgress = useCallback(async () => {
    if (!projectId) return;

    try {
      const response = await api.get(`/project/${projectId}/progress`);
      setProjectProgress(response.data);
    } catch (error) {
      console.error("Error fetching project progress:", error);
    }
  }, [projectId]);

  // Fetch data once when projectId is set or when reaching step 2
  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      // Fetch both data in parallel
      await Promise.all([fetchRecipientsData(), fetchProjectProgress()]);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, fetchRecipientsData, fetchProjectProgress]);

  // Effect to fetch data once when projectId is set or when reaching step 2
  useEffect(() => {
    if (projectId && activeStep === 2) {
      fetchProjectData();
    }
  }, [projectId, activeStep, fetchProjectData]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const selectedEmails = uploadedEmails.filter((_, idx) =>
        selectionModel.includes(idx + 1)
      );

      // Show creating project notification
      setNotification({
        open: true,
        message: "Creating project...",
        severity: "info",
      });

      const submissionData = {
        name: projectData.name,
        message: "",
        subject: projectData.subject,
        emails: selectedEmails,
        googleSheetLink: projectData.googleSheetLink,
        htmlTemplate: projectData.template,
      };

      // First move to the last step
      setActiveStep(2);

      // First API call to create project
      const createResponse = await api.post("/project/create", submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store project ID
      const newProjectId = createResponse.data.id;
      setProjectId(newProjectId);

      // Show project created notification
      setNotification({
        open: true,
        message: "Project created successfully! Sending emails...",
        severity: "success",
      });

      // Make all remaining API calls in parallel
      const [sendResponse, recipientsData, progressData] = await Promise.all([
        // Send emails
        api.post(
          `/project/${newProjectId}/send`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        // Fetch recipients data
        api.get(`/project/${newProjectId}/recipients`),
        // Fetch project progress
        api.get(`/project/${newProjectId}/progress`),
      ]);

      // Update state with fetched data
      setRecipientsData(recipientsData.data);
      setProjectProgress(progressData.data);

      // Show final success notification
      setNotification({
        open: true,
        message: sendResponse.data.message,
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "An error occurred",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectionModel, uploadedEmails, projectData]);

  // Handle save draft functionality
  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const selectedEmails = uploadedEmails.filter((_, idx) =>
        selectionModel.includes(idx + 1)
      );

      // Show creating draft notification
      setNotification({
        open: true,
        message: "Saving project as draft...",
        severity: "info",
      });

      const submissionData = {
        name: projectData.name,
        message: "",
        subject: projectData.subject,
        emails: selectedEmails,
        googleSheetLink: projectData.googleSheetLink,
        htmlTemplate: projectData.template,
      };

      // First move to the last step
      setActiveStep(2);

      // API call to create project (without sending emails)
      const createResponse = await api.post("/project/create", submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store project ID
      const newProjectId = createResponse.data.id;
      setProjectId(newProjectId);

      // Make data fetch calls in parallel
      const [recipientsData, progressData] = await Promise.all([
        // Fetch recipients data
        api.get(`/project/${newProjectId}/recipients`),
        // Fetch project progress
        api.get(`/project/${newProjectId}/progress`),
      ]);

      // Update state with fetched data
      setRecipientsData(recipientsData.data);
      setProjectProgress(progressData.data);

      // Show success notification
      setNotification({
        open: true,
        message: "Project saved as draft successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "An error occurred",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectionModel, uploadedEmails, projectData]);

  // Handle editor content change
  const handleEditorChange = (content) => {
    setProjectData((prev) => ({ ...prev, template: content }));
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      handleEditorChange(content);

      // Validate before submitting
      if (validateForm()) {
        handleSubmit();
      }
    }
  };

  const handleSaveDraftClick = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      handleEditorChange(content);

      // Validate before saving draft
      if (validateForm()) {
        handleSaveDraft();
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          New Project
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
        <DialogContent>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomStepConnector />}
            sx={{
              "& .MuiStepIcon-root": { color: "#ccc" },
              "& .MuiStepIcon-root.Mui-active": { color: "#ED6D23" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#ED6D23" },
              "& .MuiStepLabel-label.Mui-active": {
                color: "#ED6D23",
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "#ED6D23",
                fontWeight: "bold",
              },
              mb: 2,
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2, position: "relative" }}>
            {/* STEP 0: Project Details */}
            {activeStep === 0 && (
              <>
                <TextField
                  label="Project Name"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
                <TextField
                  label="Subject"
                  name="subject"
                  value={projectData.subject}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Email Template
                </Typography>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={projectData.template}
                  onEditorChange={(content) => {
                    handleEditorChange(content);
                    setErrors((prev) => ({ ...prev, template: "" }));
                  }}
                  init={{
                    selector: "#basic-conf", // Matches the documentation
                    width: "100%",
                    height: 600,
                    plugins: [
                      "advlist",
                      "autolink",
                      "link",
                      "image",
                      "lists",
                      "charmap",
                      "preview",
                      "anchor",
                      "pagebreak",
                      "searchreplace",
                      "wordcount",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "emoticons",
                      "help",
                    ],
                    toolbar:
                      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | link image | print preview media fullscreen | " +
                      "forecolor backcolor emoticons | help",
                    menu: {
                      favs: {
                        title: "My Favorites",
                        items: "code visualaid | searchreplace | emoticons",
                      },
                    },
                    menubar:
                      "favs file edit view insert format tools table help",
                    // Email-friendly content styles
                    content_style:
                      "body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; } " +
                      "p { margin: 0 0 1em 0; } " +
                      "table { border-collapse: collapse; } " +
                      "table td, table th { border: 1px solid #ddd; padding: 8px; } " +
                      "img { max-width: 100%; height: auto; } " +
                      ".mce-content-body [data-mce-selected=inline-boundary] { background-color: transparent; }",
                    // Email-specific settings
                    forced_root_block: "p",
                    remove_trailing_brs: false,
                    paste_as_text: true,
                    convert_urls: false,
                    valid_elements: "*[*]", // Allow all elements and attributes
                    extended_valid_elements: "style,link[href|rel]",
                    entity_encoding: "raw",
                    // Ensure newlines are preserved
                    newline_behavior: "block",
                  }}
                />

                {errors.template && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {errors.template}
                  </Typography>
                )}
              </>
            )}

            {/* STEP 1: Project Recipient */}
            {activeStep === 1 && (
              <>
                {uploadedEmails.length === 0 ? (
                  <>
                    <TextField
                      label="Google Sheet Link"
                      name="googleSheetLink"
                      value={projectData.googleSheetLink || ""}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      disabled={isLoading}
                    />

                    {/* Tutorial Link */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleTutorialOpen}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#ED6D23",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Need help? View tutorial
                      </Link>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleFetchFromGoogleSheet}
                        disabled={isLoading || !projectData.googleSheetLink}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Fetch Emails from Google Sheet"
                        )}
                      </Button>
                      <Typography variant="body2">or</Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#ED6D23" }}
                          />
                        ) : (
                          "Upload File"
                        )}
                        <input
                          type="file"
                          accept=".xlsx"
                          hidden
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              await handleFileUpload(file);
                            }
                          }}
                          disabled={isLoading}
                        />
                      </Button>
                    </Box>
                    {errors.emails && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errors.emails}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" component="h2">
                        Uploaded Emails
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleTutorialOpen}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#ED6D23",
                            textDecoration: "none",
                            mr: 2,
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <HelpOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          View tutorial
                        </Link>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setUploadedEmails([]);
                            setSelectionModel([]);
                            setProjectData((prev) => ({
                              ...prev,
                              googleSheetLink: "",
                            }));
                          }}
                          startIcon={
                            <span role="img" aria-label="clear">
                              🗑️
                            </span>
                          }
                        >
                          Clear Data
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#ED6D23",
                            "&:hover": { backgroundColor: "#ED6D23" },
                          }}
                          component="label"
                        >
                          Upload New File
                          <input
                            type="file"
                            accept=".xlsx"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                await handleFileUpload(file);
                              }
                            }}
                          />
                        </Button>
                      </Box>
                    </Box>
                    <Paper
                      sx={{
                        height: 400,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {isLoading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            zIndex: 1,
                          }}
                        >
                          <CircularProgress sx={{ color: "#ED6D23" }} />
                        </Box>
                      )}
                      <DataGrid
                        rows={uploadedEmails.map((email, index) => ({
                          id: index + 1,
                          email,
                        }))}
                        columns={emailColumns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) =>
                          setSelectionModel(newSelection)
                        }
                        rowSelectionModel={selectionModel}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          "& .MuiDataGrid-row": {
                            "&:hover": {
                              backgroundColor: "rgba(237, 109, 35, 0.04)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgba(237, 109, 35, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(237, 109, 35, 0.12)",
                              },
                            },
                          },
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            borderBottom: "2px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-cell": {
                            borderBottom: "1px solid #f0f0f0",
                            padding: "8px 16px",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            padding: "12px 16px",
                          },
                          "& .MuiCheckbox-root": {
                            color: "#ED6D23",
                            "&.Mui-checked": {
                              color: "#ED6D23",
                            },
                          },
                          "& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox":
                            {
                              width: "64px !important",
                              minWidth: "64px !important",
                              maxWidth: "64px !important",
                              paddingLeft: "16px",
                            },
                          "& .MuiDataGrid-footerContainer": {
                            borderTop: "2px solid #e0e0e0",
                          },
                          "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#ffffff",
                          },
                        }}
                        disableRowSelectionOnClick
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                        localeText={{
                          noRowsLabel: "No emails uploaded",
                          footerRowSelected: (count) =>
                            `${count} email${count !== 1 ? "s" : ""} selected`,
                        }}
                      />
                    </Paper>
                    {errors.emails && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errors.emails}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}

            {/* STEP 2: Recipients Status */}
            {activeStep === 2 && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recipients Status
                </Typography>

                {/* Project Progress */}
                {projectProgress && (
                  <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="bold"
                    >
                      Project Progress
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}
                    >
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {projectProgress.status.charAt(0).toUpperCase() +
                            projectProgress.status.slice(1)}
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {projectProgress.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Recipients
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {projectProgress.total_recipients}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Sent
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="success.main"
                        >
                          {projectProgress.sent_count}
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Failed
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="error.main"
                        >
                          {projectProgress.failed_count}
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 150 }}>
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="warning.main"
                        >
                          {projectProgress.pending_count}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={projectProgress.progress}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: "#f5f5f5",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#ED6D23",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${Math.round(projectProgress.progress)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Recipients List */}
                {recipientsData && (
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="bold"
                    >
                      Recipients List
                    </Typography>

                    <Box sx={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={recipientsData.recipients.map(
                          (recipient, index) => ({
                            id: index + 1,
                            email: recipient.email,
                            status: recipient.status,
                            error_message: recipient.error_message,
                            sent_at: recipient.sent_at
                              ? new Date(recipient.sent_at).toLocaleString()
                              : "-",
                          })
                        )}
                        columns={[
                          { field: "id", headerName: "#", width: 70 },
                          {
                            field: "email",
                            headerName: "Email Address",
                            flex: 1,
                          },
                          {
                            field: "status",
                            headerName: "Status",
                            width: 120,
                            renderCell: (params) => {
                              let color = "";
                              let bgcolor = "";

                              switch (params.value) {
                                case "sent":
                                  color = "#2e7d32";
                                  bgcolor = "#e8f5e9";
                                  break;
                                case "failed":
                                  color = "#d32f2f";
                                  bgcolor = "#ffebee";
                                  break;
                                case "pending":
                                  color = "#ed6c02";
                                  bgcolor = "#fff4e5";
                                  break;
                                default:
                                  color = "#757575";
                                  bgcolor = "#f5f5f5";
                              }

                              return (
                                <Box
                                  sx={{
                                    backgroundColor: bgcolor,
                                    color: color,
                                    borderRadius: "16px",
                                    padding: "3px 10px",
                                    fontWeight: "medium",
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {params.value}
                                </Box>
                              );
                            },
                          },
                          {
                            field: "sent_at",
                            headerName: "Sent At",
                            width: 180,
                          },
                          {
                            field: "error_message",
                            headerName: "Error Message",
                            flex: 1,
                            renderCell: (params) => (
                              <Typography variant="body2" color="error">
                                {params.value || "-"}
                              </Typography>
                            ),
                          },
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25]}
                        disableSelectionOnClick
                        sx={{
                          border: "none",
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                          },
                          "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                )}

                {!recipientsData && !projectProgress && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 400,
                    }}
                  >
                    <CircularProgress sx={{ color: "#ED6D23" }} />
                  </Box>
                )}

                {/* Add a refresh button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={fetchProjectData}
                    startIcon={<RefreshIcon />}
                    sx={{
                      borderColor: "#ED6D23",
                      color: "#ED6D23",
                      "&:hover": {
                        borderColor: "#d65a1c",
                        backgroundColor: "rgba(237, 109, 35, 0.04)",
                      },
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: "#ED6D23" }} />
                    ) : (
                      "Refresh Data"
                    )}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          {activeStep > 0 && activeStep < 2 && (
            <Button
              onClick={handleBack}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 2 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : activeStep === 1 ? (
            <>
              <Button
                onClick={handleSaveDraftClick}
                variant="outlined"
                sx={{
                  borderColor: "#ED6D23",
                  color: "#ED6D23",
                  "&:hover": {
                    borderColor: "#d65a1c",
                    backgroundColor: "rgba(237, 109, 35, 0.04)",
                  },
                  mr: 1,
                }}
                disabled={
                  isSubmitting ||
                  uploadedEmails.length === 0 ||
                  selectionModel.length === 0
                }
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "#ED6D23" }} />
                ) : (
                  "Save Draft"
                )}
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                  backgroundColor: "#ED6D23",
                  "&:hover": { backgroundColor: "#ED6D23" },
                }}
                disabled={
                  isSubmitting ||
                  uploadedEmails.length === 0 ||
                  selectionModel.length === 0
                }
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDialogClose}
              variant="contained"
              sx={{
                backgroundColor: "#ED6D23",
                "&:hover": { backgroundColor: "#ED6D23" },
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body1" color="white">
            {isSubmitting ? "Processing..." : ""}
          </Typography>
        </Box>
      </Backdrop>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Tutorial Dialog */}
      <Dialog
        open={tutorialOpen}
        onClose={handleTutorialClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          Email Recipients Tutorial
          <IconButton
            aria-label="close"
            onClick={handleTutorialClose}
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
        <DialogContent>
          <Box sx={{ maxWidth: "100%", flexGrow: 1 }}>
            {/* Image and content container */}
            <Box
              sx={{
                height: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={tutorialSlides[activeSlide].imgPath}
                alt={tutorialSlides[activeSlide].label}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
              {tutorialSlides[activeSlide].label}
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              {tutorialSlides[activeSlide].description}
            </Typography>

            {/* Service Account Email Copy Field */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                maxWidth: 600,
                margin: "0 auto 24px auto",
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Important Resources:
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value="emailservice@casheer-email.iam.gserviceaccount.com"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton
                        onClick={handleCopyToClipboard}
                        size="small"
                        sx={{ color: copied ? "green" : "#ED6D23" }}
                      >
                        {copied ? <CheckIcon /> : <ContentCopyIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ED6D23",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ED6D23",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ED6D23",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExample}
                  sx={{
                    backgroundColor: "#ED6D23",
                    "&:hover": { backgroundColor: "#d65a1c" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Example
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                * Copy this email address to give access to your Google Sheet
                <br />* Download our example file to see the required format
              </Typography>
            </Box>

            {/* Navigation stepper */}
            <MobileStepper
              steps={tutorialSlides.length}
              position="static"
              activeStep={activeSlide}
              sx={{
                maxWidth: 400,
                flexGrow: 1,
                margin: "0 auto",
                "& .MuiMobileStepper-dot": {
                  backgroundColor: "#ccc",
                },
                "& .MuiMobileStepper-dotActive": {
                  backgroundColor: "#ED6D23",
                },
              }}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNextSlide}
                  disabled={activeSlide === tutorialSlides.length - 1}
                  sx={{
                    color: "#ED6D23",
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBackSlide}
                  disabled={activeSlide === 0}
                  sx={{
                    color: "#ED6D23",
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleTutorialClose}
            variant="contained"
            sx={{
              backgroundColor: "#ED6D23",
              "&:hover": { backgroundColor: "#ED6D23" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
