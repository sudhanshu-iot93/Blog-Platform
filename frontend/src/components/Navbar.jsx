import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PenSquare, LogOut, LogIn, UserPlus, User, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-nav">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          <div style={{ width: '24px', height: '24px', background: 'var(--color-text)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--color-background)', fontSize: '0.8rem' }}>A</span>
          </div>
          Aura
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          {loading ? (
            <div style={{ width: '100px' }}></div>
          ) : user ? (
            <div className="dropdown-container" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.8rem', 
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text)', padding: '0.4rem'
                }}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <User size={16} color="var(--color-text-muted)" />
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user.username}</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div style={{ padding: '0.5rem 0.8rem', marginBottom: '0.2rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Signed in as</p>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text)' }}>{user.email || user.username}</p>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/create-post" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <PenSquare size={16} />
                    Write a Post
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} />
                    My Dashboard
                  </Link>
                  <button className="dropdown-item">
                    <Settings size={16} />
                    Settings
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="dropdown-item" style={{ color: '#ef4444' }}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', border: 'none' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
