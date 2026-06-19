import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { Search, User, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Education', 'Travel', 'Food'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);

        const res = await fetch(`http://localhost:5000/api/posts?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const featuredPost = posts.length > 0 && !searchQuery && selectedCategory === 'All' ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '4rem', marginTop: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text)' }}>
          Write. Read. <span style={{ color: 'var(--color-text-muted)' }}>Think.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 3rem auto', fontWeight: 400 }}>
          A minimalist space for high-signal ideas. Join the conversation shaping the future.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '3rem', fontSize: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid',
                  borderColor: selectedCategory === category ? 'var(--color-text)' : 'var(--color-border)',
                  background: selectedCategory === category ? 'var(--color-text)' : 'transparent',
                  color: selectedCategory === category ? 'var(--color-background)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-text)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius)' }}>
          <p>No results found.</p>
        </div>
      ) : (
        <>
          {featuredPost && (
            <div className="featured-post">
              {featuredPost.imageUrl ? (
                <div className="featured-post-img-wrapper">
                  <img src={`http://localhost:5000${featuredPost.imageUrl}`} alt={featuredPost.title} />
                </div>
              ) : (
                <div className="featured-post-img-wrapper" style={{ background: 'var(--color-surface-hover)' }}></div>
              )}
              <div className="card-body">
                {featuredPost.category && (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'block' }}>
                    Featured &mdash; {featuredPost.category}
                  </span>
                )}
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                  <Link to={`/post/${featuredPost.id}`}>{featuredPost.title}</Link>
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} 
                   dangerouslySetInnerHTML={{ __html: featuredPost.content.replace(/<[^>]+>/g, '') }}>
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {featuredPost.author.username}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/post/${featuredPost.id}`} className="btn btn-outline" style={{ alignSelf: 'flex-start', border: '1px solid var(--color-border)' }}>
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          <div className="grid">
            {gridPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
