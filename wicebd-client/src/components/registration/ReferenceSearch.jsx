import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

/* Shared field outline style (matches the forms) */
const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

/**
 * ReferenceSearch
 * Props:
 *  type        'ca' | 'club'
 *  value       currently selected code string
 *  onChange    (code, label) => void  — called on select / clear
 *  error       string | undefined
 */
export default function ReferenceSearch({ type, value, onChange, error, disabled = false }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const endpoint = type === 'ca'
        ? `${backendUrl}/api/campus-ambassador/search`
        : `${backendUrl}/api/club-partner/search`;

    const label = type === 'ca' ? 'Campus Ambassador' : 'Club Partner';
    const placeholder = type === 'ca'
        ? 'Search by name or code (e.g. CA-Tamim-001)'
        : 'Search by club name or code (e.g. CL-Mechatronics-001)';

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* Debounced search */
    const handleInput = e => {
        const q = e.target.value;
        setQuery(q);
        if (!q.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get(endpoint, { params: { q } });
                setResults(res.data || []);
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const select = item => {
        const lbl = type === 'ca'
            ? `${item.name} — ${item.institution_name}`
            : `${item.club_name} — ${item.institution_name}`;
        setSelectedLabel(lbl);
        setQuery(item.code);
        setOpen(false);
        onChange(item.code, lbl);
    };

    const clear = () => {
        setQuery('');
        setSelectedLabel('');
        setResults([]);
        setOpen(false);
        onChange('', '');
    };

    return (
        <Box ref={wrapperRef} sx={{ position: 'relative' }}>
            {/* Label */}
            <Typography sx={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', mb: '6px',
            }}>
                {label} <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', fontSize: '10px' }}>(Optional)</span>
            </Typography>

            {/* Input row */}
            <Box sx={{ position: 'relative' }}>
                <input
                    value={query}
                    onChange={disabled ? undefined : handleInput}
                    onFocus={() => !disabled && results.length && setOpen(true)}
                    placeholder={disabled ? 'Select the other reference first to enable this' : placeholder}
                    disabled={disabled}
                    style={{
                        ...inputStyle,
                        borderColor: error ? '#ff7070' : (open ? '#800020' : 'rgba(255,255,255,0.14)'),
                        paddingRight: value ? '40px' : '16px',
                        opacity: disabled ? 0.38 : 1,
                        cursor: disabled ? 'not-allowed' : 'text',
                    }}
                />
                {/* Loading spinner */}
                {loading && (
                    <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                        <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.4)' }} />
                    </Box>
                )}
                {/* Clear button */}
                {value && !loading && (
                    <button
                        type="button"
                        onClick={clear}
                        style={{
                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(255,255,255,0.4)', fontSize: '16px', lineHeight: 1, padding: '2px 4px',
                        }}
                        title="Clear selection"
                    >×</button>
                )}
            </Box>

            {/* Error text */}
            {error && (
                <Typography sx={{ fontSize: '11px', color: '#ff7070', mt: '4px' }}>{error}</Typography>
            )}

            {/* Dropdown results */}
            {open && results.length > 0 && (
                <Box sx={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                    background: '#1a000a',
                    border: '1px solid rgba(128,0,32,0.35)',
                    borderRadius: '10px',
                    mt: '4px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                }}>
                    {results.map(item => (
                        <Box
                            key={item.id}
                            onClick={() => select(item)}
                            sx={{
                                px: 2, py: 1.5, cursor: 'pointer',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                '&:last-child': { borderBottom: 'none' },
                                '&:hover': { background: 'rgba(128,0,32,0.2)' },
                                transition: 'background 0.15s',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                                    {type === 'ca' ? item.name : item.club_name}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em',
                                    color: '#c0002a', background: 'rgba(128,0,32,0.15)',
                                    px: '8px', py: '2px', borderRadius: '20px',
                                    flexShrink: 0,
                                }}>
                                    {item.code}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', mt: '2px' }}>
                                {item.institution_name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* No results message */}
            {open && !loading && query.trim() && results.length === 0 && (
                <Box sx={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                    background: '#1a000a', border: '1px solid rgba(128,0,32,0.25)',
                    borderRadius: '10px', mt: '4px', px: 2, py: 1.5,
                }}>
                    <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                        No results found for "{query}"
                    </Typography>
                </Box>
            )}

            {/* Selected card */}
            {value && selectedLabel && (
                <Box sx={{
                    mt: 1.5, px: 2, py: 1.5,
                    borderRadius: '10px',
                    background: 'rgba(128,0,32,0.1)',
                    border: '1px solid rgba(128,0,32,0.28)',
                    display: 'flex', alignItems: 'center', gap: 1.5,
                }}>
                    <Box sx={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#10b981', flexShrink: 0,
                        boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                    }} />
                    <Box>
                        <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', mb: '1px' }}>
                            Selected {label}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                            {selectedLabel}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#c0002a', fontWeight: 700, mt: '2px' }}>
                            {value}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
