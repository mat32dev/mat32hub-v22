import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Save, Loader2, Trash2, Plus, X, Instagram } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useLanguage } from '../../context/LanguageContext';

export const AdminInstagramPosts: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);

  // Load current posts from constants.ts (or API if available)
  const loadPosts = async () => {
    try {
      // Fetch from constants by evaluating the current build
      // For now, read from a simple endpoint or localStorage
      const res = await fetch('/instagram-posts.json');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch {
      // Fallback to defaults
      setPosts([
        'https://www.instagram.com/p/Db53HPWtrX7/',
        'https://www.instagram.com/p/Dai5HcxDu1S/',
        'https://www.instagram.com/p/Da5LRWDMpOi/',
        'https://www.instagram.com/p/C5QXNW5NQHZ/',
      ]);
    }
    setLoading(false);
  };

  const savePosts = async () => {
    setSaving(true);
    setStatus(null);
    try {
      // In production, this would write to constants.ts or a JSON file
      // For now, we'll show the user what to update
      const output = `export const INSTAGRAM_FEATURED_POSTS: string[] = [\n  "${posts.join('",\n  "')}"\n];`;
      
      navigator.clipboard.writeText(output);
      setStatus({ type: 'ok', msg: 'Copied to clipboard! Paste into constants.ts line ~251' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to copy' });
    }
    setSaving(false);
  };

  const addPost = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (!url.includes('instagram.com/p/') && !url.includes('instagram.com/reel/')) {
      setStatus({ type: 'error', msg: 'Must be an Instagram post or reel URL' });
      return;
    }
    if (posts.includes(url)) {
      setStatus({ type: 'error', msg: 'Already in list' });
      return;
    }
    if (posts.length >= 4) {
      setStatus({ type: 'error', msg: 'Max 4 posts' });
      return;
    }
    setPosts([...posts, url]);
    setNewUrl('');
    setStatus({ type: 'ok', msg: 'Added! Click Save to copy constants.ts update' });
  };

  const removePost = (url: string) => {
    setPosts(posts.filter(p => p !== url));
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8 mx-auto" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black text-white uppercase tracking-tight">Instagram Posts (Home Carousel)</h1>
      </div>

      {/* Current Posts */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">
          CURRENT POSTS ({posts.length}/4) — Drag to reorder
        </div>
        
        {posts.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">No posts configured</div>
        ) : (
          <ul className="space-y-2">
            {posts.map((url, i) => (
              <li key={url} className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg">
                <span className="text-orange-500 font-mono text-sm">{i + 1}.</span>
                <a href={url} target="_blank" rel="noopener" className="flex-1 text-sm text-white hover:text-orange-400 truncate break-all">
                  {url}
                </a>
                <button 
                  onClick={() => removePost(url)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add New Post */}
      <div className="mt-6 bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-3">ADD NEW POST</div>
        <div className="flex gap-2">
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/ABC123/ or https://www.instagram.com/reel/ABC123/"
            className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
          />
          <button onClick={addPost} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Plus size={14} /> ADD
          </button>
        </div>
        <p className="text-[10px] text-gray-500">Max 4 posts. Only /p/ or /reel/ URLs.</p>
      </div>

      {/* Save / Copy */}
      <div className="mt-6 flex gap-3">
        <button 
          onClick={savePosts} 
          disabled={saving || posts.length === 0}
          className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'COPYING...' : 'COPY CONSTANTS.TS UPDATE TO CLIPBOARD'}
        </button>
      </div>

      {/* Status */}
      {status && (
        <div className={`mt-4 px-4 py-2 rounded-lg text-xs font-semibold ${status.type === 'ok' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.msg}
        </div>
      )}

      {/* Instructions */}
      <details className="mt-8">
        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400">How to deploy</summary>
        <div className="mt-3 p-4 bg-stone-900 border border-stone-800 rounded-lg text-xs text-gray-400 space-y-2">
          <p>1. Click <b>COPY CONSTANTS.TS UPDATE</b> above</p>
          <p>2. Open <code>constants.ts</code> around line 251</p>
          <p>3. Replace the <code>INSTAGRAM_FEATURED_POSTS</code> array with clipboard content</p>
          <p>4. Run <code>npm run build</code> and deploy</p>
        </div>
      </details>
    </div>
  );
};