import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    shop: '',
    email: '',
    phone: '',
    addr: '',
    joined: ''
  });
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState("");

  const API = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/customerProfile`);
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`${API}/updateCustomerProfile`, {
        name: profile.name,
        shop: profile.shop,
        addr: profile.addr,
        phone: profile.phone
      });
      setIsEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 rounded-[2.5rem] mb-10 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30">
            🏪
          </div>
          <div>
            <h1 className="text-3xl font-black">{profile.name}</h1>
            <p className="opacity-80 font-bold uppercase tracking-widest text-xs mt-1">Official Member since {new Date(profile.joined).getFullYear()}</p>
          </div>
        </div>
        <div className="bg-black/10 px-6 py-4 rounded-3xl backdrop-blur-sm text-center">
          <p className="text-[10px] font-black uppercase opacity-60 mb-1">Account Status</p>
          <span className="bg-green-400 text-green-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            {profile.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
            <h2 className="text-lg font-black text-gray-800 mb-6">Shop Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Company / Shop</p>
                <p className="font-bold text-gray-800">{profile.shop}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Registered Email</p>
                <p className="font-bold text-gray-800 text-sm">{profile.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Member Since</p>
                <p className="font-bold text-gray-800">{new Date(profile.joined).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Edit Details</h2>
                <p className="text-gray-400 text-sm font-medium mt-1">Keep your shop information up to date.</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isEditing
                    ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    : "bg-purple-600 text-white shadow-lg shadow-purple-100 hover:scale-105"
                  }`}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold border border-red-100">⚠️ {error}</div>}
            {savedMsg && <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-8 text-sm font-bold border border-green-100 animate-bounce">✅ Profile Updated Successfully!</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.shop}
                  onChange={e => setProfile({ ...profile, shop: e.target.value })}
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.addr}
                  onChange={e => setProfile({ ...profile, addr: e.target.value })}
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="mt-12 w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-purple-100 hover:scale-[1.01] active:scale-95 transition-all text-lg"
              >
                💾 Save Account Changes
              </button>
            )}

            {!isEditing && (
              <p className="mt-10 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">
                To change your email or password, please contact the Main Administrator.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
