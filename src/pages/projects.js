import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Skeleton,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import api from "../lib/api";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const NewProjectDialog = dynamic(() => import("../components/NewProjectDialog"), {
  ssr: false,
  loading: () => <CircularProgress sx={{ color: "#ED6D23" }} />
});

const ViewProjectDialog = dynamic(() => import("../components/ViewProjectDialog"), {
  ssr: false,
  loading: () => <CircularProgress sx={{ color: "#ED6D23" }} />
});

const EditDraftDialog = dynamic(() => import("../components/EditDraftDialog"), {
  ssr: false,
  loading: () => <CircularProgress sx={{ color: "#ED6D23" }} />
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Table pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Dialog states
  const [openNewProject, setOpenNewProject] = useState(false);
  const [openViewProject, setOpenViewProject] = useState(false);
  const [openEditDraft, setOpenEditDraft] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loadingProjectDetails, setLoadingProjectDetails] = useState(false);
  // Delete confirmation dialog
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    api
      .get(`/project/?page=${page + 1}&size=${rowsPerPage}&full_details=true`, {
        headers: { accept: "application/json" },
      })
      .then((response) => {
        const data = response.data;
        setProjects(data.projects);
        setTotal(data.total);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage]);

  const handleViewProject = async (projectId) => {
    setLoadingProjectDetails(true);
    try {
      const response = await api.get(`/project/${projectId}`, {
        headers: { accept: "application/json" },
      });
      setSelectedProject(response.data);
      setOpenViewProject(true);
    } catch (err) {
      console.error("Error fetching project details:", err);
      // You might want to show an error notification here
    } finally {
      setLoadingProjectDetails(false);
    }
  };

  const handleEditDraft = async (projectId, e) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedProject({ id: projectId });
    setOpenEditDraft(true);
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation(); // Prevent row click event
    setProjectToDelete(projectId);
    setOpenDeleteConfirm(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setDeletingProject(true);
    try {
      await api.delete(`/project/${projectToDelete}`, {
        headers: { accept: "application/json" },
      });
      // Refresh the projects list after successful deletion
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      // You might want to show an error notification here
    } finally {
      setDeletingProject(false);
      setOpenDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  // Define table columns
  const columns = [
    { 
      id: "name", 
      label: "Project Name", 
      minWidth: 200,
      renderCell: (value) => (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.87)',
            '&:hover': {
              color: '#ED6D23',
            }
          }}
        >
          {value}
        </Typography>
      )
    },
    { 
      id: "subject", 
      label: "Subject", 
      minWidth: 180,
      renderCell: (value) => (
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
          {value}
        </Typography>
      )
    },
    { 
      id: "status", 
      label: "Status", 
      minWidth: 120,
      renderCell: (value) => {
        const statusColors = {
          'pending': { bg: '#FFF4E5', color: '#B76E00' },
          'completed': { bg: '#E8F5E9', color: '#1B5E20' },
          'failed': { bg: '#FEEBEE', color: '#B71C1C' },
          'in_progress': { bg: '#E3F2FD', color: '#0D47A1' },
          'draft': { bg: '#F3F4F6', color: '#4B5563' }
        };
        const status = value?.toLowerCase() || 'pending';
        const colors = statusColors[status] || statusColors.pending;
        
        return (
          <Box
            sx={{
              backgroundColor: colors.bg,
              color: colors.color,
              py: 0.5,
              px: 1.5,
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {status.replace('_', ' ')}
          </Box>
        );
      }
    },
    { 
      id: "createdBy", 
      label: "Created By", 
      minWidth: 200,
      renderCell: (value) => (
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(0, 0, 0, 0.67)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#ED6D23',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {value?.charAt(0)?.toUpperCase() || '?'}
          </Box>
          {value}
        </Typography>
      )
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      renderCell: (_, row) => {
        const isDraft = row.status?.toLowerCase() === 'draft';
        
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Project">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProject(row.id);
                }}
                sx={{ 
                  color: '#ED6D23',
                  '&:hover': { backgroundColor: 'rgba(237, 109, 35, 0.04)' }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {isDraft && (
              <>
                <Tooltip title="Edit Draft">
                  <IconButton
                    size="small"
                    onClick={(e) => handleEditDraft(row.id, e)}
                    sx={{ 
                      color: '#4B5563',
                      '&:hover': { backgroundColor: 'rgba(75, 85, 99, 0.04)' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Draft">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteProject(row.id, e)}
                    sx={{ 
                      color: '#d32f2f',
                      '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      }
    }
  ];

  // Transform projects data to rows, adding a 'createdBy' field
  const rows = projects.map((project) => ({
    ...project,
    createdBy: project.created_by ? project.created_by.email : "",
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const LoadingSkeleton = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <Skeleton animation="wave" height={40} />
        </TableCell>
      ))}
    </TableRow>
  );

  if (error) {
    return (
      <Container maxWidth="md" className="py-8">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchProjects}
          sx={{ mt: 2, background: "#ED6D23" }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="flex justify-between items-center py-4">
        <Typography variant="h5" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          sx={{ background: "#ED6D23" }}
          onClick={() => setOpenNewProject(true)}
        >
          New Project
        </Button>
      </div>

      {/* New Project Dialog */}
      <NewProjectDialog
        open={openNewProject}
        onClose={() => {
          setOpenNewProject(false);
          fetchProjects(); // Refresh the list after closing
        }}
      />

      {/* View Project Dialog */}
      <ViewProjectDialog
        open={openViewProject}
        onClose={() => {
          setOpenViewProject(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        loading={loadingProjectDetails}
      />

      {/* Edit Draft Dialog */}
      <EditDraftDialog
        open={openEditDraft}
        onClose={(refreshNeeded) => {
          setOpenEditDraft(false);
          setSelectedProject(null);
          if (refreshNeeded) {
            fetchProjects(); // Refresh the list if changes were made
          }
        }}
        projectId={selectedProject?.id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => !deletingProject && setOpenDeleteConfirm(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Draft Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this draft project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteConfirm(false)} 
            disabled={deletingProject}
            sx={{ color: 'rgba(0, 0, 0, 0.67)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteProject} 
            color="error" 
            variant="contained"
            disabled={deletingProject}
            startIcon={deletingProject ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {deletingProject ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper 
        sx={{ 
          width: "100%", 
          overflow: "hidden",
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <TableContainer 
          sx={{ 
            maxHeight: 440, 
            minHeight: 440, 
            position: 'relative',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#ED6D23',
              borderRadius: '4px',
              '&:hover': {
                background: '#d65a1c',
              },
            },
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                zIndex: 1,
                backdropFilter: 'blur(2px)',
              }}
            >
              <CircularProgress sx={{ color: "#ED6D23" }} />
            </Box>
          )}
          <Table stickyHeader aria-label="projects table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.87)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      padding: '16px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Show loading skeletons
                [...Array(rowsPerPage)].map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    onClick={() => handleViewProject(row.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(237, 109, 35, 0.04)',
                      },
                      '& td': {
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                      }
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell 
                          key={column.id} 
                          align={column.align || "left"}
                        >
                          {column.renderCell ? column.renderCell(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Box 
                      sx={{ 
                        py: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.67)',
                          fontWeight: 500
                        }}
                      >
                        No projects found
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          color: '#ED6D23',
                          borderColor: '#ED6D23',
                          '&:hover': {
                            borderColor: '#d65a1c',
                            backgroundColor: 'rgba(237, 109, 35, 0.04)'
                          }
                        }}
                        onClick={() => setOpenNewProject(true)}
                      >
                        Create New Project
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            '.MuiTablePagination-select': {
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            },
            '.MuiTablePagination-selectIcon': {
              color: '#ED6D23'
            },
            '.MuiTablePagination-actions button': {
              color: '#ED6D23',
              '&:disabled': {
                color: 'rgba(0, 0, 0, 0.26)'
              },
              '&:hover': {
                backgroundColor: 'rgba(237, 109, 35, 0.04)'
              }
            }
          }}
        />
      </Paper>
    </Container>
  );
};

ProjectsPage.getInitialProps = async () => {
  return {}; // Return empty object since we don't need initial props
};

export default ProjectsPage;
