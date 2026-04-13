import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   URL helpers
   ───────────────────────────────────────────── */
function isYouTube(url) {
    return url.includes('youtu.be') || url.includes('youtube.com');
}
function getYouTubeId(url) {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&\s]+)/);
    return m ? m[1] : null;
}

/* ─────────────────────────────────────────────
   YouTube iframe player
   ───────────────────────────────────────────── */
const YouTubePlayer = ({ videoId }) => (
    <div style={{
        position: 'relative', width: '100%', paddingBottom: '56.25%',
        background: '#000', borderRadius: '12px 12px 0 0', overflow: 'hidden',
    }}>
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
    </div>
);

/* ─────────────────────────────────────────────
   Facebook SDK video player component.
   ───────────────────────────────────────────── */
const FBVideoPlayer = ({ url }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && window.FB) {
            window.FB.XFBML.parse(ref.current);
        }
    }, [url]);

    return (
        <div ref={ref} className="mc-fb-sdk-wrap">
            <div
                className="fb-video"
                data-href={url}
                data-width="auto"
                data-allowfullscreen="true"
                data-show-text="false"
            />
        </div>
    );
};

/* ─────────────────────────────────────────────
   Video data — grouped by category
   ───────────────────────────────────────────── */
const TABS = [
   {
        id: 'Promotional Videos',
        label: '🎬 Event Promotional Videos',
        videos: [
            {
                id: 1,
                title: '8th WICEBD — Registration Details',
                desc: 'Exclusive teaser for the 8th World Invention Competition & Exhibition Bangladesh.',
                url: 'https://youtu.be/MUzuEb_qjTQ?si=esI1Qc2B8FmfYTLC',
            },
        ],
    },
    {
        id: 'teasers',
        label: '🎬 Event Teasers',
        videos: [
            {
                id: 1,
                title: '8th WICEBD — Official Teaser',
                desc: 'Exclusive teaser for the 8th World Invention Competition & Exhibition Bangladesh.',
                url: 'https://youtu.be/7O4ItrqKKPk?si=sqVTEccC362xdyWu',
            },
        ],
    },
    {
        id: 'proud',
        label: '🏆 Proud Moment',
        videos: [],
    },
    {
        id: 'before',
        label: '📡 Before Departure',
        videos: [],
    },
    {
        id: 'after',
        label: '🎉 After Return',
        videos: [
            {
                id: 2,
                title: 'Media Reception — After Return (1)',
                desc: "Post-competition coverage celebrating Bangladesh's achievement at the international invention expo.",
                url: 'https://youtu.be/vcPRWWwFw1k?si=kP1z5tJbg912eRI-',
            },
            {
                id: 3,
                title: 'Media Reception — After Return (2)',
                desc: "Celebrating Bangladesh's historic gold medal win at the international competition.",
                url: 'https://youtu.be/t2WLd7htJ3E?si=CNa6mdPNpLKUdnwP',
            },
            {
                id: 4,
                title: 'Media Reception — After Return (3)',
                desc: 'Victory celebration coverage for the WICEBD champions returning home.',
                url: 'https://youtu.be/BONweZ-JAxs?si=RqZVQ1l6H7sQ6avP',
            },
        ],
    },
];

/* ─────────────────────────────────────────────
   Single video card — auto-detects YouTube vs FB
   ───────────────────────────────────────────── */
const VideoCard = ({ video, index }) => {
    const ytId = isYouTube(video.url) ? getYouTubeId(video.url) : null;
    return (
        <motion.div
            className="mc-video-card"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -6 }}
        >
            {ytId ? <YouTubePlayer videoId={ytId} /> : <FBVideoPlayer url={video.url} />}
            <div className="mc-card-info">
                <h4 className="mc-card-title">{video.title}</h4>
                <p className="mc-card-desc">{video.desc}</p>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   Empty / coming-soon state for blank tabs
   ───────────────────────────────────────────── */
const EmptyTabState = () => (
    <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{ textAlign: 'center', padding: '72px 20px' }}
    >
        <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(128,0,32,0.12)', border: '1px solid rgba(128,0,32,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <i className="fa fa-film" style={{ fontSize: 28, color: 'rgba(128,0,32,0.6)' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, margin: 0 }}>Videos coming soon…</p>
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
const MediaCoverage = () => {
    const [activeTab, setActiveTab] = useState('teasers');
    const current = TABS.find((t) => t.id === activeTab);

    // Re-parse FB embeds after tab switch (SDK may not auto-detect new DOM nodes)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.FB) window.FB.XFBML.parse();
        }, 350);
        return () => clearTimeout(timer);
    }, [activeTab]);

    return (
        <section className="media-coverage-section">
            <div className="media-bg-overlay" />

            <div className="auto-container mc-container">
                {/* Section header */}
                <motion.div
                    className="mc-header"
                    initial={{ opacity: 0, y: -24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="media-section-kicker">Video Gallery</span>
                    <h2 className="media-section-title">Media Coverage &amp; Moments</h2>
                    <p className="media-section-sub">
                        From pre-departure buzz to international victory and grand homecoming —
                        every milestone of WICEBD 2024 captured on film.
                    </p>
                </motion.div>

                {/* Tab navigation */}
                <div className="mc-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`mc-tab-btn ${activeTab === tab.id ? 'mc-tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            <span className="mc-tab-count">{tab.videos.length}</span>
                        </button>
                    ))}
                </div>

                {/* Video grid — animated tab switch */}
                <AnimatePresence mode="wait">
                    {current.videos.length === 0 ? (
                        <EmptyTabState key={activeTab + '-empty'} />
                    ) : (
                        <motion.div
                            key={activeTab}
                            className={`mc-grid mc-grid-${current.videos.length === 1 ? 'single' : current.videos.length === 2 ? 'two' : 'multi'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {current.videos.map((video, i) => (
                                <VideoCard key={video.id} video={video} index={i} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default MediaCoverage;
