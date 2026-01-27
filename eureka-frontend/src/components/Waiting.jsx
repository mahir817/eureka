import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const Waiting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state || {}; // Handle null state
  const userName = message['userName'];
  // Handle both 'buzzer_id' (from Map/Notification) and 'id' (from Buzzer Entity)
  const buzzerId = message['buzzer_id'] || message['id'];

  console.log("Waiting Page Loaded. Message:", message);
  console.log("Extracted buzzerId:", buzzerId);

  // Check if player1 or player2
  const isOwner = userName === message["player1"];
  const opponentName = isOwner ? message["player2"] : message["player1"];
  const opponentInfo = isOwner ? {
    name: message["player2"],
    profession: message["player2Profession"],
    institute: message["player2Institute"],
    ratings: message["player2Ratings"]
  } : {
    name: message["player1"],
    profession: message["player1Profession"],
    institute: message["player1Institute"],
    ratings: message["player1Ratings"]
  };

  // Chat State
  const [socketClient, setSocketClient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Socket Connection
  useEffect(() => {
    let client = null;
    let mounted = true;

    try {
      const socket = new SockJS('http://localhost:8081/websocket');
      client = Stomp.over(socket);
      client.debug = null;

      client.connect({}, (frame) => {
        if (!mounted) {
          client.disconnect();
          return;
        }
        console.log('Connected: ' + frame);
        setSocketClient(client);

        // Subscribe to Game Begin
        client.subscribe(`/func/began/${userName}`, (msg) => {
          if (mounted) onGameBegan(JSON.parse(msg.body));
        });

        // Subscribe to Chat
        client.subscribe(`/all/chat/${buzzerId}`, (msg) => {
          if (mounted && msg.body) {
            const payload = JSON.parse(msg.body);
            setChatMessages(prev => {
              // Avoid duplicates if reusing state
              if (prev.some(m => m.timestamp === payload.timestamp && m.content === payload.content && m.sender === payload.sender)) return prev;
              return [...prev, payload];
            });
          }
        });
      });
    } catch (e) {
      console.error("Socket error", e);
    }

    return () => {
      mounted = false;
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [userName, buzzerId]);

  // Scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const BeginBuzzer = async () => {
    try {
      await axios.get(`http://localhost:8081/buzzers/begin/${buzzerId}`);
    } catch (e) {
      console.error("Failed to start buzzer", e);
    }
  }

  const onGameBegan = (msg) => {
    const fetchBuzzer = async () => {
      const response = await axios.get(`http://localhost:8081/buzzers/${buzzerId}`);
      const data = response.data;
      data["userName"] = userName;
      navigate("/quiz", { replace: true, state: data });
    };
    fetchBuzzer();
  };

  const sendMessage = () => {
    if (socketClient && currentMessage.trim() !== "") {
      const chatPayload = {
        sender: userName,
        content: currentMessage,
        type: 'CHAT'
      };
      socketClient.send(`/app/chat/${buzzerId}`, {}, JSON.stringify(chatPayload));
      setCurrentMessage("");
    }
  };

  // Prevent navigation away
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row gap-8">

        {/* Left Column: Match Details */}
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <h6 className="font-serif text-dark-academia-gold uppercase tracking-[0.2em] text-sm mb-2">Buzzer Round #{buzzerId}</h6>
            <h1 className="font-serif text-5xl text-white font-bold mb-4">Preparation Phase</h1>
            {isOwner ? (
              <button
                onClick={BeginBuzzer}
                className="w-full md:w-auto px-8 py-3 bg-green-900 border border-green-500 text-green-100 font-bold uppercase tracking-widest hover:bg-green-800 transition-all shadow-[0_0_20px_rgba(0,255,0,0.2)]"
              >
                Commence Duel
              </button>
            ) : (
              <div className="inline-block px-6 py-3 border border-dark-academia-gold/30 rounded bg-dark-academia-charcoal/80 text-dark-academia-gold animate-pulse">
                Awaiting Host Command...
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opponent Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6"
            >
              <h5 className="text-gray-400 font-serif uppercase text-xs tracking-widest mb-4">Adversary</h5>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full border-2 border-dark-academia-gold bg-black/40 flex items-center justify-center">
                  <i className="fa fa-user text-2xl text-dark-academia-gold"></i>
                </div>
                <div>
                  <h3 className="text-xl text-white font-bold">{opponentInfo.name}</h3>
                  <p className="text-sm text-gray-400">{opponentInfo.profession}</p>
                  <p className="text-xs text-dark-academia-gold mt-1">
                    <i className="fa fa-university mr-1"></i> {opponentInfo.institute}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-dark-academia-gold font-bold">{opponentInfo.ratings}</span>
              </div>
            </motion.div>

            {/* Rules Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6"
            >
              <h5 className="text-gray-400 font-serif uppercase text-xs tracking-widest mb-4">Protocol</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <i className="fa fa-exclamation-triangle text-red-500 mt-1 mr-2"></i>
                  <span>Do not refresh the page.</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-bolt text-dark-academia-gold mt-1 mr-2"></i>
                  <span>Speed determines score bonus.</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-check text-green-500 mt-1 mr-2"></i>
                  <span>First buzzer locks the answer.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-96 glass-panel-heavy flex flex-col h-[500px]"
        >
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h4 className="font-serif text-white font-bold text-center">Battle Comms</h4>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 && (
              <p className="text-center text-gray-500 text-xs italic mt-10">Secure channel open.</p>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === userName ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded text-sm ${msg.sender === userName ? 'bg-dark-academia-gold/20 text-dark-academia-gold border border-dark-academia-gold/30' : 'bg-white/10 text-gray-300 border border-white/10'}`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-500 mt-1">{msg.sender}</span>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-grow bg-dark-academia-charcoal border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-dark-academia-gold"
                placeholder="Send message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="bg-dark-academia-gold text-black px-4 rounded hover:bg-yellow-600 transition-colors"
                onClick={sendMessage}
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Waiting;
