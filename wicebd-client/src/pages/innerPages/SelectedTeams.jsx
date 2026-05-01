import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import api from '../../api/index';

const Orb = ({ style }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle,rgba(128,0,32,0.22),transparent 70%)',
    filter: 'blur(55px)', ...style,
  }} />
);

const MEDAL = {
  gold:   { color: '#FFD700', bg: 'rgba(255,215,0,0.08)',   border: 'rgba(255,215,0,0.25)',   label: 'Gold',   emoji: '🥇', rank: 1 },
  silver: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.25)', label: 'Silver', emoji: '🥈', rank: 2 },
  bronze: { color: '#CD7F32', bg: 'rgba(205,127,50,0.08)',  border: 'rgba(205,127,50,0.25)',  label: 'Bronze', emoji: '🥉', rank: 3 },
};

const CATEGORY_ORDER = ['Elementary', 'High School', 'college', 'University'];
const CATEGORY_LABELS = { Elementary: 'Elementary', 'Primary School': 'Elementary', 'High School': 'High School', college: 'College', University: 'University' };

const SelectedTeams = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/national-round')
      .then(r => setSelections(r.data?.selections || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group selections: type → subcategory → education_category → position
  const grouped = {};
  selections.forEach(s => {
    const type = s.competition_type === 'wall_magazine' ? 'Wall Magazine' : 'Project';
    const sub = s.subcategory || 'Wall Magazine';
    const cat = s.education_category || 'Unknown';
    if (!grouped[type]) grouped[type] = {};
    if (!grouped[type][sub]) grouped[type][sub] = {};
    if (!grouped[type][sub][cat]) grouped[type][sub][cat] = {};
    grouped[type][sub][cat][s.position] = s;
  });

  const hasResults = selections.length > 0;

  return (
    <div className="page-wrapper">
      <span className="header-span" />
      <HeaderV1 headerStyle="header-style-two" parentMenu="teams" />

      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
      }}>
        <Orb style={{ width: 520, height: 520, top: -120, left: -80 }} />
        <Orb style={{ width: 380, height: 380, bottom: -80, right: -60 }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="auto-container" style={{ position: 'relative', zIndex: 2, paddingTop: 120, paddingBottom: 80 }}>
          {/* Hero */}
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}>
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}
              style={{ width: 100, height: 100, borderRadius: 28, margin: '0 auto 32px', background: 'linear-gradient(135deg,#800020,#4f0014)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(128,0,32,0.5)' }}>
              <i className="fa fa-trophy" style={{ color: '#fff', fontSize: 40 }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
              <span style={{ display: 'inline-block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', marginBottom: 16 }}>
                8th WICEBD — National Round
              </span>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(32px,5.5vw,58px)', margin: '0 0 20px', lineHeight: 1.1 }}>
                {hasResults ? 'National Round' : 'Selected Teams for the'}
                <br />
                <span style={{ background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {hasResults ? 'Winners' : 'National Round'}
                </span>
              </h1>

              {!hasResults && (
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.85, marginBottom: 44, maxWidth: 520, margin: '0 auto 44px' }}>
                  The selected teams for the 8th WICEBD National Round will be announced here once the registration and selection process is complete. Stay tuned!
                </p>
              )}

              {!hasResults && (
                <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(128,0,32,0.18)', border: '1px solid rgba(128,0,32,0.4)', borderRadius: 50, padding: '12px 28px', marginBottom: 52 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c0002a', display: 'inline-block', boxShadow: '0 0 8px rgba(192,0,42,0.8)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em' }}>
                    {loading ? 'Loading…' : 'Announcement Pending'}
                  </span>
                </motion.div>
              )}

              {hasResults && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  {Object.values(MEDAL).map(m => (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: m.bg, border: `1px solid ${m.border}`, borderRadius: 50, padding: '8px 20px' }}>
                      <span style={{ fontSize: 18 }}>{m.emoji}</span>
                      <span style={{ color: m.color, fontWeight: 700, fontSize: 14 }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Results grid */}
          {hasResults && Object.entries(grouped).map(([type, subcats], ti) => (
            <motion.div key={type} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * ti, duration: 0.5 }}>
              {/* Competition type header */}
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span style={{ display: 'inline-block', background: 'rgba(128,0,32,0.2)', border: '1px solid rgba(128,0,32,0.5)', borderRadius: 50, padding: '8px 28px', color: '#ff8080', fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {type === 'Wall Magazine' ? '📰 Wall Magazine' : '🔬 Project Competition'}
                </span>
              </div>

              {Object.entries(subcats).map(([subcat, cats]) => (
                <div key={subcat} style={{ marginBottom: 56 }}>
                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', textAlign: 'center', marginBottom: 32 }}>
                    <span style={{ background: 'linear-gradient(135deg,#c0002a,#800020)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{subcat}</span>
                  </h2>

                  {[...CATEGORY_ORDER, ...Object.keys(cats).filter(c => !CATEGORY_ORDER.includes(c))].filter(c => cats[c]).map(cat => (
                    <div key={cat} style={{ marginBottom: 36 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <span style={{ height: 2, flex: 1, background: 'rgba(255,255,255,0.06)', display: 'block' }} />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>
                          {CATEGORY_LABELS[cat] || cat}
                        </span>
                        <span style={{ height: 2, flex: 1, background: 'rgba(255,255,255,0.06)', display: 'block' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
                        {['gold', 'silver', 'bronze'].filter(pos => cats[cat][pos]).map((pos, pi) => {
                          const s = cats[cat][pos];
                          const m = MEDAL[pos];
                          return (
                            <motion.div key={pos} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * pi, duration: 0.4 }}
                              style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${m.color}20, transparent 70%)`, pointerEvents: 'none' }} />
                              <div style={{ fontSize: 36, marginBottom: 12 }}>{m.emoji}</div>
                              <div style={{ color: m.color, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{m.label}</div>
                              <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, marginBottom: 2, lineHeight: 1.3 }}>{s.team_name}</div>
                              {s.leader_name && s.leader_name !== s.team_name && (
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4 }}>Leader: {s.leader_name}</div>
                              )}
                              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{s.institution}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          ))}

          {/* Info cards when no results */}
          {!hasResults && !loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, maxWidth: 600, margin: '0 auto' }}>
              {[
                { icon: 'fa-flag', label: 'Event', val: '8th WICEBD' },
                { icon: 'fa-map-marker-alt', label: 'Round', val: 'National' },
                { icon: 'fa-clock', label: 'Status', val: 'Coming Soon' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '3px solid #800020', borderRadius: 16, padding: 20 }}>
                  <i className={`fa ${item.icon}`} style={{ color: '#800020', fontSize: 20, marginBottom: 10, display: 'block' }} />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{item.val}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterV2 />
    </div>
  );
};

export default SelectedTeams;
