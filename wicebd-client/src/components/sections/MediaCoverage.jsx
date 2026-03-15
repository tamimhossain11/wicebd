import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Facebook SDK video player component.
   Uses <div class="fb-video"> + FB.XFBML.parse()
   which is the official Facebook embed API and
   supports share/v/ short URLs natively.
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
        id: 'teasers',
        label: '🎬 Event Teasers',
        videos: [
            {
                id: 1,
                title: '8th WICEBD — Official Teaser',
                desc: 'Exclusive teaser for the 8th World Invention Competition & Exhibition Bangladesh.',
                url: 'https://www.facebook.com/share/v/1CCnJKaRKq/',
            },
            {
                id: 2,
                title: 'National Round — Video Report',
                desc: 'Full video report of the WICEBD national round competition.',
                url: 'https://www.facebook.com/share/v/1CPUApzw2U/',
            },
        ],
    },
    {
        id: 'proud',
        label: '🏆 Proud Moment',
        videos: [
            {
                id: 3,
                title: 'Prize Ceremony — SEGI University, Kuala Lumpur',
                desc: 'Our team sings the national anthem after winning prizes at SEGI University, Kuala Lumpur, Malaysia.',
                url: 'https://www.facebook.com/share/v/1CSPHW6Vqe/',
            },
        ],
    },
    {
        id: 'before',
        label: '📡 Before Departure',
        videos: [
            {
                id: 4,
                title: 'Media Coverage — Before Departure (1)',
                desc: 'Media interview and coverage before the team departed for the international competition.',
                url: 'https://www.facebook.com/share/v/17jCCF5u8g/',
            },
            {
                id: 5,
                title: 'Media Coverage — Before Departure (2)',
                desc: 'More pre-departure media spotlight on the WICEBD team.',
                url: 'https://www.facebook.com/share/v/1CKtqpVcJr/',
            },
            {
                id: 6,
                title: 'Media Coverage — Before Departure (3)',
                desc: "Television coverage ahead of the team's international journey.",
                url: 'https://www.facebook.com/share/v/18aYXRQbo6/',
            },
            {
                id: 7,
                title: 'Media Coverage — Before Departure (4)',
                desc: "Pre-competition feature highlighting the team's preparation and vision.",
                url: 'https://www.facebook.com/share/v/1DYecxy3LD/',
            },
            {
                id: 8,
                title: 'Media Coverage — Before Departure (5)',
                desc: 'Final pre-departure news coverage of the WICEBD delegation.',
                url: 'https://www.facebook.com/share/v/17JYvEgtaC/',
            },
        ],
    },
    {
        id: 'after',
        label: '🎉 After Return',
        videos: [
            {
                id: 9,
                title: 'Media Reception — After Return (1)',
                desc: "Grand media reception organized by Firm Fresh upon the team's return to Bangladesh.",
                url: 'https://www.facebook.com/share/v/1CbLTXEtGP/',
            },
            {
                id: 10,
                title: 'Media Reception — After Return (2)',
                desc: "Celebrating Bangladesh's historic achievement at the international invention expo.",
                url: 'https://www.facebook.com/share/v/1AbxozszqU/',
            },
            {
                id: 11,
                title: 'Media Reception — After Return (3)',
                desc: 'Victory celebration coverage organized by Firm Fresh for the WICEBD champions.',
                url: 'https://www.facebook.com/share/v/17Fjo6a9up/',
            },
            {
                id: 12,
                title: 'Media Reception — After Return (4)',
                desc: 'Special media event honouring the gold medal winners from WICEBD.',
                url: 'https://www.facebook.com/share/v/18gSzxwuH4/',
            },
            {
                id: 13,
                title: 'Media Reception — After Return (5)',
                desc: 'Full coverage of the Firm Fresh–organised welcome ceremony for the WICEBD team.',
                url: 'https://www.facebook.com/share/v/18eU6VRxeF/',
            },
        ],
    },
];

/* ─────────────────────────────────────────────
   Single video card
   ───────────────────────────────────────────── */
const VideoCard = ({ video, index }) => (
    <motion.div
        className="mc-video-card"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -6 }}
    >
        {/* Facebook SDK in-page video player */}
        <FBVideoPlayer url={video.url} />

        {/* Card info */}
        <div className="mc-card-info">
            <h4 className="mc-card-title">{video.title}</h4>
            <p className="mc-card-desc">{video.desc}</p>
        </div>
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
                </AnimatePresence>
            </div>
        </section>
    );
};

export default MediaCoverage;
