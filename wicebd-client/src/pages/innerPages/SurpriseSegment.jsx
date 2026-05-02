import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';

const competitions = [
  {
    path: '/robo-soccer',
    icon: '⚽',
    title: 'Robo Soccer',
    subtitle: 'Robotic Football Championship',
    description:
      'Build and program your robot to compete in head-to-head football matches. Teams of up to 3 members battle it out on the field.',
    fee: '৳777',
    badges: ['Team Event', 'Up to 3 Members', '৳777 Entry'],
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245,158,11,0.35)',
    border: 'rgba(245,158,11,0.22)',
  },
  {
    path: '/micromouse',
    icon: '🐭',
    title: 'Micromouse Maze-Solving',
    subtitle: 'Autonomous Maze Navigation',
    description:
      'Design a self-contained autonomous robot to navigate and solve a maze in the shortest possible time. Precision engineering meets algorithmic thinking.',
    fee: '৳888',
    badges: ['Team Event', 'Up to 3 Members', '৳888 Entry'],
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16,185,129,0.35)',
    border: 'rgba(16,185,129,0.22)',
  },
];

export default function SurpriseSegment() {
  return (
    <>
      <HeaderV1 headerStyle="header-style-two" parentMenu="register" />
      <BreadCrumb title="Robotics Competitions" breadCrumb="Robotics" />
      <div className="page-wrapper">
        <span className="header-span" />

        <section
          style={{
            background: 'linear-gradient(160deg, #0a0a14 0%, #10001a 60%, #0d0d1a 100%)',
            padding: '80px 0 100px',
            minHeight: '70vh',
          }}
        >
          <div className="auto-container">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 60 }}
            >
              <span
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.28em',
                  fontWeight: 700,
                  color: '#800020',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                WICEBD 2026 · Surprise Segments
              </span>
              <h1
                style={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 'clamp(28px, 5vw, 52px)',
                  margin: '0 0 16px',
                  lineHeight: 1.15,
                }}
              >
                Robotics{' '}
                <span style={{ color: '#800020' }}>Competitions</span>
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 15,
                  maxWidth: 520,
                  margin: '0 auto',
                  lineHeight: 1.8,
                }}
              >
                Two exciting robotics events revealed for WICE Bangladesh 2026.
                Choose your competition and register your team below.
              </p>
            </motion.div>

            {/* Cards */}
            <div
              style={{
                display: 'flex',
                gap: 32,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {competitions.map((c, i) => (
                <motion.div
                  key={c.path}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.55 }}
                  style={{
                    flex: '1 1 340px',
                    maxWidth: 430,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${c.border}`,
                    borderRadius: 20,
                    padding: '40px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: c.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 30,
                      marginBottom: 24,
                      boxShadow: `0 6px 24px ${c.glow}`,
                    }}
                  >
                    {c.icon}
                  </div>

                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: '0 0 6px' }}>
                    {c.title}
                  </h2>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontWeight: 600,
                      marginBottom: 16,
                    }}
                  >
                    {c.subtitle}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 14,
                      lineHeight: 1.8,
                      marginBottom: 24,
                      flex: 1,
                    }}
                  >
                    {c.description}
                  </p>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    {c.badges.map((b) => (
                      <span
                        key={b}
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          border: `1px solid ${c.border}`,
                          borderRadius: 50,
                          padding: '5px 14px',
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.7)',
                          fontWeight: 600,
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={c.path}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: c.gradient,
                      color: '#000',
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '14px 32px',
                      borderRadius: 50,
                      textDecoration: 'none',
                      boxShadow: `0 6px 20px ${c.glow}`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    Register Now →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FooterV2 />
      </div>
    </>
  );
}
