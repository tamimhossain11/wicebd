import { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

/* All styles intentionally inline — required for accurate html2canvas capture */
const GuestIDCard = forwardRef(function GuestIDCard({ card }, ref) {
  const initial = (card?.guest_name || 'G').charAt(0).toUpperCase();
  const verifyUrl = card?.qr_data || 'https://wicebd.com';

  return (
    <div
      ref={ref}
      style={{
        width: 300,
        fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* ── Top accent bar ── */}
      <div style={{
        height: 5,
        background: 'linear-gradient(90deg, #d62828 0%, #1a4f8a 50%, #f4a825 100%)',
      }} />

      {/* ── Header (dark) ── */}
      <div style={{
        background: 'linear-gradient(150deg, #060f1e 0%, #0d2244 60%, #091b38 100%)',
        padding: '22px 22px 26px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: -35, top: -35,
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,79,138,0.18) 0%, transparent 70%)',
          border: '1px solid rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: -25, bottom: -25,
          width: 100, height: 100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214,40,40,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 30, bottom: 10,
          width: 60, height: 60, borderRadius: '50%',
          border: '1px solid rgba(244,168,37,0.08)',
          pointerEvents: 'none',
        }} />

        {/* WICE logo in white pill */}
        <div style={{
          background: '#ffffff',
          borderRadius: 10,
          padding: '7px 18px',
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: 16,
          boxShadow: '0 2px 14px rgba(0,0,0,0.35)',
          position: 'relative',
        }}>
          <img
            src="/images/logo-normal.PNG"
            alt="WICE Bangladesh"
            crossOrigin="anonymous"
            style={{ height: 38, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>

        {/* Event subtitle */}
        <div style={{
          color: 'rgba(255,255,255,0.42)',
          fontSize: 7.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          lineHeight: 1.8,
        }}>
          World Invention Competition<br />
          &amp; Exhibition • Bangladesh
        </div>
      </div>

      {/* ── Header bottom gradient bar ── */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #d62828 0%, #1a4f8a 50%, #f4a825 100%)',
      }} />

      {/* ── White body ── */}
      <div style={{
        background: '#ffffff',
        padding: '22px 20px 18px',
        textAlign: 'center',
      }}>

        {/* Avatar circle */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #d62828 0%, #1a4f8a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
          border: '3px solid #f4a825',
          boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
          fontSize: 28, fontWeight: 800, color: '#ffffff',
          lineHeight: 1,
          flexShrink: 0,
        }}>
          {initial}
        </div>

        {/* Guest name */}
        <div style={{
          fontSize: 19,
          fontWeight: 800,
          color: '#060f1e',
          letterSpacing: '0.015em',
          lineHeight: 1.2,
          marginBottom: 10,
        }}>
          {card?.guest_name}
        </div>

        {/* Position badge */}
        <div style={{
          display: 'inline-block',
          padding: '5px 16px',
          background: 'rgba(26,79,138,0.08)',
          border: '1px solid rgba(26,79,138,0.28)',
          borderRadius: 100,
          fontSize: 10.5,
          fontWeight: 700,
          color: '#1a4f8a',
          letterSpacing: '0.04em',
          marginBottom: 18,
        }}>
          {card?.guest_position}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(26,79,138,0.15) 30%, rgba(26,79,138,0.15) 70%, transparent 100%)',
          marginBottom: 18,
        }} />

        {/* QR code — rendered as native canvas via qrcode.react, zero CORS issues */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{
            padding: 9,
            background: '#f4f7ff',
            border: '1px solid rgba(26,79,138,0.1)',
            borderRadius: 12,
            lineHeight: 0,
            boxShadow: '0 2px 12px rgba(26,79,138,0.08)',
          }}>
            <QRCodeCanvas
              value={verifyUrl}
              size={118}
              level="H"
              bgColor="#f4f7ff"
              fgColor="#060f1e"
              style={{ display: 'block' }}
            />
          </div>
        </div>

        {/* Scan label */}
        <div style={{
          fontSize: 8.5,
          color: 'rgba(0,0,0,0.28)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Scan to Verify
        </div>

        {/* Card UID */}
        <div style={{
          fontSize: 8,
          fontFamily: 'Courier New, monospace',
          color: 'rgba(0,0,0,0.3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {card?.card_uid}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: '#060f1e',
        padding: '11px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 9.5,
          fontWeight: 800,
          color: '#f4a825',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          ✦ OFFICIAL GUEST ✦
        </div>
      </div>

      {/* ── Bottom accent bar ── */}
      <div style={{
        height: 5,
        background: 'linear-gradient(90deg, #d62828 0%, #1a4f8a 50%, #f4a825 100%)',
      }} />
    </div>
  );
});

export default GuestIDCard;
