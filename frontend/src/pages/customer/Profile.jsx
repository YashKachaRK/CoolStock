import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'cs_profile_cust1';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ramesh Patel',
    shop: 'Ramesh General Store',
    email: 'ramesh@gmail.com',
    phone: '+91 94001 11111',
    addr: 'Village Khari, Dist. Anand',
    photo: ''
  });
  const [savedMsg, setSavedMsg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    setProfile(prev => ({ ...prev, ...data }));
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      const newProfile = { ...profile, photo: src };
      setProfile(newProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-7 rounded-2xl mb-8 shadow-lg">
        <h1 className="text-3xl font-black">👤 My Profile</h1>
        <p className="opacity-70 mt-1">Manage your shop account and contact details</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Photo Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="w-36 h-36 rounded-full border-4 border-purple-100 shadow-md object-cover bg-gray-100" />
            ) : (
              <div className="w-36 h-36 rounded-full border-4 border-purple-100 shadow-md bg-gray-100 flex items-center justify-center text-5xl text-gray-400">
                🏪
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-purple-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg shadow hover:bg-purple-800 transition"
            >
              📷
            </button>
          </div>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          
          <p className="font-black text-xl text-gray-800">{profile.name}</p>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mt-1">🏪 Customer</span>
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="mt-4 w-full py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-800 transition"
          >
            📷 Change Photo
          </button>
          <p className="text-xs text-gray-400 mt-2">Photo visible to Admin</p>
        </div>

        {/* Details Card */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Account Details</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-800 transition"
            >
              {isEditing ? '✖ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Owner Name</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.name}</p>
                ) : (
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-0.5 text-sm outline-none focus:border-purple-400" />
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Shop Name</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.shop}</p>
                ) : (
                  <input type="text" value={profile.shop} onChange={e => setProfile({...profile, shop: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-0.5 text-sm outline-none focus:border-purple-400" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.email}</p>
                ) : (
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-0.5 text-sm outline-none focus:border-purple-400" />
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Contact</label>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800 mt-0.5">{profile.phone}</p>
                ) : (
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-0.5 text-sm outline-none focus:border-purple-400" />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Shop Address</label>
              {!isEditing ? (
                <p className="font-semibold text-gray-800 mt-0.5">{profile.addr}</p>
              ) : (
                <input type="text" value={profile.addr} onChange={e => setProfile({...profile, addr: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-0.5 text-sm outline-none focus:border-purple-400" />
              )}
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Username</label>
              <p className="font-semibold text-gray-800 mt-0.5">customer</p>
            </div>
          </div>

          {isEditing && (
            <button onClick={handleSave} className="mt-6 w-full py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition">
              💾 Save Changes
            </button>
          )}

          {savedMsg && (
            <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm font-semibold text-center">
              ✅ Profile updated successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
