import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'DRIVER') return '/driver';
    return '/parent';
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #FFC107' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#FFC107',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,193,7,0.4)',
            }}
          >
            <Bus size={22} color="#1a1a1a" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#1a1a1a',
              letterSpacing: '-0.03em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            School Bus <span style={{ color: '#FFC107' }}>OS</span>
          </span>
        </Link>

        {/* Desktop Nav Buttons */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          className="desktop-nav"
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                style={{
                  padding: '10px 22px',
                  border: '2px solid #1a1a1a',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#FFC107';
                  (e.currentTarget as HTMLElement).style.color = '#FFC107';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a';
                  (e.currentTarget as HTMLElement).style.color = '#1a1a1a';
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '10px 22px',
                  background: '#FFC107',
                  border: '2px solid #FFC107',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(255,193,7,0.35)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#FFB300';
                  (e.currentTarget as HTMLElement).style.borderColor = '#FFB300';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(255,193,7,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#FFC107';
                  (e.currentTarget as HTMLElement).style.borderColor = '#FFC107';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(255,193,7,0.35)';
                }}
              >
                Get Started →
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <UserIcon size={16} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                <span className="text-xs font-bold text-[#FFC107] bg-yellow-50 px-2 py-0.5 rounded-md ml-1 border border-yellow-100 uppercase">
                  {user?.role}
                </span>
              </div>
              <Link
                to={getDashboardPath()}
                className="px-5 py-2.5 bg-[#FFC107] border-2 border-[#FFC107] rounded-xl font-bold text-sm text-[#1a1a1a] shadow-md shadow-yellow-400/30 hover:bg-[#FFB300] hover:border-[#FFB300] transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#1a1a1a',
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid #f5f5f5',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
          className="mobile-menu"
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 20px',
                  border: '2px solid #1a1a1a',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 20px',
                  background: '#FFC107',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Get Started →
              </Link>
            </>
          ) : (
            <>
              <div className="py-2 flex items-center justify-center gap-2 mb-2">
                <span className="font-semibold text-gray-700">{user?.name}</span>
                <span className="text-xs font-bold text-[#FFC107] bg-yellow-50 px-2 py-0.5 rounded-md uppercase">
                  {user?.role}
                </span>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-3 bg-[#FFC107] font-bold text-[#1a1a1a] rounded-xl shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full flex justify-center items-center gap-2 py-3 border-2 border-gray-200 font-bold text-gray-600 rounded-xl"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
