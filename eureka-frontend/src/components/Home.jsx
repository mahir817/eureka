import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

// Category / Strategy Card Component
const StrategyCard = (props) => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [count, setCount] = useState(10);
  const [category, setCategory] = useState('%25');
  const stream = props.stream;
  const categories = props.categories;
  const userName = props.userName;
  const [secretCode, setSecretCode] = useState('');
  const navigate = useNavigate();

  const createBuzzer = async () => {
    const response = await axios.get(`http://localhost:8081/buzzers/create/${userName}?categoryLike=${category}&difficulty=${difficulty}&count=${count}&stream=${stream}`);
    const data = await response["data"];
    return data;
  }

  const StrangerBuzzer = async () => {
    const data = await createBuzzer();
    await axios.get(`http://localhost:8081/buzzers/share/${data["id"]}`);
    // Ideally navigate or show feedback
    alert(`Battle initiated! Global signal sent.`);
  }

  const FriendBuzzer = async () => {
    const data = await createBuzzer();
    setSecretCode(data['secretCode']);
  }

  return (
    <div className="col-span-1">
      <div className="glass-panel h-full relative overflow-hidden group hover:shadow-gold-glow transition-all duration-300">
        <div className="vellum-overlay"></div>

        {/* Card Header */}
        <div className="relative z-10 p-6 border-b border-white/10 text-center">
          <h2 className="font-serif text-2xl font-bold text-dark-academia-gold tracking-widest uppercase">{stream}</h2>
          <div className="w-16 h-1 bg-dark-academia-gold/50 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Card Body */}
        <div className="relative z-10 p-6 space-y-4">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sector</label>
            <select
              className="w-full bg-dark-academia-charcoal/50 border border-white/20 text-gray-200 text-sm rounded px-3 py-2 focus:border-dark-academia-gold focus:outline-none transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="%25">All Sectors (Mixed)</option>
              {Object.entries(categories).map(([xx, cat], index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Config Row */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Intensity</label>
              <select
                className="w-full bg-dark-academia-charcoal/50 border border-white/20 text-gray-200 text-sm rounded px-3 py-2 focus:border-dark-academia-gold focus:outline-none transition-colors"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Novice</option>
                <option value="Medium">Adept</option>
                <option value="Hard">Master</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Length</label>
              <input
                type="number"
                className="w-full bg-dark-academia-charcoal/50 border border-white/20 text-gray-200 text-sm rounded px-3 py-2 focus:border-dark-academia-gold focus:outline-none transition-colors"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Qty"
                min={5}
                max={30}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col space-y-3">
            <button
              className="btn-glass w-full text-center py-2 text-sm font-bold uppercase tracking-wider"
              onClick={() => navigate('/practice', { state: { userName: userName } })}
            >
              <i className="fa fa-dumbbell mr-2 opacity-70"></i> Drilling
            </button>

            <button
              className="btn-gold w-full text-center py-2 text-sm"
              onClick={StrangerBuzzer}
            >
              <i className="fa fa-globe mr-2"></i> Skirmish (Public)
            </button>

            {!secretCode ? (
              <button
                className="w-full bg-dark-academia-midnight border border-dark-academia-gold text-dark-academia-gold hover:bg-dark-academia-gold hover:text-black py-2 rounded text-sm font-bold uppercase tracking-wider transition-all duration-300"
                onClick={FriendBuzzer}
              >
                <i className="fa fa-user-friends mr-2"></i> Challenge Ally
              </button>
            ) : (
              <div className="bg-black/40 p-3 rounded border border-dark-academia-gold/30 animate-pulse text-center">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">Secret Glyph</p>
                <input
                  className="bg-transparent text-center text-dark-academia-gold font-mono text-lg font-bold w-full focus:outline-none"
                  disabled
                  value={secretCode}
                />
                <p className="text-[10px] text-gray-500 mt-1">Transmit this to your ally.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = useState({});
  const userName = state?.userName;

  const [notifications, setNotifications] = useState([]);
  const [streamData, setStreamData] = useState({});
  const [secretCode, setSecretCode] = useState();

  // Notification Handling
  const onMessageReceived = (message) => {
    // Logic currently mirrors previous implementation, routing to Header notifications
    // But we also update local state if we want to show anything specific here
    // For now, we rely on Header to show popups/badges.
    // However, if we want to pop a toast, we could do it here.

    // We add to notifications prop passed to Header
    const newNotif = {
      id: Date.now(),
      type: message["player1"] == userName ? 'WAITING' : 'INVITE',
      text: message["player1"] == userName
        ? "Awaiting challenger... (20s timeout)"
        : `${message.player1} challenges you!`,
      data: message,
      timestamp: new Date()
    };

    if (message["player1"] == userName) {
      setNotifications(prev => [newNotif, ...prev]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 20000);
    } else {
      setNotifications(prev => [newNotif, ...prev]);
      // Invite doesn't auto-expire visually as fast, but let's keep logic same
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 20000);
    }
  };

  const onGameJoined = async (message) => {
    message["userName"] = userName;
    navigate("/waiting", { replace: true, state: message });
  };

  useEffect(() => {
    if (!userName) navigate("/login", { replace: true });

    // Fetch User
    axios.get(`http://localhost:8081/users/username/${userName}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    // Fetch Streams
    axios.get(`http://localhost:8081/questions/streams`)
      .then(res => setStreamData(res.data))
      .catch(err => console.error(err));
  }, [userName, navigate]);

  const joinWithCode = () => {
    axios.get(`http://localhost:8081/buzzers/join/${secretCode}/${userName}`)
      .then(res => console.log(res.data)) // Logic usually handled by websocket redirect or onGameJoined? 
      // Actually, join usually triggers a websocket message "GAME_JOINED"? 
      // Or if it's HTTP based, we might need to navigate manually if success.
      // The previous code verified this just logs data. We'll leave it but maybe add feedback.
      .catch(e => alert("Invalid Code or Session Expired"));
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col">
      <Header
        userName={userName}
        notifications={notifications}
        setNotifications={setNotifications}
        onMessageReceived={onMessageReceived} // Header passes this to WebSocketComponent
        onGameJoined={onGameJoined}
      />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">

        {/* User Dossier (War Table Header) */}
        <section className="glass-panel-heavy p-8 relative overflow-hidden animate-fade-in-down">
          <div className="vellum-overlay"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left space-y-6 md:space-y-0">

            {/* Identity */}
            <div className="flex flex-col items-center md:items-start">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide text-shadow-lg">
                {user.name || 'Scholar'}
              </h1>
              <div className="flex items-center space-x-3 text-dark-academia-gold/80 font-sans uppercase tracking-widest text-sm">
                <span>{user.username}</span>
                <span className="w-1 h-1 bg-dark-academia-gold rounded-full"></span>
                <span>{user.profession || 'Novice'}</span>
              </div>
              <div className="mt-4 text-gray-400 text-sm font-serif italic border-l-2 border-dark-academia-gold/30 pl-4">
                {user.institute} &bull; Class of {user.graduation_year}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex space-x-6 md:space-x-12">
              <div className="text-center group cursor-default">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-dark-academia-gold transition-colors">Rating</div>
                <div className="font-serif text-4xl text-white font-bold">{user.ratings || 0}</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-dark-academia-gold transition-colors">Brain Coins</div>
                <div className="font-serif text-4xl text-dark-academia-gold font-bold">{user.brain_coins || 0}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Operations (Join Code) */}
        <section className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-dark-academia-charcoal/80 backdrop-blur-sm text-lg font-serif italic text-gray-400">
                Join an Active Skirmish
              </span>
            </div>
          </div>

          <div className="flex bg-dark-academia-midnight/50 p-2 rounded-lg border border-white/10 max-w-lg mx-auto shadow-glass focus-within:border-dark-academia-gold/50 transition-colors">
            <input
              className="flex-grow bg-transparent border-none text-white text-center font-mono tracking-widest placeholder-gray-600 focus:ring-0 focus:outline-none"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="ENTER SECRET GLYPH"
            />
            <button
              className="btn-gold ml-2 text-sm py-2 px-6"
              onClick={joinWithCode}
            >
              Infiltrate
            </button>
          </div>
        </section>

        {/* Strategic Streams (Grid) */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-center text-white/90">Strategic Theatres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(streamData).map(([stream, categories]) => (
              <StrategyCard key={stream} stream={stream} categories={categories} userName={userName} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
