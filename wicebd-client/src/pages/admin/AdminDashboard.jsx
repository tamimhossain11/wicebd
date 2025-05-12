import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  DataGrid, 
  GridToolbar,
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { 
  Logout, 
  Visibility, 
  FileDownload,
  Refresh 
} from '@mui/icons-material';
import { participantsApi} from '../../api/participants';  // Instead of importing 'api'

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchParticipants = async () => {
  try {
    setLoading(true);
    setError('');
    const response = await participantsApi.getAll();  // Use participantsApi instead of api
    setParticipants(response.data);
  } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || 'Failed to load participants');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }
    fetchParticipants();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleExport = async () => {
  try {
    const response = await participantsApi.exportToCSV();  // Use participantsApi here too
    const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participants.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'leader', headerName: 'Leader', width: 150 },
    { field: 'leaderEmail', headerName: 'Email', width: 200 },
    { field: 'institution', headerName: 'Institution', width: 180 },
    { field: 'projectTitle', headerName: 'Project Title', width: 200 },
    { field: 'competitionCategory', headerName: 'Category', width: 120 },
    { field: 'projectSubcategory', headerName: 'Subcategory', width: 140 },
    { field: 'paymentID', headerName: 'Payment ID', width: 180 },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Tooltip title="View Details"><Visibility /></Tooltip>}
          onClick={() => navigate(`/admin/participants/${params.id}`)}
          label="View"
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Participants information
        </Typography>
        
        <Box>
          <Tooltip title="Export to CSV">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FileDownload />}
              onClick={handleExport}
              sx={{ mr: 2 }}
            >
              Export
            </Button>
          </Tooltip>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchParticipants} sx={{ mr: 2 }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 2, height: '75vh' }}>
        <DataGrid
          rows={participants}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50]}
          pagination
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          loading={loading}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid rgba(224, 224, 224, 1)',
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default AdminDashboard;