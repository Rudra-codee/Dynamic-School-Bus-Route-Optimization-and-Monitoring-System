import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bus, Users, ShieldCheck, ArrowRight, CheckCircle2, XCircle,
  Zap, Shield, Globe, Cpu, MapPin, Navigation, Clock, Star
} from 'lucide-react';
import Navbar from '../components/Navbar';

/* ─── Design Tokens ─── */
const Y = '#FFC107';       // School Bus Yellow
const YD = '#FFB300';      // Yellow Darker (hover)
const DARK = '#1a1a1a';
const GRAY = '#6b7280';
const LIGHT_BG = '#FAFAF8';

/* ─── Reusable pill badge ─── */
const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 16px',
    background: `${Y}22`,
    border: `1.5px solid ${Y}`,
    borderRadius: '999px',
    color: '#92610a',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }}>
    {children}
  </span>
);

const Home: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: LIGHT_BG,
      color: DARK,
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      overflowX: 'hidden',
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <Navbar />

      {/* ─────────── HERO ─────────── */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '100px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Background blob */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%',
          transform: 'translateX(-50%)',
          width: '900px', height: '700px',
          background: `radial-gradient(ellipse, ${Y}22 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        {/* Decorative dashes – top left */}
        <svg style={{ position: 'absolute', top: '80px', left: '40px', opacity: 0.15 }} width="120" height="120" fill="none">
          <circle cx="8" cy="8" r="4" fill={Y} />
          <circle cx="40" cy="8" r="4" fill={Y} />
          <circle cx="72" cy="8" r="4" fill={Y} />
          <circle cx="8" cy="40" r="4" fill={Y} />
          <circle cx="40" cy="40" r="4" fill={Y} />
          <circle cx="72" cy="40" r="4" fill={Y} />
          <circle cx="8" cy="72" r="4" fill={Y} />
          <circle cx="40" cy="72" r="4" fill={Y} />
          <circle cx="72" cy="72" r="4" fill={Y} />
        </svg>
        {/* Decorative dashes – bottom right */}
        <svg style={{ position: 'absolute', bottom: '60px', right: '40px', opacity: 0.15 }} width="120" height="120" fill="none">
          <circle cx="8" cy="8" r="4" fill={Y} />
          <circle cx="40" cy="8" r="4" fill={Y} />
          <circle cx="72" cy="8" r="4" fill={Y} />
          <circle cx="8" cy="40" r="4" fill={Y} />
          <circle cx="40" cy="40" r="4" fill={Y} />
          <circle cx="72" cy="40" r="4" fill={Y} />
          <circle cx="8" cy="72" r="4" fill={Y} />
          <circle cx="40" cy="72" r="4" fill={Y} />
          <circle cx="72" cy="72" r="4" fill={Y} />
        </svg>

        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <Pill><Star size={12} fill="#92610a" /> #1 School Transit Platform</Pill>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginTop: '1.5rem',
            marginBottom: '1.25rem',
          }}>
            Smart Routes.{' '}
            <span style={{
              position: 'relative',
              display: 'inline-block',
              color: DARK,
            }}>
              Safe Kids.
              <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0 8 Q50 0 100 8 Q150 16 200 8" stroke={Y} strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            {' '}Every Day.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: GRAY,
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            School Bus OS dynamically optimizes routes based on real attendance — 
            eliminating empty stops, reducing fuel waste, and keeping every parent informed in real time.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link
              to="/admin"
              id="hero-get-started"
              style={{
                padding: '14px 32px',
                background: Y,
                border: `2px solid ${Y}`,
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1rem',
                color: DARK,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 8px 24px ${Y}55`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = YD;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 28px ${Y}66`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = Y;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${Y}55`;
              }}
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/parent"
              id="hero-view-demo"
              style={{
                padding: '14px 32px',
                background: 'white',
                border: `2px solid #e5e7eb`,
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                color: DARK,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = Y;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              View Live Demo
            </Link>
          </div>

          {/* Social proof bar */}
          <div style={{
            marginTop: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'center',
            color: GRAY,
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {['500+ Schools Onboarded', '1M+ Students Tracked', '99.8% Uptime'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CheckCircle2 size={16} color={Y} fill={Y} style={{ flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Bus Illustration */}
        <div style={{
          marginTop: '4rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            border: '2px solid #f3f4f6',
            boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
            padding: '2.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '520px',
            width: '90%',
          }}>
            {/* Route visualization */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: '100%' }}>
              {['Home A', 'Home B', 'Home C', 'School'].map((stop, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: i === arr.length - 1 ? 0 : 1,
                  }}>
                    <div style={{
                      width: i === arr.length - 1 ? '48px' : '36px',
                      height: i === arr.length - 1 ? '48px' : '36px',
                      background: i === arr.length - 1 ? DARK : Y,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: i === arr.length - 1 ? `0 4px 12px ${DARK}44` : `0 4px 12px ${Y}66`,
                    }}>
                      {i === arr.length - 1
                        ? <Bus size={22} color="white" />
                        : <MapPin size={16} color={DARK} />
                      }
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GRAY, marginTop: '6px', whiteSpace: 'nowrap' }}>
                      {stop}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '3px',
                      background: `repeating-linear-gradient(90deg, ${Y} 0, ${Y} 8px, transparent 8px, transparent 16px)`,
                      margin: '0 4px',
                      marginBottom: '20px',
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: `${Y}18`,
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#92610a',
            }}>
              <Zap size={14} fill="#92610a" color="#92610a" />
              Route auto-optimized · 2 stops skipped · Saving 12 min
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── PROBLEM VS SOLUTION ─────────── */}
      <section style={{ padding: '80px 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Pill>The Problem</Pill>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Traditional systems are holding schools back
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {/* Problem Card */}
          <div style={{
            background: '#fff5f5',
            border: '2px solid #fecaca',
            borderRadius: '24px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.1 }}>
              <XCircle size={80} color="#ef4444" />
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800, color: '#ef4444', marginBottom: '1.5rem' }}>
              <XCircle size={22} /> Old Way
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Bus stops at empty homes — wasting fuel',
                'Paper registers lost or filled incorrectly',
                'Parents call the school anxiously all morning',
                'No real-time visibility of student boarding',
              ].map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', color: '#6b7280', fontSize: '0.95rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fca5a5', marginTop: '7px', flexShrink: 0 }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div style={{
            background: '#fffbeb',
            border: `2px solid ${Y}`,
            borderRadius: '24px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${Y}33`,
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.12 }}>
              <CheckCircle2 size={80} color={Y} />
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800, color: '#92610a', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={22} color={Y} /> Smart Way
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Routes dynamically skip absent student stops',
                '100% digital — synced to driver instantly',
                'Parents track bus live on their phone',
                'Automated boarding confirmation per student',
              ].map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', color: '#374151', fontSize: '0.95rem', fontWeight: 500 }}>
                  <CheckCircle2 size={18} color={Y} fill={Y} style={{ flexShrink: 0, marginTop: '2px' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS — THE ROAD ─────────── */}
      <section style={{
        padding: '80px 1.5rem 100px',
        background: DARK,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,193,7,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${Y}18, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Pill>How It Works</Pill>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900,
              color: 'white',
              marginTop: '1rem',
              letterSpacing: '-0.02em',
            }}>
              The Road to a Perfect School Run
            </h2>
            <p style={{ color: '#9ca3af', marginTop: '0.75rem', fontSize: '1rem' }}>
              Four simple phases. Zero confusion. Every morning.
            </p>
          </div>

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}>
            {[
              { icon: Clock,      phase: '01', title: 'Mark Attendance',       text: 'Parent taps Present or Absent before 7 AM for their child.' },
              { icon: Zap,        phase: '02', title: 'Auto Route Optimization', text: 'System rebuilds the route instantly, skipping absent stops.' },
              { icon: Navigation, phase: '03', title: 'Driver Execution',        text: 'Driver follows the optimized order with one-tap boarding.' },
              { icon: MapPin,     phase: '04', title: 'Live Tracking',           text: 'Parents watch the bus approach and get boarding confirmation.' },
            ].map(({ icon: Icon, phase, title, text }, i) => (
              <div
                key={i}
                id={`step-${i + 1}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '2rem',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,193,7,0.07)';
                  el.style.borderColor = `${Y}55`;
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.borderColor = 'rgba(255,255,255,0.08)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {/* Yellow step number badge */}
                <div style={{
                  position: 'absolute', top: '-14px', left: '2rem',
                  background: Y,
                  color: DARK,
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '3px 12px',
                  borderRadius: '999px',
                  letterSpacing: '0.08em',
                }}>
                  PHASE {phase}
                </div>

                <div style={{
                  width: '52px', height: '52px',
                  background: `${Y}22`,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                  marginTop: '0.75rem',
                }}>
                  <Icon size={24} color={Y} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginBottom: '0.6rem' }}>
                  {title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.65 }}>{text}</p>

                {/* Connector arrow for non-last items */}
                {i < 3 && (
                  <div style={{
                    display: 'none', // hidden on mobile, shown via CSS below
                  }} className="step-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PERSONA / ROLES ─────────── */}
      <section style={{ padding: '80px 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Pill>Who It's For</Pill>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Built for Everyone in the Loop
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              icon: Users,
              emoji: '👨‍👩‍👧',
              role: 'Parent',
              tagline: 'Peace of mind, every morning',
              color: '#3b82f6',
              lightBg: '#eff6ff',
              border: '#bfdbfe',
              features: ['Live bus location on map', 'Student boarding alerts', 'One-tap attendance marking'],
              to: '/parent',
            },
            {
              icon: Bus,
              emoji: '🚌',
              role: 'Driver',
              tagline: 'Focus on driving, not paperwork',
              color: '#22c55e',
              lightBg: '#f0fdf4',
              border: '#bbf7d0',
              features: ['Auto-optimized stop sequence', 'One-tap boarding log', 'GPS auto-reported'],
              to: '/driver',
            },
            {
              icon: ShieldCheck,
              emoji: '🏫',
              role: 'Admin',
              tagline: 'Total fleet visibility',
              color: '#92610a',
              lightBg: '#fffbeb',
              border: Y,
              features: ['Real-time fleet dashboard', 'System-wide alerts', 'Efficiency reports'],
              to: '/admin',
            },
          ].map(({ emoji, role, tagline, color, lightBg, border, features, to }, i) => (
            <div
              key={i}
              style={{
                background: lightBg,
                border: `2px solid ${border}`,
                borderRadius: '24px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${border}88`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{emoji}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: DARK, marginBottom: '0.25rem' }}>{role}</h3>
              <p style={{ fontSize: '0.875rem', color: GRAY, marginBottom: '1.5rem', fontStyle: 'italic' }}>{tagline}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {features.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                    <CheckCircle2 size={16} color={color} fill={color} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={to}
                style={{
                  marginTop: '2rem',
                  padding: '12px',
                  background: DARK,
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = Y;
                  (e.currentTarget as HTMLElement).style.color = DARK;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = DARK;
                  (e.currentTarget as HTMLElement).style.color = 'white';
                }}
              >
                Open {role} Portal <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── SYSTEM STRENGTHS ─────────── */}
      <section style={{
        margin: '0 1.5rem 80px',
        borderRadius: '28px',
        background: Y,
        padding: '64px 2rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* dot pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: DARK, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Built for Performance. At Every Scale.
          </h2>
          <p style={{ color: '#5c4200', fontWeight: 600, marginBottom: '3rem', fontSize: '1rem' }}>
            Enterprise-grade infrastructure. School-friendly simplicity.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px',
          }}>
            {[
              { icon: Zap,    label: 'Dynamic Routing',   detail: 'Rebuilt every run' },
              { icon: Globe,  label: 'Real-Time GPS',      detail: 'Live telemetry' },
              { icon: Cpu,    label: 'Event-Driven',       detail: 'Instant updates' },
              { icon: Shield, label: 'Scalable Core',      detail: 'Grows with you' },
            ].map(({ icon: Icon, label, detail }, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '18px',
                  padding: '1.75rem 1.25rem',
                  border: '2px solid rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.35)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  background: DARK,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Icon size={22} color={Y} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: DARK }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#5c4200', marginTop: '4px' }}>{detail}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Link
              to="/admin"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px',
                background: DARK,
                borderRadius: '14px',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
            >
              Start Your Free Demo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer style={{
        borderTop: '1px solid #f3f4f6',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div style={{
            width: '28px', height: '28px',
            background: Y,
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bus size={16} color={DARK} />
          </div>
          <span style={{ fontWeight: 800, color: DARK, fontSize: '0.95rem' }}>School Bus OS</span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>
          © 2026 School Bus OS · Privacy Policy · Terms of Service
        </p>
      </footer>
    </div>
  );
};

export default Home;
