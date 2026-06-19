import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Calendar, Trash2, Send, Heart, Edit } from 'lucide-react';
import 'react-quill/dist/quill.snow.css'; // For basic styling if needed

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        navigate('/');
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const hasLiked = post.likes.some(like => like.userId === user.id);
        
        let newLikes;
        if (hasLiked) {
          newLikes = post.likes.filter(like => like.userId !== user.id);
        } else {
          newLikes = [...post.likes, { userId: user.id }];
        }
        
        setPost({
          ...post,
          likes: newLikes,
          _count: { ...post._count, likes: newLikes.length }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: commentContent })
      });

      if (res.ok) {
        const newComment = await res.json();
        setPost({ ...post, comments: [...post.comments, newComment] });
        setCommentContent('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add comment');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setPost({
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="page-header"><h2>Loading...</h2></div>;
  if (error || !post) return <div className="page-header"><h2 style={{ color: 'var(--color-error)' }}>{error || 'Post not found'}</h2></div>;

  const hasLiked = user && post.likes.some(like => like.userId === user.id);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="post-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {post.category && (
              <span style={{ display: 'inline-block', padding: '0.2rem 0.8rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                {post.category}
              </span>
            )}
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{post.title}</h1>
          </div>
          
          {user && user.id === post.authorId && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/edit-post/${post.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                <Edit size={16} /> Edit
              </Link>
              <button onClick={handleDeletePost} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div className="card-meta" style={{ marginBottom: 0 }}>
            <span><User size={16} /> {post.author.username}</span>
            <span><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <button onClick={handleToggleLike} className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline'}`} style={{ borderRadius: '100px', padding: '0.4rem 1rem' }}>
            <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} />
            {post._count.likes} {post._count.likes === 1 ? 'Like' : 'Likes'}
          </button>
        </div>

        {post.imageUrl && (
          <img 
            src={`http://localhost:5000${post.imageUrl}`} 
            alt={post.title} 
            className="post-hero-image glass"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      <div className="post-content ql-editor" dangerouslySetInnerHTML={{ __html: post.content }}>
      </div>

      <hr style={{ margin: '4rem 0 2rem', borderColor: 'rgba(255,255,255,0.1)' }} />

      <div className="comments-section">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Comments ({post.comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '3rem' }}>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Share your thoughts..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : <><Send size={18} /> Post Comment</>}
            </button>
          </form>
        ) : (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>You must be logged in to leave a comment.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {post.comments.map(comment => (
            <div key={comment.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {comment.author.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{comment.author.username}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    • {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {user && user.id === comment.authorId && (
                  <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Delete Comment">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p style={{ color: '#cbd5e1' }}>{comment.content}</p>
            </div>
          ))}
          {post.comments.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
