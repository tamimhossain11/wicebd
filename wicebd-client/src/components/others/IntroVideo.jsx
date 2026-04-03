import { useRef, useEffect, useState } from 'react';

/**
 * IntroVideo
 * Always autoplays muted in a centered smaller window.
 * Fades out when the video ends or user clicks Skip / presses Escape.
 */
const IntroVideo = ({ onComplete }) => {
    const videoRef = useRef(null);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 2.0;
            videoRef.current.play().catch(() => handleEnded());
        }
    }, []);

    const handleEnded = () => {
        if (fading) return;
        setFading(true);
        setTimeout(onComplete, 700);
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') handleEnded();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [fading]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.7s ease',
            }}
        >
            {/* Blurred background panel */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0008 50%, #0a0a0a 100%)',
                backdropFilter: 'blur(12px)',
            }} />

            {/* Centered video box */}
            <div style={{
                position: 'relative',
                width: 'min(55vw, 620px)',
                aspectRatio: '16/9',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 0 0 1px rgba(128,0,32,0.3), 0 32px 100px rgba(0,0,0,0.85)',
                zIndex: 1,
            }}>
                <video
                    ref={videoRef}
                    src="/videos/intro.MP4"
                    playsInline
                    muted
                    onEnded={handleEnded}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />

                {/* Skip button */}
                <button
                    onClick={handleEnded}
                    style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '18px',
                        background: 'rgba(0,0,0,0.55)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: 'rgba(255,255,255,0.75)',
                        padding: '6px 18px',
                        borderRadius: '50px',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'sans-serif',
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
            </div>
        </div>
    );
};

export default IntroVideo;
