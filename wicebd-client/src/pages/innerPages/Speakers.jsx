import { useState, useEffect } from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CATEGORY_ORDER = ['Keynote', 'Academic', 'Industry', 'Judge', 'Guest'];
const CATEGORY_COLORS = {
  Keynote:  { bg: 'rgba(233,69,96,0.15)',  border: 'rgba(233,69,96,0.4)',  text: '#e94560' },
  Academic: { bg: 'rgba(108,99,255,0.15)', border: 'rgba(108,99,255,0.4)', text: '#6c63ff' },
  Industry: { bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.4)',  text: '#06b6d4' },
  Judge:    { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#10b981' },
  Guest:    { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#f59e0b' },
};
const DEFAULT_COLOR = { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)', text: 'rgba(255,255,255,0.7)' };

function catColor(cat) {
  return CATEGORY_COLORS[cat] || DEFAULT_COLOR;
}

/* ── Avatar placeholder with initials ── */
function Avatar({ name, imageUrl, size = 120 }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  if (imageUrl && !imgErr) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgErr(true)}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', display: 'block',
          border: '3px solid rgba(255,255,255,0.12)',
        }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #e94560, #6c63ff)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 800, color: '#fff',
      border: '3px solid rgba(255,255,255,0.12)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Single speaker card ── */
function SpeakerCard({ person }) {
  const cc = catColor(person.category);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 14,
      transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
      cursor: 'default',
      height: '100%',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
      e.currentTarget.style.borderColor = cc.border;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    }}
    >
      {/* Photo */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          background: `conic-gradient(${cc.text}, transparent 60%, ${cc.text})`,
          opacity: 0.5,
        }} />
        <Avatar name={person.name} imageUrl={person.image_url} size={110} />
      </div>

      {/* Category badge */}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', padding: '3px 10px',
        borderRadius: 20, background: cc.bg,
        border: `1px solid ${cc.border}`, color: cc.text,
      }}>
        {person.category || 'Speaker'}
      </span>

      {/* Name */}
      <div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 4 }}>
          {person.name}
        </div>
        {person.title && (
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.4, marginBottom: 3 }}>
            {person.title}
          </div>
        )}
        {person.institution && (
          <div style={{ color: cc.text, fontSize: 12, fontWeight: 600 }}>
            {person.institution}
          </div>
        )}
      </div>
    </div>
  );
}

const Speakers = () => {
  const [advisors, setAdvisors]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    axios.get(`${API}/api/advisors`)
      .then(r => setAdvisors(r.data?.advisors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Build tabs from available categories */
  const categories = ['All', ...CATEGORY_ORDER.filter(c => advisors.some(a => a.category === c)),
    ...advisors.map(a => a.category).filter(c => c && !CATEGORY_ORDER.includes(c) && c !== null).filter((c,i,arr) => arr.indexOf(c) === i)
  ];

  const filtered = activeTab === 'All' ? advisors : advisors.filter(a => a.category === activeTab);

  return (
    <>
      <div className="page-wrapper">
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="speakers" />

        {/* ── Hero banner ── */}
        <section style={{
          background: 'linear-gradient(135deg, #07070f 0%, #10001a 50%, #0d0d1a 100%)',
          paddingTop: 140, paddingBottom: 60, position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative blobs */}
          <div style={{ position:'absolute', top:-80, left:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(233,69,96,0.18),transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.14),transparent 70%)', pointerEvents:'none' }} />

          <div className="auto-container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <span style={{ display:'inline-block', fontSize:12, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#e94560', marginBottom:12 }}>
              WICE Bangladesh
            </span>
            <h1 style={{ color:'#fff', fontWeight:800, fontSize:'clamp(28px,5vw,52px)', lineHeight:1.15, marginBottom:16 }}>
              Speakers &amp; Advisors
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:16, maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>
              Meet the distinguished academics, industry experts, and keynote speakers shaping WICE Bangladesh.
            </p>
          </div>
        </section>

        {/* ── Main content ── */}
        <section style={{
          background: 'linear-gradient(180deg, #0d0d1a 0%, #07070f 100%)',
          padding: '60px 0 80px',
        }}>
          <div className="auto-container">

            {/* Category filter tabs */}
            {categories.length > 1 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginBottom:48 }}>
                {categories.map(cat => {
                  const active = cat === activeTab;
                  const cc = cat === 'All' ? { text:'#fff', bg:'rgba(255,255,255,0.12)', border:'rgba(255,255,255,0.3)' } : catColor(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      style={{
                        padding: '8px 20px', borderRadius: 30, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                        border: `1.5px solid ${active ? cc.border : 'rgba(255,255,255,0.12)'}`,
                        background: active ? cc.bg : 'transparent',
                        color: active ? cc.text : 'rgba(255,255,255,0.45)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat}
                      {cat !== 'All' && (
                        <span style={{ marginLeft:6, fontSize:11, opacity:0.7 }}>
                          ({advisors.filter(a => a.category === cat).length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <div style={{ width:44, height:44, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#e94560', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:14 }}>Loading speakers…</p>
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🎤</div>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:16 }}>
                  {activeTab === 'All' ? 'Speakers will be announced soon.' : `No ${activeTab} speakers yet.`}
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
                gap:24,
              }}>
                {filtered.map(person => (
                  <SpeakerCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </div>
        </section>

        <FooterV2 />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default Speakers;
