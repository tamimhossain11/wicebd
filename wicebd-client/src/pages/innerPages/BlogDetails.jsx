import React from 'react';
import { motion } from 'framer-motion';
import { HashLink as Link } from 'react-router-hash-link';
import HeaderV1 from '../../components/header/HeaderV1';
import FooterV2 from '../../components/footer/FooterV2';

const blogSections = [
    {
        id: 1, title: 'Introduction', icon: 'fa-star',
        content: `Among global competitions based on science, technology, and innovation, the World Invention Competition and Exhibition (WICE) stands out as a prestigious platform. Talented young innovators from around the world showcase their research, creative thinking, and technological solutions here.

For years, Dreams of Bangladesh (DoB) has been relentlessly working to highlight the talents of Bangladeshi youth on this international stage. In 2023 and 2025, Dreams of Bangladesh consecutively won Gold Medals, proving that with proper guidance, hard work, and dedication, Bangladeshi students can excel in global competitions.

Following this tradition, a special Boot Camp was organized to further prepare selected teams for international participation.`,
        image: '/images/blog/introduction.jpg',
    },
    {
        id: 2, title: 'WICE National Round', icon: 'fa-trophy',
        content: `Dreams of Bangladesh successfully organized the WICE National Round Bangladesh. Teams from across the country presented their innovative projects, competing for the top positions.

From this national round, a select few highly promising teams were chosen to represent Bangladesh at WICE 2025 in Malaysia. However, the goal was not just selection; Dreams of Bangladesh aimed to prepare each team to achieve Gold Medal-worthy projects at the international level.`,
        image: '/images/blog/national-round.jpg',
    },
    {
        id: 3, title: 'Purpose of the Boot Camp', icon: 'fa-bullseye',
        content: `Participating in an international competition requires more than just creating a project. Teams must also:

• Present their projects effectively
• Prepare documentation
• Answer judges' questions confidently
• Showcase the project's functionality

To guide the teams on these aspects, Dreams of Bangladesh organized a Boot Camp at Convention Hall, Mirpur, running from 4 PM to 8 PM.`,
        image: '/images/blog/bootcamp-purpose.jpg',
    },
    {
        id: 4, title: 'Preparation and Effort', icon: 'fa-tools',
        content: `To ensure the Boot Camp's success, the executives and organizers of Dreams of Bangladesh worked tirelessly for 3–4 days.

• Each team received formal invitations
• Guardian permissions were obtained
• The venue was arranged with all necessary technical equipment for project presentations

The event was more than just a program; it became a platform to prepare the future innovators of Bangladesh.`,
        image: '/images/blog/preparation.jpg',
    },
    {
        id: 5, title: 'Boot Camp Activities', icon: 'fa-users',
        content: `The Boot Camp began officially at 4 PM, attended by all DoB executives, organizers, participating teams, and their guardians.

Key activities included:

1. Motivational Session – Inspiring young innovators
2. Project Guidance – How to elevate a project to international standards
3. Q&A Session – Helping participants resolve project-related challenges
4. Experience Sharing – Learning from past Gold Medal winners
5. Networking – Building connections between teams and guardians`,
        image: '/images/blog/activities.jpg',
    },
    {
        id: 6, title: "Executive Director's Guidance", icon: 'fa-user-tie',
        content: `Executive Director Mahadir Islam played a pivotal role in the Boot Camp. He provided detailed guidance to each team, covering:

• How to make a project Gold Medal-worthy
• Strategies for presenting projects to international judges
• Importance of teamwork and time management
• Making innovation solution-oriented`,
        image: '/images/blog/executive-guidance.jpg',
    },
    {
        id: 7, title: "President's Experience Sharing", icon: 'fa-microphone',
        content: `President Moin Uddin shared his experiences with the participants, explaining how Dreams of Bangladesh won consecutive Gold Medals in WICE 2023 and 2025.

Through his session, teams learned:

• How competitions at the international level are conducted
• Types of questions judges might ask
• How to prepare mentally for success`,
        image: '/images/blog/president-sharing.jpg',
    },
    {
        id: 8, title: 'Participant Reactions', icon: 'fa-heart',
        content: `The participating teams were highly enthusiastic about the Boot Camp.

• Many were attending an international platform for the first time, making the experience life-changing
• Guardians expressed satisfaction, seeing their children engage in a professional, safe, and organized environment`,
        image: '/images/blog/participant-reactions.jpg',
    },
    {
        id: 9, title: 'Malaysia Trip Cost Details', icon: 'fa-calculator',
        content: `During the Boot Camp, Executive Director Mahadir Islam provided detailed guidance on the cost of participating in WICE 2025 in Malaysia. He informed that each team member's total cost is approximately BDT 155,000. This includes:

• Flight: Return ticket from Dhaka to Kuala Lumpur
• Accommodation: 4–5 nights in comfortable hotels
• Food and Local Travel: Three meals a day plus transportation
• Project Presentation Materials: Stall setup and display requirements
• Miscellaneous Costs: Visa, insurance, health protocols, and other expenses`,
        image: '/images/blog/malaysia-trip.jpg',
    },
    {
        id: 10, title: 'Future Plans', icon: 'fa-lightbulb',
        content: `Dreams of Bangladesh does not intend to stop with the Boot Camp. Future initiatives include:

• Regular online mentoring sessions
• Specialized coaching for each team
• Resource sharing platforms to help teams refine their projects

These measures aim to ensure that Bangladeshi teams are well-prepared and confident to represent the country at WICE 2025 in Malaysia.`,
        image: '/images/blog/future-plans.jpg',
    },
    {
        id: 11, title: 'Conclusion', icon: 'fa-check-circle',
        content: `The Dreams of Bangladesh Boot Camp was a unique initiative. It not only provided project guidance but also instilled hope, inspiration, and vision among participants and their guardians.

The knowledge and motivation gained from this Boot Camp will guide the teams not only at WICE 2025 but also throughout their lives.

Dreams of Bangladesh firmly believes that Bangladesh's youth will illuminate the global stage with their talent, innovation, and confidence.`,
        image: '/images/blog/conclusion.jpg',
    },
];

