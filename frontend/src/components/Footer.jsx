import { Heart, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer glass" style={{ marginTop: 'auto', padding: '3rem 0', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', borderTop: '1px solid rgba(139, 92, 246, 0.3)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="navbar-brand" style={{ fontSize: '1.5rem' }}>
          VividBlog
        </Link>
        
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: '400px' }}>
          A platform to share ideas, explore concepts, and connect with other creative minds across the globe.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <Globe size={24} />
          </a>
          <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#1DA1F2'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
            <Mail size={24} />
          </a>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', width: '100%', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Dev Local IoT LTD. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            <a href="https://linktr.ee/sudhanshumaharathi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              Connect with the developer
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Made with <Heart size={14} color="var(--color-secondary)" fill="var(--color-secondary)" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
