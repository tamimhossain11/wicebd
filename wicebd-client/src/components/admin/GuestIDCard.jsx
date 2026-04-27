import { forwardRef } from 'react';

/* All styles are intentionally inline — required for html2canvas capture */
const GuestIDCard = forwardRef(function GuestIDCard({ card }, ref) {
  const hasQR = !!(card?.image_url);

  return (
    <div
      ref={ref}
      style={{
        width: 520,
        height: 300,
        background: 'linear-gradient(140deg, #060c20 0%, #0b1535 45%, #050d22 100%)',
        borderRadius: 18,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif',
        flexShrink: 0,
      }}
    >
      {/* ── Left accent bar ── */}
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: 5, height: '100%',
        background: 'linear-gradient(180deg, #d62828 0%, #1a4f8a 50%, #f4a825 100%)',
      }} />

      {/* ── Decorative background circles ── */}
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,79,138,0.12) 0%, transparent 70%)',
        border: '1px solid rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 30, bottom: -70,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(214,40,40,0.08) 0%, transparent 70%)',
        border: '1px solid rgba(255,255,255,0.03)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: 80, bottom: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,168,37,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Diagonal shimmer ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 45%, rgba(255,255,255,0.012) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header row: logo + GUEST badge ── */}
      <div style={{
        position: 'absolute', top: 0, left: 5, right: 0, height: 82,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px 0 18px',
      }}>
        {/* White pill for logo so white PNG bg blends */}
        <div style={{
          background: '#ffffff',
          borderRadius: 10,
          padding: '5px 14px 5px 10px',
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
        }}>
          <img
            src="/images/logo-normal.PNG"
            alt="WICE Bangladesh"
            crossOrigin="anonymous"
            style={{ height: 40, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>

        {/* GUEST badge */}
        <div style={{
          padding: '6px 18px',
          background: 'linear-gradient(135deg, rgba(214,40,40,0.18) 0%, rgba(244,168,37,0.18) 100%)',
          border: '1px solid rgba(244,168,37,0.55)',
          borderRadius: 100,
          color: '#f4c55a',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          boxShadow: '0 0 16px rgba(244,168,37,0.15)',
        }}>
          ✦ GUEST ✦
        </div>
      </div>

      {/* ── Gradient divider ── */}
      <div style={{
        position: 'absolute', top: 82, left: 23, right: 22, height: 1,
        background: 'linear-gradient(90deg, #d62828 0%, #1a4f8a 40%, #f4a825 80%, transparent 100%)',
        opacity: 0.75,
      }} />

      {/* ── Main body ── */}
      <div style={{
        position: 'absolute',
        top: 96,
        left: 23,
        right: hasQR ? 148 : 23,
        bottom: 54,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 11,
      }}>
        {/* Name */}
        <div>
          <div style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.01em',
            lineHeight: 1.15,
            marginBottom: 7,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            {card?.guest_name}
          </div>
          {/* Coloured underline */}
          <div style={{
            width: 44,
            height: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #f4a825, #d62828)',
          }} />
        </div>

        {/* Position chip */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '5px 14px',
          background: 'rgba(26,79,138,0.32)',
          border: '1px solid rgba(100,170,240,0.4)',
          borderRadius: 100,
          color: '#93c5fd',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          alignSelf: 'flex-start',
          boxShadow: '0 0 10px rgba(26,79,138,0.25)',
        }}>
          {card?.guest_position}
        </div>
      </div>

      {/* ── QR code ── */}
      {hasQR && (
        <div style={{
          position: 'absolute',
          right: 22,
          top: 104,
          bottom: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: 9,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            lineHeight: 0,
          }}>
            <img
              src={card.image_url}
              alt="QR Code"
              crossOrigin="anonymous"
              style={{ width: 86, height: 86, display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
        background: 'rgba(0,0,0,0.38)',
        borderTop: '1px solid rgba(255,255,255,0.055)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
      }}>
        <div style={{
          color: 'rgba(255,255,255,0.38)',
          fontSize: 9,
          fontFamily: 'monospace',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          {card?.card_uid}
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.28)',
          fontSize: 8,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'right',
          lineHeight: 1.5,
        }}>
          World Invention Competition<br />&amp; Exhibition • Bangladesh
        </div>
      </div>

      {/* ── Bottom gradient bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #d62828 0%, #1a4f8a 50%, #f4a825 100%)',
      }} />
    </div>
  );
});

export default GuestIDCard;
