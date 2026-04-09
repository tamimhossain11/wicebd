import React, { useEffect, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useTimer } from 'react-timer-hook';

/* ── YouTube background via IFrame API — loops t=5 to t=20 ── */
const YoutubeBg = () => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const intervalRef = useRef(null);

    const VIDEO_ID = 'J5hMpcSxsMk';
    const START = 5;
    const END = 20;

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }

        const initPlayer = () => {
            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: VIDEO_ID,
                playerVars: {
                    autoplay: 1, mute: 1, controls: 0, rel: 0,
                    modestbranding: 1, showinfo: 0, iv_load_policy: 3,
                    disablekb: 1, start: START, end: END, loop: 0,
                },
                events: {
                    onReady: (e) => {
                        e.target.playVideo();
                        intervalRef.current = setInterval(() => {
                            if (e.target.getCurrentTime?.() >= END) {
                                e.target.seekTo(START, true);
                                e.target.playVideo();
                            }
                        }, 500);
                    },
                    onStateChange: (e) => {
                        if (e.data === window.YT.PlayerState.ENDED) {
                            e.target.seekTo(START, true);
                            e.target.playVideo();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => { if (prev) prev(); initPlayer(); };
        }

        return () => { clearInterval(intervalRef.current); playerRef.current?.destroy?.(); };
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                background: 'linear-gradient(to bottom, rgba(4,0,10,0.62) 0%, rgba(4,0,10,0.45) 60%, rgba(4,0,10,0.80) 100%)',
            }} />
            <div ref={containerRef} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)',
                transform: 'translate(-50%, -50%)',
            }} />
        </div>
    );
};

