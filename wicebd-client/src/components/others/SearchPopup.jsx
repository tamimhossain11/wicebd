import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Searchable content index ─── */
const CONTENT = [
  { title: 'Home',                      desc: 'WICE Bangladesh main landing page',                       path: '/',                        tags: 'wice home welcome',               icon: '🏠', cat: 'Page' },
  { title: 'About WICE',                desc: 'Learn about WICE Bangladesh and its mission',             path: '/about-us',                tags: 'about mission vision wice',       icon: '📖', cat: 'Page' },
  { title: 'Event Schedule',            desc: 'Full agenda and timeline of all events',                  path: '/schedule',                tags: 'schedule agenda timeline program', icon: '📅', cat: 'Event' },
  { title: 'Speakers & Advisors',       desc: 'Keynote speakers, judges and academic advisors',          path: '/speakers',                tags: 'speakers judges advisors keynote', icon: '🎤', cat: 'People' },
  { title: 'Registration',              desc: 'Register for project, wall magazine or olympiad',         path: '/registration',            tags: 'register signup competition team', icon: '📝', cat: 'Registration' },
  { title: 'Project Competition',       desc: 'Register your team for the project competition',          path: '/registration',            tags: 'project team leader competition',  icon: '🏆', cat: 'Registration' },
  { title: 'Wall Magazine',             desc: 'Register for the wall magazine competition',              path: '/registration',            tags: 'wall magazine design creative',    icon: '📰', cat: 'Registration' },
  { title: 'Olympiad',                  desc: 'WICE Olympiad individual competition registration',       path: '/registration',            tags: 'olympiad individual quiz science', icon: '🎓', cat: 'Registration' },
  { title: 'Selected Teams',            desc: 'View teams selected for the competition',                 path: '/selected-teams',          tags: 'selected teams shortlist result',  icon: '✅', cat: 'Result' },
  { title: 'Announcements',             desc: 'Latest news, updates and important notices',              path: '/announcements',           tags: 'announcement news update notice',  icon: '📢', cat: 'News' },
  { title: 'Gallery',                   desc: 'Photo gallery from past WICE events',                    path: '/gallery',                 tags: 'gallery photos pictures moments',  icon: '🖼️', cat: 'Media' },
  { title: 'International Team',        desc: 'Meet the international organizing team',                  path: '/international-team',      tags: 'international team organizing',    icon: '🌍', cat: 'People' },
  { title: 'Organizing Panel',          desc: 'Meet the local organizing committee',                     path: '/organizing-panel',        tags: 'organizing committee panel local', icon: '👥', cat: 'People' },
  { title: 'Partners & Sponsors',       desc: 'Our valued partners, sponsors and collaborators',         path: '/partners',                tags: 'partners sponsors collaborators',  icon: '🤝', cat: 'About' },
  { title: 'Surprise Segment',          desc: 'Special surprise event segment',                          path: '/surprise-segment',        tags: 'surprise special segment activity', icon: '🎉', cat: 'Event' },
  { title: 'Contact Us',               desc: 'Get in touch with the WICE team',                         path: '/contact',                 tags: 'contact email phone reach us',     icon: '📬', cat: 'Page' },
  { title: 'FAQs',                     desc: 'Frequently asked questions and answers',                  path: '/faqs',                    tags: 'faq questions answers help',       icon: '❓', cat: 'Help' },
  { title: 'Pricing & Fees',           desc: 'Registration fees and payment information',               path: '/pricing',                 tags: 'pricing fee payment cost amount',  icon: '💳', cat: 'Info' },
  { title: 'Sign In',                  desc: 'Log in to your WICE participant account',                 path: '/sign-in',                 tags: 'login signin account password',    icon: '🔐', cat: 'Account' },
  { title: 'Create Account',           desc: 'Register for a WICE participant portal account',          path: '/sign-up',                 tags: 'signup register account create',   icon: '👤', cat: 'Account' },
  { title: 'My Dashboard',             desc: 'View your registration details and event pass',           path: '/dashboard',               tags: 'dashboard profile my account pass', icon: '🎫', cat: 'Account' },
  { title: 'Blog',                     desc: 'Articles, stories and event coverage',                    path: '/blog-grid',               tags: 'blog articles news stories posts', icon: '✍️', cat: 'News' },
  { title: 'Privacy Policy',           desc: 'How we handle your personal data',                        path: '/privacy-policy',          tags: 'privacy data gdpr policy personal', icon: '🔒', cat: 'Legal' },
  { title: 'Terms & Conditions',       desc: 'Terms of service and usage guidelines',                   path: '/terms-and-conditions',    tags: 'terms conditions rules guidelines', icon: '📋', cat: 'Legal' },
  { title: 'Refund Policy',            desc: 'Return and refund policy for registrations',              path: '/return-refund-policy',    tags: 'refund return cancel policy',      icon: '↩️', cat: 'Legal' },
];

