import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

/* ── Event date ── */
const EVENT_DATE = new Date('2026-05-09T09:00:00');

/* ── Track definitions ── */
const TRACKS = [
  {
    icon: '🏆',
    title: 'Project Competition',
    color: '#e94560',
    items: ['University', 'College', 'School'],
    desc: 'Team-based technical project showcase across three education levels.',
  },
  {
    icon: '📰',
    title: 'Wall Magazine',
    color: '#f59e0b',
    items: ['University', 'College', 'School'],
    desc: 'Creative visual storytelling through wall magazine design and presentation.',
  },
  {
    icon: '🎓',
    title: 'Olympiad',
    color: '#6c63ff',
    items: ['Individual registration'],
    desc: 'A challenging individual academic competition testing analytical skills.',
  },
  {
    icon: '🎤',
    title: 'Keynote Sessions',
    color: '#06b6d4',
    items: ['Industry leaders', 'Academic advisors', 'Expert panel'],
    desc: 'Inspiring talks from leading professionals and academic visionaries.',
  },
  {
    icon: '🤝',
    title: 'Networking & Awards',
    color: '#10b981',
    items: ['Award ceremony', 'Networking session', 'Cultural program'],
    desc: 'Celebrate achievements and build lasting professional connections.',
  },
];

/* ── Timeline phase cards ── */
const PHASES = [
  { phase: 'Registration',       date: 'Open Now',       color: '#10b981', done: true  },
  { phase: 'Submission Deadline', date: 'TBA',            color: '#f59e0b', done: false },
  { phase: 'Selection Announced', date: 'TBA',            color: '#06b6d4', done: false },
  { phase: 'Event Day',          date: 'May 9, 2026',    color: '#e94560', done: false },
];

