import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Send, Image as ImageIcon } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Education', 'Travel', 'Food', 'Other'];

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.authorId !== user.id) {
            navigate('/');
            return;
          }
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || CATEGORIES[0]);
          if (data.imageUrl) {
            setPreview(`http://localhost:5000${data.imageUrl}`);
          }
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
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (res.ok) {
        navigate(`/post/${id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-header"><h2>Loading...</h2></div>;

  return (
    <div className="glass" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Edit Post</h2>
      
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.2rem', padding: '1rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select 
            className="form-control" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
              <ImageIcon size={18} />
              Change Image
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
            </label>
            {image && <span style={{ color: 'var(--color-text-muted)' }}>{image.name}</span>}
          </div>
          {preview && (
            <div style={{ marginTop: '1rem' }}>
              <img src={preview} alt="Preview" style={{ maxHeight: '300px', borderRadius: 'var(--radius)', objectFit: 'cover', width: '100%' }} />
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '4rem' }}>
          <label className="form-label">Content</label>
          <textarea 
            className="form-control"
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            style={{ height: '350px', width: '100%', padding: '1rem', fontSize: '1rem', resize: 'vertical' }}
            placeholder="Write your story here (HTML is supported)..."
            required
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate(`/post/${id}`)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : <><Send size={18} /> Update</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
