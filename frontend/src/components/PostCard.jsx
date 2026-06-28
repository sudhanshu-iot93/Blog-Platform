import { Link } from 'react-router-dom';
import { User, Calendar, MessageSquare, Heart } from 'lucide-react';
import DOMPurify from 'dompurify';

const PostCard = ({ post }) => {
  return (
    <div className="card">
      {post.imageUrl && (
        <div className="card-img-wrapper">
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt={post.title}
            className="card-img-top"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="card-body">
        {post.category && (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'block' }}>
            {post.category}
          </span>
        )}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} 
           dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.replace(/<[^>]+>/g, '')) }}>
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={12} /> {post.author.username}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={12} /> {post._count?.comments || 0}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Heart size={12} /> {post._count?.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
