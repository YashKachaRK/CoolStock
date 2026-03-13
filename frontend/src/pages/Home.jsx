import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [modalActive, setModalActive] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const openApply = (role) => {
    setSelectedRole(role || '');
    setModalActive(true);
    setApplied(false);
  };

  const closeApply = () => {
    setModalActive(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
      setTimeout(() => {
        closeApply();
      }, 2500);
    }, 1000);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-bg {
          background: linear-gradient(270deg, #7c3aed, #ec4899, #f97316, #ec4899, #7c3aed);
          background-size: 300% 300%;
          animation: gradientShift 10s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50%       { transform: translateY(-18px) rotate(5deg); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.7s ease forwards; }
        .glass {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍦</span>
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              CoolStock
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">About</button>
            <button onClick={() => scrollTo('features')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Features</button>
            <button onClick={() => scrollTo('careers')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Careers</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-xl border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all">
              Staff Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-bg min-h-screen flex items-center justify-center text-white text-center px-6 pt-20">
        <div className="max-w-4xl mx-auto fade-in-up">
          <div className="float-anim text-8xl mb-6 select-none">🍦</div>
          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight">
            Welcome to<br />
            <span className="text-yellow-300">CoolStock</span> Ice Cream
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 text-white/90 max-w-2xl mx-auto">
            Experience the sweetest scoops in town — delivered fresh to your door or pick it up at our store. Every bite, a new adventure! 🎉
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 glass text-white font-bold text-lg rounded-2xl hover:bg-white/20 hover:scale-105 transition-all shadow-lg">
              🔐 Staff Login
            </Link>
            <button onClick={() => scrollTo('careers')} className="px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/30 hover:scale-105 transition-all">
              💼 Join Our Team
            </button>
          </div>
          <div className="mt-16 animate-bounce text-white/70 text-sm">
            <p>↓ Scroll to explore</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">✨ About Us</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">More Than Just Ice Cream</h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-16">
            CoolStock is a modern Ice Cream shop powered by a cutting-edge Point-of-Sale (POS) system. We combine a love for creamy, handcrafted flavours with the convenience of technology — so you can order online, track your delivery, and earn loyalty points, all in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition duration-300 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-8 text-left">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Online Ordering</h3>
              <p className="text-gray-500">Browse our full menu from anywhere, add to cart, and have your favourite scoops delivered straight to your door.</p>
            </div>
            <div className="hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition duration-300 bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 text-left">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-500">Our dedicated delivery team ensures your order arrives fresh and on time — every single time.</p>
            </div>
            <div className="hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition duration-300 bg-gradient-to-br from-orange-50 to-yellow-100 rounded-3xl p-8 text-left">
              <div className="text-5xl mb-4">🖥️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Modern POS System</h3>
              <p className="text-gray-500">Our in-store technology streamlines operations for cashiers, managers, and admins — making every transaction seamless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-pink-100 text-pink-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">🍨 Our Platform</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Built for Everyone</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-16">Our system serves multiple roles, each with a tailored experience.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon="⚙️" bg="bg-blue-100" border="border-blue-100" 
              title="Administrator" desc="Full system control — manage employees, products, orders, and analytics from a powerful central dashboard." 
            />
            <FeatureCard 
              icon="👨‍🍳" bg="bg-green-100" border="border-green-100" 
              title="Employee" desc="Create and manage daily orders, preview bills, and track active transactions efficiently." 
            />
            <FeatureCard 
              icon="📊" bg="bg-indigo-100" border="border-indigo-100" 
              title="Manager" desc="Monitor store performance, manage staff schedules, handle inventory, and oversee supplier relations." 
            />
            <FeatureCard 
              icon="💳" bg="bg-yellow-100" border="border-yellow-100" 
              title="Cashier / POS" desc="A lightning-fast, touch-friendly checkout interface with real-time cart calculations and receipt generation." 
            />
            <FeatureCard 
              icon="🛵" bg="bg-orange-100" border="border-orange-100" 
              title="Delivery" desc="View assigned orders, update delivery status in real-time, and navigate to customer locations seamlessly." 
            />
            <FeatureCard 
              icon="🧑‍💻" bg="bg-rose-100" border="border-rose-100" 
              title="Customer" desc="Browse the menu, manage your cart, place orders, track deliveries, and earn loyalty points — all online." 
            />
          </div>
        </div>
      </section>

      {/* CAREERS SECTION */}
      <section id="careers" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">💼 Careers</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Join Our Sweet Team</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            We're always looking for passionate and dedicated people to be a part of the CoolStock family. Apply for the role that suits you best!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <CareerCard 
              icon="📊" title="Manager" desc="Lead the team, oversee daily operations, and drive store performance." 
              gradient="from-indigo-50 to-purple-50" border="border-indigo-100" badge="bg-indigo-100 text-indigo-700" 
              onClick={() => openApply('Manager')} 
            />
            <CareerCard 
              icon="💳" title="Cashier / POS Operator" desc="Handle in-store transactions and deliver a great checkout experience." 
              gradient="from-yellow-50 to-orange-50" border="border-yellow-100" badge="bg-yellow-100 text-yellow-700" 
              onClick={() => openApply('Cashier / POS Operator')} 
            />
            <CareerCard 
              icon="🛵" title="Delivery Person" desc="Deliver our iconic scoops fresh and on time to happy customers." 
              gradient="from-orange-50 to-red-50" border="border-orange-100" badge="bg-orange-100 text-orange-700" 
              onClick={() => openApply('Delivery Person')} 
            />
          </div>

          <button 
            onClick={() => openApply('')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-xl"
          >
            📝 Apply for a Job
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍦</span>
              <span className="text-xl font-bold text-white">CoolStock</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Your favourite ice cream shop, powered by technology. Sweet every scoop.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => scrollTo('about')} className="hover:text-purple-400 transition">About Us</button></li>
              <li><button onClick={() => scrollTo('features')} className="hover:text-purple-400 transition">Features</button></li>
              <li><button onClick={() => scrollTo('careers')} className="hover:text-purple-400 transition">Careers</button></li>
              <li><Link to="/login" className="hover:text-purple-400 transition">Staff Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 123 Scoop Street, Flavour City</li>
              <li>📞 +91 98765 43210</li>
              <li>📧 hello@coolstock.com</li>
              <li>🕐 Mon–Sun: 10:00 AM – 10:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm">
          <p>© 2026 CoolStock Ice Cream. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Made with ❤️ by Team CoolStock</p>
        </div>
      </footer>

      {/* APPLY MODAL */}
      {modalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={(e) => { if (e.target === e.currentTarget) closeApply(); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closeApply} className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🍦</div>
              <h2 className="text-3xl font-black text-gray-800">Apply for a Job</h2>
              <p className="text-gray-500 mt-1">Fill in your details and we'll get back to you!</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" placeholder="e.g., Rutvik Shiyal" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input required type="email" placeholder="you@example.com" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input required type="tel" placeholder="+91 98765 43210" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Applying For</label>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 bg-white transition-colors">
                  <option value="" disabled>-- Select a Role --</option>
                  <option value="Manager">📊 Manager</option>
                  <option value="Cashier / POS Operator">💳 Cashier / POS Operator</option>
                  <option value="Delivery Person">🛵 Delivery Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Why do you want to join us?</label>
                <textarea rows="4" placeholder="Tell us a bit about your experience..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isApplying || applied}
                className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transition-all ${
                  applied 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 hover:scale-[1.02]'
                }`}
              >
                {applied ? '✅ Application Submitted!' : '🚀 Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, bg, border, title, desc }) {
  return (
    <div className={`hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition duration-300 bg-white rounded-3xl p-7 text-left border ${border}`}>
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function CareerCard({ icon, gradient, border, badge, title, desc, onClick }) {
  return (
    <div onClick={onClick} className={`hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] transition duration-300 bg-gradient-to-br ${gradient} rounded-3xl p-7 border ${border} text-left cursor-pointer`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{desc}</p>
      <span className={`inline-block ${badge} text-xs font-semibold px-3 py-1 rounded-full`}>Apply →</span>
    </div>
  );
}