const Orb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(128,0,32,0.2),transparent 70%)',
        filter: 'blur(55px)', ...style,
    }} />
);

const glassCard = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
};

const BlogDetails = () => (
    <div className="page-wrapper" style={{ background: 'linear-gradient(160deg,#0a0004 0%,#160008 60%,#220010 100%)' }}>
        <span className="header-span" />
        <HeaderV1 headerStyle="header-style-two" parentMenu="blog" />

        {/* Hero */}
        <section style={{
            position: 'relative', padding: '160px 0 100px', overflow: 'hidden',
            background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
        }}>
            <Orb style={{ width: 560, height: 560, top: -180, right: -100 }} />
            <Orb style={{ width: 360, height: 360, bottom: -120, left: -80 }} />
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div className="auto-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                    style={{
                        width: 90, height: 90, borderRadius: 24, margin: '0 auto 28px',
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 36px rgba(128,0,32,0.5)',
                    }}
                >
                    <i className="fa fa-feather-alt" style={{ color: '#fff', fontSize: 36 }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 700, color: '#c0002a', display: 'block', marginBottom: 12 }}>
                        Dreams of Bangladesh
                    </span>
                    <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(28px,5vw,54px)', margin: '0 0 18px', lineHeight: 1.1 }}>
                        Guiding the<br />
                        <span style={{
                            background: 'linear-gradient(135deg,#fff 0%,#ffb8c8 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Innovators of Tomorrow</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 16, lineHeight: 1.85, maxWidth: 520, margin: '0 auto 36px' }}>
                        Dreams of Bangladesh WICE Boot Camp 2025 — A complete overview.
                    </p>

                    {/* Meta badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                        {[
                            { icon: 'fa-calendar-alt', text: 'August 11, 2025' },
                            { icon: 'fa-map-marker-alt', text: 'Convention Hall, Mirpur' },
                            { icon: 'fa-trophy', text: 'WICE 2025' },
                        ].map(b => (
                            <span key={b.text} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(128,0,32,0.18)', border: '1px solid rgba(128,0,32,0.35)',
                                borderRadius: 50, padding: '10px 20px', color: 'rgba(255,255,255,0.75)', fontSize: 14,
                            }}>
                                <i className={`fa ${b.icon}`} style={{ color: '#c0002a' }} /> {b.text}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Blog content */}
        <section style={{
            background: 'linear-gradient(160deg,#0d0006 0%,#1a000a 55%,#2a0010 100%)',
            padding: '72px 0 100px',
        }}>
            <div className="auto-container" style={{ maxWidth: 960 }}>
                {blogSections.map((section, i) => (
                    <motion.div key={section.id}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        style={{ ...glassCard, marginBottom: 28, overflow: 'hidden' }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: i % 2 === 0 ? '1fr 320px' : '320px 1fr',
                            minHeight: 280,
                        }} className="blog-detail-row">

                            {/* Text */}
                            {i % 2 === 0 ? (
                                <>
                                    <div style={{ padding: '40px 44px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                                background: 'linear-gradient(135deg,#800020,#4f0014)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 6px 18px rgba(128,0,32,0.4)',
                                            }}>
                                                <i className={`fa ${section.icon}`} style={{ color: '#fff', fontSize: 20 }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: '#c0002a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                                                    Section {section.id}
                                                </div>
                                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0, lineHeight: 1.25 }}>
                                                    {section.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
                                            {section.content.split('\n').filter(Boolean).map((para, pi) => (
                                                <p key={pi} style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14.5, lineHeight: 1.85, marginBottom: 10 }}>
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <SectionImage section={section} />
                                </>
                            ) : (
                                <>
                                    <SectionImage section={section} />
                                    <div style={{ padding: '40px 44px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                                background: 'linear-gradient(135deg,#800020,#4f0014)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 6px 18px rgba(128,0,32,0.4)',
                                            }}>
                                                <i className={`fa ${section.icon}`} style={{ color: '#fff', fontSize: 20 }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: '#c0002a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                                                    Section {section.id}
                                                </div>
                                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, margin: 0, lineHeight: 1.25 }}>
                                                    {section.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
                                            {section.content.split('\n').filter(Boolean).map((para, pi) => (
                                                <p key={pi} style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14.5, lineHeight: 1.85, marginBottom: 10 }}>
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                        ...glassCard,
                        borderTop: '3px solid #800020',
                        padding: '64px 48px',
                        textAlign: 'center',
                        marginTop: 16,
                    }}
                >
                    <div style={{
                        width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
                        background: 'linear-gradient(135deg,#800020,#4f0014)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 32px rgba(128,0,32,0.5)',
                    }}>
                        <i className="fa fa-lightbulb" style={{ color: '#fff', fontSize: 32 }} />
                    </div>
                    <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(24px,4vw,38px)', margin: '0 0 16px', lineHeight: 1.2 }}>
                        Ready to Join WICE 2026?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.8, maxWidth: 540, margin: '0 auto 36px' }}>
                        Dreams of Bangladesh continues to guide and support young innovators. Be part of the next generation representing Bangladesh globally.
                    </p>
                    <Link to="/registration#"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            padding: '15px 44px', borderRadius: 50, border: 'none',
                            background: 'linear-gradient(135deg,#800020,#c0002a)',
                            color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
                            boxShadow: '0 8px 28px rgba(128,0,32,0.45)',
                            textDecoration: 'none', transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                    >
                        Register Now <i className="fa fa-arrow-right" />
                    </Link>
                </motion.div>
            </div>
        </section>

        <FooterV2 />
    </div>
);

/* Image panel with icon fallback */
function SectionImage({ section }) {
    return (
        <div style={{
            background: 'linear-gradient(160deg,#1a000a,#2a0010)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 280, overflow: 'hidden', position: 'relative',
        }}>
            <img
                src={section.image}
                alt={section.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Icon shown behind / as fallback */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 32 }}>
                <i className={`fa ${section.icon}`} style={{ fontSize: 52, color: 'rgba(128,0,32,0.35)' }} />
            </div>
        </div>
    );
}

export default BlogDetails;
