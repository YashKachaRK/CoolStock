import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function CashierProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cashier',
    status: 'Active',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Read cashier from localStorage (set at login)
  const cashier = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!cashier?.id) {
      setError('Session not found. Please log in again.');
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/staffProfile/${cashier.id}`);
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          role: res.data.role || 'Cashier',
          status: res.data.status || 'Active',
          joinedAt: res.data.createdAt || null,
        });
      } catch {
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!cashier?.id) return;
    setSaving(true);
    setError('');
    try {
      await axios.put(`${API}/staffProfile/${cashier.id}`, {
        name: profile.name,
        phone: profile.phone,
      });
      setIsEditing(false);
      setSavedMsg(true);
      // Update localStorage name so the layout reflects immediately
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: profile.name }));
      setTimeout(() => setSavedMsg(false), 3500);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💳</div>
          <p className="text-gray-500 font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 md:p-7 rounded-2xl mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">👤 My Profile</h1>
          <p className="opacity-70 mt-1 text-sm">View and update your account details</p>
        </div>
        <Link
          to="/cashier/dashboard"
          className="bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition"
        >
          ← Back to Verifications
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Avatar Card ── */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            {/* Avatar circle with initials */}
            <div className="w-32 h-32 rounded-full border-4 border-emerald-200 shadow-md bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl font-black text-white select-none">
              {initials}
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow">
              💳
            </div>
          </div>

          <p className="font-black text-xl text-gray-800 mt-1">{profile.name}</p>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mt-2">💳 {profile.role}</span>
          <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${profile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {profile.status === 'Active' ? '🟢 Active' : '⏸ Inactive'}
          </span>

          {profile.joinedAt && (
            <div className="mt-5 w-full bg-gray-50 rounded-xl p-3 text-left">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Joined</p>
              <p className="text-sm font-bold text-gray-700">
                {new Date(profile.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}

          <div className="mt-5 w-full bg-gray-50 rounded-xl p-3 text-left">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm font-bold text-gray-700 break-all">{profile.email}</p>
          </div>

          <p className="text-xs text-gray-300 mt-4 italic">Email &amp; password changes require Admin.</p>
        </div>

        {/* ── Right: Edit Details Card ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Profile Details</h2>
              <p className="text-gray-400 text-sm mt-0.5">Update your name and contact number</p>
            </div>
            <button
              onClick={() => { setIsEditing(!isEditing); setError(''); }}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${isEditing ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {isEditing ? '✖ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mb-5 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}
          {savedMsg && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl mb-5 text-sm font-semibold">
              ✅ Profile updated successfully!
            </div>
          )}

          <div className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Full Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-400 outline-none transition"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 bg-gray-50 rounded-xl px-4 py-3 text-sm">{profile.name || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Role</label>
                <p className="font-semibold text-gray-800 bg-gray-50 rounded-xl px-4 py-3 text-sm">💳 {profile.role}</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
                <p className="font-semibold text-gray-600 bg-gray-50 rounded-xl px-4 py-3 text-sm break-all">
                  {profile.email || '—'}
                  <span className="block text-[10px] text-gray-300 mt-0.5">Cannot be changed here</span>
                </p>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Contact Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-400 outline-none transition"
                    placeholder="+91 98765 00000"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 bg-gray-50 rounded-xl px-4 py-3 text-sm">{profile.phone || '—'}</p>
                )}
              </div>
            </div>

            {/* Account Status (read-only) */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Account Status</label>
              <p className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700">
                {profile.status === 'Active' ? '🟢 Active' : '⏸ Inactive'}
              </p>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving || !profile.name.trim()}
              className="mt-8 w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