const CAT_COLORS = {
  Page:         '#6c63ff',
  Event:        '#f59e0b',
  People:       '#06b6d4',
  Registration: '#10b981',
  Result:       '#10b981',
  News:         '#e94560',
  Media:        '#a855f7',
  About:        '#06b6d4',
  Help:         '#f59e0b',
  Info:         '#6c63ff',
  Account:      '#e94560',
  Legal:        'rgba(255,255,255,0.4)',
};

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#e9456025', color: '#e94560', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const SearchPopup = ({ openSearch, searchClose }) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = query.trim().length > 0
    ? CONTENT.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.tags.toLowerCase().includes(q) ||
          item.cat.toLowerCase().includes(q)
        );
      })
    : CONTENT;

  /* Focus input when popup opens */
  useEffect(() => {
    if (openSearch) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setCursor(0);
    }
  }, [openSearch]);

  /* Reset cursor when results change */
  useEffect(() => { setCursor(0); }, [query]);

  /* Keyboard: Escape, ArrowUp, ArrowDown, Enter */
  const handleKeyDown = useCallback((e) => {
    if (!openSearch) return;
    if (e.key === 'Escape') { searchClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && results[cursor]) { go(results[cursor].path); }
  }, [openSearch, results, cursor]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* Scroll active item into view */
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const go = (path) => {
    searchClose();
    setQuery('');
    navigate(path);
  };

  if (!openSearch) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={searchClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 94vw)', zIndex: 9999,
        background: '#0e0e1c',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(233,69,96,0.15)',
        overflow: 'hidden',
        animation: 'searchSlideIn 0.18s ease',
      }}>

        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, events, speakers…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 16, fontFamily: 'inherit',
              caretColor: '#e94560',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          <kbd style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, padding: '2px 7px', fontSize: 11, color: 'rgba(255,255,255,0.35)',
            fontFamily: 'monospace', cursor: 'pointer',
          }} onClick={searchClose}>esc</kbd>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          style={{ maxHeight: '58vh', overflowY: 'auto', padding: '8px 0' }}
        >
          {results.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              No results for <strong style={{ color: 'rgba(255,255,255,0.5)' }}>"{query}"</strong>
            </div>
          ) : (
            <>
              {query.trim() === '' && (
                <div style={{ padding: '4px 18px 8px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  All Pages
                </div>
              )}
              {results.map((item, i) => {
                const active = i === cursor;
                const catColor = CAT_COLORS[item.cat] || 'rgba(255,255,255,0.4)';
                return (
                  <div
                    key={item.path + item.title}
                    data-idx={i}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(item.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '10px 18px', cursor: 'pointer',
                      background: active ? 'rgba(233,69,96,0.08)' : 'transparent',
                      borderLeft: active ? '3px solid #e94560' : '3px solid transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: active ? 'rgba(233,69,96,0.15)' : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, transition: 'background 0.1s',
                    }}>
                      {item.icon}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.85)', marginBottom: 2 }}>
                        {highlight(item.title, query)}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {highlight(item.desc, query)}
                      </div>
                    </div>

                    {/* Category badge */}
                    <div style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                      color: catColor, background: `${catColor}15`,
                      border: `1px solid ${catColor}30`,
                      borderRadius: 6, padding: '2px 7px',
                    }}>
                      {item.cat}
                    </div>

                    {/* Arrow */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#e94560' : 'rgba(255,255,255,0.15)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div style={{
          padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          {[
            { keys: ['↑', '↓'], label: 'navigate' },
            { keys: ['↵'], label: 'go' },
            { keys: ['esc'], label: 'close' },
          ].map(hint => (
            <div key={hint.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {hint.keys.map(k => (
                <kbd key={k} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4, padding: '1px 6px', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
                }}>{k}</kbd>
              ))}
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{hint.label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes searchSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
};

export default SearchPopup;