/* ── Subtle particle overlay ── */
const ParticleOverlay = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const NODES = Array.from({ length: 45 }, () => ({
            x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.4 + 0.4, pulse: Math.random() * Math.PI * 2,
        }));

        const draw = () => {
            const w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            NODES.forEach(n => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.022;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            });
            for (let i = 0; i < NODES.length; i++) {
                for (let j = i + 1; j < NODES.length; j++) {
                    const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath(); ctx.moveTo(NODES[i].x, NODES[i].y); ctx.lineTo(NODES[j].x, NODES[j].y);
                        ctx.strokeStyle = `rgba(200,0,40,${(1 - dist / 120) * 0.12})`; ctx.lineWidth = 0.6; ctx.stroke();
                    }
                }
            }
            NODES.forEach(n => {
                const p = Math.sin(n.pulse) * 0.5 + 0.5;
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r + p * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,30,60,${0.25 + p * 0.2})`; ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none',
        }} />
    );
};

/* ── Countdown bottom bar ── */
const CountdownBar = ({ expiryTimestamp }) => {
    const { seconds, minutes, hours, days } = useTimer({
        expiryTimestamp,
        onExpire: () => {},
    });

    const pad = (n) => String(n).padStart(2, '0');

    const units = [
        { value: pad(days),    label: 'Days' },
        { value: pad(hours),   label: 'Hours' },
        { value: pad(minutes), label: 'Minutes' },
        { value: pad(seconds), label: 'Seconds' },
    ];

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'rgba(4,0,10,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
            <div style={{
                maxWidth: 1300,
                margin: '0 auto',
                padding: '0 40px',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                minHeight: 96,
            }}>
                {/* Left — event label */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    paddingRight: 32,
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                }}>
                    <div style={{
                        width: 4,
                        height: 36,
                        background: 'linear-gradient(180deg, #e94560, #800020)',
                        borderRadius: 2,
                        flexShrink: 0,
                    }} />
                    <div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>
                            Event Countdown
                        </div>
                        <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
                            8th Edition · WICEBD
                        </div>
                    </div>
                </div>

                {/* Centre — timer units */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center' }}>
                    {units.map((u, i) => (
                        <React.Fragment key={i}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '0 28px',
                            }}>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                                    fontWeight: 800,
                                    color: '#fff',
                                    lineHeight: 1,
                                    letterSpacing: '0.04em',
                                }}>
                                    {u.value}
                                </span>
                                <span style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: '#800020',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.18em',
                                    marginTop: 5,
                                }}>
                                    {u.label}
                                </span>
                            </div>
                            {i < units.length - 1 && (
                                <div style={{
                                    color: 'rgba(255,255,255,0.18)',
                                    fontSize: 28,
                                    fontWeight: 300,
                                    lineHeight: 1,
                                    userSelect: 'none',
                                }}>
                                    :
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Right — CTAs */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    paddingLeft: 32,
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                }}>
                    <Link
                        to="/buy-ticket#"
                        style={{
                            background: 'linear-gradient(135deg, #800020, #c0002a)',
                            color: '#fff',
                            padding: '12px 28px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 700,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 20px rgba(128,0,32,0.5)',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Register Now
                    </Link>
                    <Link
                        to="/about-us#"
                        style={{
                            color: 'rgba(255,255,255,0.65)',
                            fontSize: 13,
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.04em',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                    >
                        Learn More →
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ── Banner ── */
const BannerV2 = () => {
    const time = new Date('May 9 2026 08:00:00');

    return (
        <section className="banner-conference" style={{ position: 'relative' }}>
            <YoutubeBg />
            <ParticleOverlay />

            <div className="hero-orbs" aria-hidden="true">
                <span className="hero-orb hero-orb-1"></span>
                <span className="hero-orb hero-orb-2"></span>
                <span className="hero-orb hero-orb-3"></span>
            </div>

            {/* Main content — horizontally centred, close to timer */}
            <div style={{
                position: 'absolute',
                bottom: 106,
                left: 0,
                right: 0,
                zIndex: 10,
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'center',
            }}>
                {/* Animated border wrapper */}
                <div className="banner-glass-border" style={{ borderRadius: 18, padding: 1.5, width: '100%', maxWidth: 1380 }}>
                    <div className="content-box content-box-blur" style={{
                        borderRadius: 16,
                        width: '100%',
                        maxWidth: '100%',
                        padding: '14px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 48,
                        boxSizing: 'border-box',
                    }}>
                        {/* Left — text */}
                        <div style={{ flex: 1 }}>
                            <span className="title">8th Edition &nbsp;·&nbsp; Date TBA &nbsp;·&nbsp; Dhaka</span>
                            <h2 style={{ margin: '12px 0 0' }}>World Invention<br />Competition &amp; Exhibition<br />Bangladesh</h2>
                        </div>

                        {/* Divider */}
                        <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                        {/* Right — subtitle */}
                        <div style={{ flex: 1 }}>
                            <p className="banner-subtitle" style={{ margin: 0 }}>
                                The 8th edition of WICEBD — showcasing innovation, science &amp; technology
                                from Bangladesh to the global stage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll hint */}
            <div style={{
                position: 'absolute', bottom: 112, right: 52,
                zIndex: 10, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.3)', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
                <span style={{
                    width: 1, height: 40,
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))',
                }} />
                Scroll
            </div>

            <style>{`
                .banner-glass-border {
                    background: linear-gradient(
                        90deg,
                        rgba(128,0,32,0.15) 0%,
                        rgba(233,69,96,0.7) 25%,
                        rgba(255,255,255,0.35) 50%,
                        rgba(233,69,96,0.7) 75%,
                        rgba(128,0,32,0.15) 100%
                    );
                    background-size: 250% 100%;
                    animation: bannerBorderSlide 3.5s linear infinite;
                }
                @keyframes bannerBorderSlide {
                    0%   { background-position: 0%   50%; }
                    100% { background-position: 250% 50%; }
                }
            `}</style>

            {/* Countdown + CTA bar pinned to the bottom */}
            <CountdownBar expiryTimestamp={time} />
        </section>
    );
};

export default BannerV2;
