import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

export default function RoboSoccer() {
  return (
    <div className="page-wrapper">
      <span className="header-span" />
      <HeaderV1 headerStyle="header-style-two" parentMenu="register" />

      {/* Hero */}
      <section style={{ position: 'relative', background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 50%,#2a0010 100%)', padding: '140px 0 72px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(128,0,32,0.22),transparent 70%)', top: -120, left: -100, filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,0,42,0.12),transparent 70%)', bottom: -60, right: -40, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 700, color: '#800020' }}>WICEBD 2026 · Robotics</span>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(30px,5vw,48px)', margin: '10px 0 14px', lineHeight: 1.15 }}>Robo Sumo</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, maxWidth: 460, margin: '0 auto', lineHeight: 1.8 }}>
              Build your bot, form your team, and compete in the ultimate robotics challenge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Closed notice */}
      <section style={{ background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)', padding: '60px 0 100px' }}>
        <div className="auto-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ maxWidth: 800, margin: '0 auto' }}>
            <Box sx={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '3px solid rgba(255,255,255,0.15)',
              borderRadius: '20px',
              px: { xs: 3, md: 6 }, py: { xs: 6, md: 8 },
              boxShadow: '0 20px 56px rgba(0,0,0,0.45)',
              textAlign: 'center',
            }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>🔒</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 24, mb: 1 }}>
                Registration Closed
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 420, mx: 'auto', lineHeight: 1.8 }}>
                Robo Sumo registrations are currently closed. Please check back later or contact us for more information.
              </Typography>
            </Box>
          </motion.div>
        </div>
      </section>

      <FooterV2 />
    </div>
  );
}
