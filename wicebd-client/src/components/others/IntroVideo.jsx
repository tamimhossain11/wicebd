import { useEffect, useState } from 'react';

const GIF_DURATION_MS = 1200;

const IntroVideo = ({ onComplete }) => {
    const [fading, setFading] = useState(false);

    const handleEnded = () => {
        if (fading) return;
        setFading(true);
        setTimeout(onComplete, 350);
    };

    useEffect(() => {
        const timer = setTimeout(handleEnded, GIF_DURATION_MS);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleEnded(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [fading]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.35s ease',
        }}>
            <img
                src="/intro-main.gif"
                alt=""
                style={{
                    maxWidth: '420px',
                    maxHeight: '420px',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    imageRendering: 'auto',
                }}
            />
        </div>
    );
};

export default IntroVideo;
