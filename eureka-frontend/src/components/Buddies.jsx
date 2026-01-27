import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Buddies = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [newFriendName, setNewFriendName] = useState("");
    const [notifications, setNotifications] = useState([]);

    // WebSocket Client
    const stompClientRef = useRef(null);

    // Battle State
    const [showCreate, setShowCreate] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [category, setCategory] = useState("Mixed");
    const [streamData, setStreamData] = useState({});
    const [selectedStream, setSelectedStream] = useState("Computer Science");
    const [difficulty, setDifficulty] = useState("Easy");
    const [count, setCount] = useState(10);
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        fetchFriends();
        fetchRequests();

        const fetchStreams = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/questions/streams`);
                const data = response.data;
                setStreamData(data);
                if (Object.keys(data).length > 0) setSelectedStream(Object.keys(data)[0]);
            } catch (e) { console.error(e); }
        };
        fetchStreams();
    }, [userName, navigate]);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/friends/${userName}`);
            setFriends(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/friends/requests/${userName}`);
            setRequests(res.data);
        } catch (e) { console.error(e); }
    };

    const addFriend = async () => {
        if (!newFriendName) return;
        try {
            await axios.post(`http://localhost:8081/friends/add/${userName}/${newFriendName}`);
            alert("Friend request sent!");
            setNewFriendName("");
            fetchFriends();
        } catch (e) {
            alert(e.response?.data || "Error adding friend");
        }
    };

    const acceptRequest = async (sender) => {
        try {
            await axios.post(`http://localhost:8081/friends/accept/${userName}/${sender}`);
            fetchRequests();
            fetchFriends();
        } catch (e) { console.error(e); }
    }

    const onMessageReceived = (message) => {
        const newNotif = {
            id: Date.now(),
            type: 'INVITE',
            data: message,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const onGameJoined = async (message) => {
        message["userName"] = userName;
        navigate("/waiting", { replace: true, state: message });
    };

    const onClientAvailable = (client) => {
        stompClientRef.current = client;
        setClientReady(true);
    };

    const pokeUser = async (friend) => {
        try {
            await axios.post('http://localhost:8081/notifications/poke', {
                sender: userName,
                recipient: friend.username
            });
            // Optional: User feedback handled by UI
        } catch (e) {
            console.error(e);
            alert("Failed to poke.");
        }
    };

    const initiateBattle = (friend) => {
        setSelectedFriend(friend);
        setShowCreate(true);
    };

    const sendInvite = async () => {
        let catToSend = category;
        if (category === "Mixed") catToSend = "%25";

        const response = await axios.get(`http://localhost:8081/buzzers/create/${userName}?categoryLike=${catToSend}&difficulty=${difficulty}&count=${count}&stream=${selectedStream}`);
        const buzzer = response.data;

        await axios.post(`http://localhost:8081/friends/invite/${userName}/${selectedFriend.username}/${buzzer.id}`);

        setShowCreate(false);
        const newNotif = {
            id: Date.now(),
            type: 'WAITING',
            text: `Invite sent to ${selectedFriend.username}! Wait for them to join.`,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col">
            <Header
                userName={userName}
                notifications={notifications}
                setNotifications={setNotifications}
                onMessageReceived={onMessageReceived}
                onGameJoined={onGameJoined}
                onClientAvailable={onClientAvailable}
            />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="font-serif text-4xl text-dark-academia-gold font-bold uppercase tracking-widest text-shadow-sm mb-4 md:mb-0">Allies & Rivals</h2>
                    <div className="flex bg-dark-academia-charcoal/80 rounded border border-white/20 p-1 w-full md:w-auto">
                        <input
                            className="bg-transparent border-none text-white px-4 py-2 focus:ring-0 focus:outline-none w-full md:w-64 placeholder-gray-500 font-sans"
                            placeholder="Enlist new ally..."
                            value={newFriendName}
                            onChange={e => setNewFriendName(e.target.value)}
                        />
                        <button className="btn-gold text-xs px-4 py-2" onClick={addFriend}>Enlist</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Friends Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="font-serif text-2xl text-white border-b border-dark-academia-gold/30 pb-2 mb-4">Known Allies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {friends.map(friend => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={friend.username}
                                    className="glass-panel p-6 relative group hover:bg-white/5 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h5 className="font-serif text-xl text-dark-academia-gold font-bold">{friend.name}</h5>
                                            <p className="text-gray-400 text-sm">@{friend.username}</p>
                                        </div>
                                        <span className="bg-dark-academia-gold/20 text-dark-academia-gold border border-dark-academia-gold/50 px-2 py-1 rounded text-xs font-bold">{friend.ratings}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">{friend.profession}</p>

                                    <div className="grid grid-cols-2 gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="bg-red-900/40 border border-red-500 text-red-200 hover:bg-red-800/60 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                                            onClick={() => initiateBattle(friend)}
                                        >
                                            <i className="fa fa-skull"></i> <span>Duel</span>
                                        </button>
                                        <button
                                            className="bg-dark-academia-gold/20 border border-dark-academia-gold text-dark-academia-gold hover:bg-dark-academia-gold/40 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                                            onClick={() => pokeUser(friend)}
                                        >
                                            <i className="fa fa-hand-point-right"></i> <span>Poke</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {friends.length === 0 && <p className="text-gray-500 italic">You have no allies yet.</p>}
                        </div>
                    </div>

                    {/* Requests Column */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-2xl text-white border-b border-dark-academia-gold/30 pb-2 mb-4">Pending Requests</h4>
                        <div className="space-y-4">
                            {requests.map(req => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={req.username}
                                    className="glass-panel p-4"
                                >
                                    <h6 className="font-bold text-white mb-1">{req.name}</h6>
                                    <p className="text-gray-400 text-sm mb-3">@{req.username}</p>
                                    <button
                                        className="w-full bg-green-900/40 border border-green-500 text-green-200 hover:bg-green-800/60 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                                        onClick={() => acceptRequest(req.username)}
                                    >
                                        Accept Alliance
                                    </button>
                                </motion.div>
                            ))}
                            {requests.length === 0 && <p className="text-gray-500 italic text-sm">No pending missives.</p>}
                        </div>
                    </div>
                </div>
            </main>

            {/* Battle Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel-heavy w-full max-w-md overflow-hidden relative"
                        >
                            <div className="vellum-overlay"></div>

                            {/* Header */}
                            <div className="relative z-10 p-6 border-b border-white/10 bg-dark-academia-charcoal/50">
                                <h5 className="font-serif text-2xl text-white font-bold">Challenge {selectedFriend?.name}</h5>
                            </div>

                            {/* Body */}
                            <div className="relative z-10 p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Discipline</label>
                                    <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-3 py-2 text-sm focus:border-dark-academia-gold focus:outline-none" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                                        {Object.keys(streamData).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Topic</label>
                                    <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-3 py-2 text-sm focus:border-dark-academia-gold focus:outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="Mixed">Mixed Arts</option>
                                        {streamData[selectedStream]?.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Intensity</label>
                                        <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-3 py-2 text-sm focus:border-dark-academia-gold focus:outline-none" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                            <option value="Easy">Novice</option>
                                            <option value="Medium">Adept</option>
                                            <option value="Hard">Master</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Length</label>
                                        <input type="number" className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-3 py-2 text-sm focus:border-dark-academia-gold focus:outline-none" value={count} onChange={e => setCount(e.target.value)} min="5" max="30" />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="relative z-10 p-6 border-t border-white/10 flex space-x-3 bg-dark-academia-charcoal/50">
                                <button className="flex-1 btn-glass py-2" onClick={() => setShowCreate(false)}>Retreat</button>
                                <button className="flex-1 btn-gold py-2" onClick={sendInvite}>Issue Challenge</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Buddies;
