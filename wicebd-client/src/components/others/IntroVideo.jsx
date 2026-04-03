import { useState, useRef, useEffect } from 'react';

/**
 * IntroVideo
 *
 * withSound=true  → first-ever visit: show splash click-gate, then play with audio
 * withSound=false → every other load:  autoplay immediately, muted (browser allows this)
 */
const IntroVideo = ({ onComplete, withSound }) => {
    const videoRef = useRef(null);
    // withSound=true  starts at 'splash', withSound=false starts at 'playing' (autoplays muted)
    const [phase, setPhase] = useState(withSound ? 'splash' : 'playing');

    // Auto-start muted playback on return visits
    useEffect(() => {
        if (!withSound && videoRef.current) {
            videoRef.current.play().catch(() => handleEnded());
        }
    }, []);

    const handleStart = () => {
        setPhase('playing');
        if (videoRef.current) {
            videoRef.current.play().catch(() => handleEnded());
        }
    };

    const handleEnded = () => {
        setPhase('fading');
        setTimeout(onComplete, 700);
    };

    // Escape key skips during playback
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && phase === 'playing') handleEnded();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [phase]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: phase === 'fading' ? 0 : 1,
                transition: 'opacity 0.7s ease',
                overflow: 'hidden',
            }}
        >
            {/* Video — muted only on return visits */}
            <video
                ref={videoRef}
                src="/videos/intro.MP4"
                playsInline
                muted={!withSound}
                onEnded={handleEnded}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: phase === 'splash' ? 'none' : 'block',
                }}
            />

            {/* Splash click-gate — only shown on first visit (withSound=true) */}
            {phase === 'splash' && (
                <div
                    onClick={handleStart}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '28px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        animation: 'introFadeIn 1s ease forwards',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: '#800020',
                        fontFamily: 'sans-serif',
                    }}>
                        World Invention Competition &amp; Exhibition
                    </div>

                    <div style={{
                        fontSize: 'clamp(48px, 10vw, 90px)',
                        fontWeight: 900,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                    }}>
                        WICE<span style={{ color: '#800020' }}>BD</span>
                    </div>

                    {/* Pulsing play button */}
                    <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'rgba(128,0,32,0.15)',
                        border: '2px solid rgba(128,0,32,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'introPulse 2s ease-in-out infinite',
                        marginTop: '8px',
                    }}>
                        <div style={{
                            width: 0,
                            height: 0,
                            borderTop: '14px solid transparent',
                            borderBottom: '14px solid transparent',
                            borderLeft: '24px solid #fff',
                            marginLeft: '5px',
                        }} />
                    </div>

                    <div style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: 'sans-serif',
                    }}>
                        Click anywhere to enter
                    </div>
                </div>
            )}

            {/* Skip button during playback */}
            {phase === 'playing' && (
                <button
                    onClick={handleEnded}
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        right: '36px',
                        background: 'rgba(0,0,0,0.55)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: 'rgba(255,255,255,0.75)',
                        padding: '8px 22px',
                        borderRadius: '50px',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'sans-serif',
                        zIndex: 2,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(128,0,32,0.6)';
                        e.currentTarget.style.borderColor = '#800020';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.55)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    }}
                >
                    Skip ›
                </button>
            )}

            <style>{`
                @keyframes introPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(128,0,32,0.4); }
                    50%       { transform: scale(1.08); box-shadow: 0 0 0 16px rgba(128,0,32,0); }
                }
                @keyframes introFadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default IntroVideo;