/* ── Countdown hook ── */
function useCountdown(target) {
  const [delta, setDelta] = React.useState(target - Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setDelta(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(0, delta);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { d, h, m, s };
}

function CountUnit({ value, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 72 }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        padding: '14px 10px 10px',
        marginBottom: 8,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(28px,5vw,42px)', lineHeight: 1, display: 'block' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  );
}

const Schedule = () => {
  const { d, h, m, s } = useCountdown(EVENT_DATE.getTime());

  return (
    <>
      <div className="page-wrapper">
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="schedule" />

        {/* ══ HERO ══ */}
        <section style={{
          background: 'linear-gradient(135deg, #07070f 0%, #10001a 50%, #0d0d1a 100%)',
          paddingTop: 140, paddingBottom: 70, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:-100, left:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(233,69,96,0.18),transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, right:-60, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.14),transparent 70%)', pointerEvents:'none' }} />

          <div className="auto-container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <span style={{ display:'inline-block', fontSize:12, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#e94560', marginBottom:12 }}>
              WICE Bangladesh 2026
            </span>
            <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(28px,5vw,52px)', lineHeight:1.15, marginBottom:16 }}>
              Event Schedule
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:16, maxWidth:520, margin:'0 auto 40px', lineHeight:1.7 }}>
              The full detailed schedule will be published closer to the event date. Stay tuned for session timings, keynote speakers, and competition rounds.
            </p>

            {/* Coming soon badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(233,69,96,0.12)', border:'1px solid rgba(233,69,96,0.35)', borderRadius:30, padding:'10px 22px', marginBottom:50 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#e94560', display:'inline-block', animation:'pulse 1.4s ease-in-out infinite' }} />
              <span style={{ color:'rgba(255,255,255,0.85)', fontSize:14, fontWeight:600 }}>
                Detailed schedule coming soon
              </span>
            </div>

            {/* Countdown */}
            <div>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:20 }}>
                Event starts in
              </p>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                <CountUnit value={d} label="Days" />
                <div style={{ color:'rgba(255,255,255,0.25)', fontSize:36, fontWeight:300, alignSelf:'flex-start', paddingTop:14 }}>:</div>
                <CountUnit value={h} label="Hours" />
                <div style={{ color:'rgba(255,255,255,0.25)', fontSize:36, fontWeight:300, alignSelf:'flex-start', paddingTop:14 }}>:</div>
                <CountUnit value={m} label="Minutes" />
                <div style={{ color:'rgba(255,255,255,0.25)', fontSize:36, fontWeight:300, alignSelf:'flex-start', paddingTop:14 }}>:</div>
                <CountUnit value={s} label="Seconds" />
              </div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, marginTop:20 }}>
                📅 &nbsp;Saturday, May 9, 2026
              </p>
            </div>
          </div>
        </section>

        {/* ══ TIMELINE / PHASES ══ */}
        <section style={{ background:'#07070f', padding:'70px 0' }}>
          <div className="auto-container">
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#e94560' }}>Timeline</span>
              <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(22px,4vw,36px)', marginTop:8 }}>Key Dates</h2>
            </div>

            <div style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center' }}>
              {PHASES.map((p, i) => (
                <div key={i} style={{
                  flex:'1 1 200px', maxWidth:240,
                  background: p.done ? `${p.color}10` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${p.done ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:16, padding:'24px 20px', textAlign:'center',
                }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:`${p.color}20`, border:`1.5px solid ${p.color}50`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                    <span style={{ color:p.color, fontWeight:900, fontSize:18 }}>{i + 1}</span>
                  </div>
                  <div style={{ color: p.done ? p.color : 'rgba(255,255,255,0.7)', fontWeight:700, fontSize:14, marginBottom:6 }}>{p.phase}</div>
                  <div style={{ color: p.done ? p.color : 'rgba(255,255,255,0.35)', fontSize:12, fontWeight:600 }}>{p.date}</div>
                  {p.done && (
                    <div style={{ marginTop:8, display:'inline-block', background:`${p.color}20`, color:p.color, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>
                      ACTIVE
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ COMPETITION TRACKS ══ */}
        <section style={{ background:'linear-gradient(180deg,#0d0d1a,#07070f)', padding:'70px 0 80px' }}>
          <div className="auto-container">
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#6c63ff' }}>What to Expect</span>
              <h2 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(22px,4vw,36px)', marginTop:8 }}>Competition Tracks &amp; Events</h2>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15, marginTop:12, maxWidth:500, margin:'12px auto 0' }}>
                Detailed session times and venue allocation will be published in the full schedule.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
              {TRACKS.map((t, i) => (
                <div key={i} style={{
                  background:'rgba(255,255,255,0.03)',
                  border:`1px solid rgba(255,255,255,0.07)`,
                  borderLeft:`4px solid ${t.color}`,
                  borderRadius:14, padding:'24px 22px',
                  transition:'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <span style={{ fontSize:28 }}>{t.icon}</span>
                    <h4 style={{ color:'#fff', fontWeight:700, fontSize:16, margin:0 }}>{t.title}</h4>
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, lineHeight:1.6, marginBottom:14 }}>{t.desc}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {t.items.map((item, j) => (
                      <span key={j} style={{ fontSize:11, padding:'3px 9px', borderRadius:20, background:`${t.color}15`, border:`1px solid ${t.color}35`, color:t.color, fontWeight:600 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ NOTIFY CTA ══ */}
        <section style={{ background:'#07070f', padding:'50px 0 80px' }}>
          <div className="auto-container" style={{ textAlign:'center' }}>
            <div style={{
              background:'rgba(233,69,96,0.06)', border:'1px solid rgba(233,69,96,0.2)',
              borderRadius:20, padding:'48px 32px', maxWidth:600, margin:'0 auto',
            }}>
              <span style={{ fontSize:40, display:'block', marginBottom:16 }}>📣</span>
              <h3 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(18px,3vw,26px)', marginBottom:12 }}>
                Stay Updated
              </h3>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:1.7, marginBottom:24 }}>
                The complete event schedule — including session slots, keynote timings, and venue maps — will be announced soon. Register now to secure your spot.
              </p>
              <a href="/registration" style={{
                display:'inline-block', background:'linear-gradient(135deg,#e94560,#b0003a)',
                color:'#fff', padding:'12px 32px', borderRadius:8, fontWeight:700, fontSize:14,
                textDecoration:'none', transition:'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}
              >
                Register Now
              </a>
            </div>
          </div>
        </section>

        <FooterV2 />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
};

export default Schedule;
