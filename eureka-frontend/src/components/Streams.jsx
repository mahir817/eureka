import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import axios from "axios";

const Streams = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;
    const [streamData, setStreamData] = useState({});

    // Header State
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });

        // Fetch Streams
        const fetchStreams = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/questions/streams`);
                setStreamData(response.data);
            } catch (e) {
                console.error("Failed to fetch streams", e);
            }
        };
        fetchStreams();
    }, [userName, navigate]);

    // Header callbacks (similar to Home)
    const onMessageReceived = (msg) => {
        const newNotif = {
            id: Date.now(),
            type: msg.player1 === userName ? 'WAITING' : 'INVITE',
            text: msg.player1 === userName
                ? "Awaiting challenger..."
                : `${msg.player1} challenges you!`,
            data: msg,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col overflow-hidden">
            <Header
                userName={userName}
                notifications={notifications}
                setNotifications={setNotifications}
                onMessageReceived={onMessageReceived} // Essential for real-time alerts
            />

            <main className="flex-grow relative flex items-center justify-center p-8">
                {/* Background Constellation Lines (Static Decoration) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#d4af37" strokeWidth="1" />
                    <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="#d4af37" strokeWidth="1" />
                    <line x1="40%" y1="50%" x2="50%" y2="80%" stroke="#d4af37" strokeWidth="1" />
                    <circle cx="40%" cy="50%" r="2" fill="#d4af37" />
                    <circle cx="10%" cy="20%" r="2" fill="#d4af37" />
                    <circle cx="80%" cy="30%" r="2" fill="#d4af37" />
                </svg>

                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-5xl text-dark-academia-gold font-bold tracking-widest uppercase text-shadow-lg mb-4">Celestial Map</h1>
                        <p className="text-gray-400 font-serif italic max-w-2xl mx-auto">Explore the constellations of knowledge. Each star represents a discipline, each satellite a branch of wisdom.</p>
                    </div>

                    {Object.keys(streamData).length === 0 ? (
                        <div className="text-center text-white animate-pulse">Scanning the skies...</div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-16 md:gap-24">
                            {Object.entries(streamData).map(([stream, categories], index) => (
                                <StarSystem
                                    key={stream}
                                    stream={stream}
                                    categories={categories}
                                    index={index}
                                    navigate={navigate}
                                    userName={userName}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const StarSystem = ({ stream, categories, index, navigate, userName }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* The Star (Stream) */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full glass-panel-heavy flex items-center justify-center border-2 border-dark-academia-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] cursor-pointer transition-all duration-500 relative z-20"
                onClick={() => navigate('/home', { state: { userName: userName } })} // Clicking star goes to War Table (Home) for now
            >
                <div className="text-center p-2">
                    <i className="fa fa-star text-dark-academia-gold text-2xl mb-1 opacity-80 group-hover:opacity-100 group-hover:animate-pulse"></i>
                    <h3 className="font-serif text-white font-bold text-sm md:text-base tracking-wider uppercase">{stream}</h3>
                </div>
            </motion.div>

            {/* Orbiting Planets (Categories) - Only visible on hover */}
            {hovered && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute w-64 h-64 border border-dark-academia-gold/20 rounded-full animate-spin-slow"
                    ></motion.div>

                    {categories.map((cat, idx) => {
                        const angle = (idx / categories.length) * 2 * Math.PI;
                        const radius = 100; // px
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 0, y: 0 }}
                                animate={{ opacity: 1, x: x, y: y }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="absolute bg-dark-academia-midnight border border-white/20 px-2 py-1 rounded text-xs text-blue-200 whitespace-nowrap shadow-lg backdrop-blur-md"
                            >
                                {cat}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default Streams;
