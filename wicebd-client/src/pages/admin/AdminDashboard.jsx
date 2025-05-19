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
  Tooltip,
  Tabs,
  Tab
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
import { participantsApi } from '../../api/participants';

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [olympiadParticipants, setOlympiadParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await participantsApi.getAll();
      setParticipants(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOlympiadParticipants = async () => {
  try {
    setLoading(true);
    setError('');
    const response = await participantsApi.getOlympiadParticipants();
    setOlympiadParticipants(response.data); // Make sure this is an array
  } catch (err) {
    console.error('Fetch Olympiad error:', err);
    handleError(err);
  } finally {
    setLoading(false);
  }
};

  const handleError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } else {
      setError(err.response?.data?.message || 'Failed to load data');
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }
    fetchParticipants();
    fetchOlympiadParticipants();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleExport = async () => {
  try {
    const exportFunction = currentTab === 0 
      ? participantsApi.exportToCSV 
      : participantsApi.exportOlympiadToCSV;
    
    const response = await exportFunction();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', currentTab === 0 ? 'participants.csv' : 'olympiad_participants.csv');
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    setError('Failed to export data');
  }
};

  const refreshData = () => {
    if (currentTab === 0) {
      fetchParticipants();
    } else {
      fetchOlympiadParticipants();
    }
  };

  // Columns for Project/Magazine participants
  const projectColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'leader', headerName: 'Leader Name', width: 150 },
    { field: 'leaderEmail', headerName: 'Email', width: 200 },
    { field: 'leaderPhone', headerName: 'Phone', width: 130 },
    { field: 'leaderWhatsApp', headerName: 'WhatsApp', width: 130 },
    { field: 'tshirtSizeLeader', headerName: 'T-Shirt Size (Leader)', width: 180 },
    { field: 'member2', headerName: 'Member 2', width: 130 },
    { field: 'institution2', headerName: 'Institution 2', width: 180 },
    { field: 'tshirtSize2', headerName: 'T-Shirt Size 2', width: 160 },
    { field: 'member3', headerName: 'Member 3', width: 130 },
    { field: 'institution3', headerName: 'Institution 3', width: 180 },
    { field: 'tshirtSize3', headerName: 'T-Shirt Size 3', width: 160 },
    { field: 'institution', headerName: 'Main Institution', width: 180 },
    { field: 'competitionCategory', headerName: 'Category', width: 160 },
    { field: 'projectSubcategory', headerName: 'Subcategory', width: 160 },
    { field: 'projectCategory', headerName: 'Project Category', width: 160 },
    { field: 'projectTitle', headerName: 'Project Title', width: 200 },
    { field: 'categories', headerName: 'Main Category', width: 160 },
    { field: 'participatedBefore', headerName: 'Participated Before?', width: 180 },
    { field: 'previousCompetition', headerName: 'Previous Competition', width: 200 },
    { field: 'socialMedia', headerName: 'Social Media Link', width: 200 },
    { field: 'infoSource', headerName: 'Info Source', width: 180 },
    { field: 'crRefrence', headerName: 'CR Ref.', width: 160 },
    { field: 'paymentID', headerName: 'Payment ID', width: 180 },
    {
      field: 'createdAt',
      headerName: 'Registration Date',
      width: 160,
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
          onClick={() => navigate(`/api/admin/participants/${params.id}`)}
          label="View"
        />,
      ],
    },
  ];

  // Columns for Olympiad participants
  const olympiadColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'registration_id', headerName: 'Reg ID', width: 120 },
    { field: 'full_name', headerName: 'Full Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'institution', headerName: 'Institution', width: 200 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'cr_reference', headerName: 'CR Ref', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'created_at',
      headerName: 'Registration Date',
      width: 160,
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
          onClick={() => navigate(`/api/olympiad/getolympiad/${params.id}`)}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>

        <Box>
          <Tooltip title="Export to CSV">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownload />}
              onClick={handleExport}
              sx={{ mr: 2 }}
            >
              Export
            </Button>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton onClick={refreshData} sx={{ mr: 2 }}>
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

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Project/Magazine" />
        <Tab label="Olympiad" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={4} sx={{ p: 2, height: '75vh', borderRadius: 3 }}>
        <DataGrid
          rows={currentTab === 0 ? participants : olympiadParticipants}
          columns={currentTab === 0 ? projectColumns : olympiadColumns}
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
              backgroundColor: '#1976d2',
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              fontSize: 14,
              whiteSpace: 'normal',
              lineHeight: 1.4,
              padding: '8px',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Paper>
    </Container>
  );
};
export default AdminDashboard;