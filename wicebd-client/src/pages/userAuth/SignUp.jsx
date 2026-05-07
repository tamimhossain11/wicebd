import { Link } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import FooterV2 from '../../components/footer/FooterV2';
import HeaderV1 from '../../components/header/HeaderV1';

const SignUp = () => {
  return (
    <>
      <HeaderV1 headerStyle="header-style-two" />
      <Box sx={{
        minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', px: 2,
      }}>
        <Paper sx={{
          p: { xs: 4, md: 6 }, borderRadius: 4, maxWidth: 440, width: '100%', textAlign: 'center',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderTop: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
        }}>
          <Typography sx={{ fontSize: 44, mb: 2 }}>🔒</Typography>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22, mb: 1 }}>
            Sign-up Closed
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8, mb: 3 }}>
            New account registration is currently closed. If you already have an account, you can still sign in.
          </Typography>
          <Button component={Link} to="/sign-in" variant="outlined" fullWidth
            sx={{
              color: '#e94560', borderColor: '#e9456050', borderRadius: 2,
              textTransform: 'none', fontWeight: 600,
              '&:hover': { borderColor: '#e94560', background: '#e9456010' },
            }}>
            Go to Sign In
          </Button>
        </Paper>
      </Box>
      <FooterV2 />
    </>
  );
};

export default SignUp;
