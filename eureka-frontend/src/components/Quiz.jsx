import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuizSocketComponent from './QuizSocketComponent';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const Quiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const buzzer = location.state;
    const userName = buzzer['userName'];
    const player1 = buzzer['player1'];
    const player2 = buzzer['player2'];
    const questions = buzzer['questions'];
    const questionsLength = buzzer['questions'].length;
    const TimeForEachQuestion = 30;

    const [buzzerMsg, setBuzzerMsg] = useState({});
    const [showBuzzerMsg, setShowBuzzerMsg] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TimeForEachQuestion);
    const timelineWidth = (timeLeft / TimeForEachQuestion) * 100 + "%";

    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);

    // Chat State
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const chatClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Styling / Animations
    const [lastFeedback, setLastFeedback] = useState(null); // For immediate local feedback on click

    // Initialize Chat Socket
    useEffect(() => {
        const socket = new SockJS('http://localhost:8081/websocket');
        const client = Stomp.over(socket);
        client.debug = null; // Disable debug logs

        client.connect({}, () => {
            chatClientRef.current = client;

            // Subscribe to Room Chat
            client.subscribe(`/all/chat/${buzzer['id']}`, (msg) => {
                if (msg.body) {
                    const payload = JSON.parse(msg.body);
                    setChatMessages(prev => [...prev, payload]);
                }
            });
        });

        return () => {
            if (client && client.connected) client.disconnect();
        };
    }, [buzzer]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const sendMessage = () => {
        if (chatClientRef.current && currentMessage.trim() !== "") {
            const chatPayload = {
                sender: userName,
                content: currentMessage,
                type: 'CHAT'
            };
            chatClientRef.current.send(`/app/chat/${buzzer['id']}`, {}, JSON.stringify(chatPayload));
            setCurrentMessage("");
        }
    };

    const onGameBuzzered = (message) => {
        console.log(message);
        const msg = {};
        msg['at'] = message['buzzeredAt'];
        msg['by'] = message['buzzeredBy'];
        msg['score'] = message['score'];
        msg['correct'] = message['correct'];
        msg['userName'] = userName;

        setBuzzerMsg({ msg });
        setShowBuzzerMsg(true);

        setPlayer1Score(message['player1Score']);
        setPlayer2Score(message['player2Score']);

        // Reset local feedback
        setLastFeedback(null);

        nextQuestion();

        setTimeout(() => {
            setShowBuzzerMsg(false);
        }, 2000);
    }

    const onGameResult = (message) => {
        message['userName'] = userName;
        message['buzzer'] = buzzer;
        navigate("/result", { replace: true, state: message });
    }

    const BuzzerIt = async (optionText) => {
        // Local immediate feedback
        const correct = (optionText === questions[questionIndex]['answer']);
        setLastFeedback(correct ? 'CORRECT' : 'WRONG');

        const score = timeLeft;
        await axios.post(`http://localhost:8081/buzzers/buzzer/${buzzer['id']}/${userName}?score=${score}&correct=${correct}&questionIndex=${questionIndex}`);
    }

    const nextQuestion = () => {
        const getResult = async () => {
            await axios.post(
                `http://localhost:8081/buzzers/result/${buzzer['id']}`
            );
        };

        if (questionIndex === (questionsLength - 1)) {
            getResult();
            return;
        }

        setQuestionIndex(prev => {
            const newIndex = prev + 1;
            if (newIndex === questionsLength) {
                getResult();
                return prev;
            }
            return newIndex;
        });

        setTimeLeft(TimeForEachQuestion);
    }

    // Timer Logic
    useEffect(() => {
        const passQuestion = async () => {
            await axios.post(`http://localhost:8081/buzzers/${buzzer['id']}/questionpassed/${questionIndex}`);
        }
        if (!timeLeft) {
            passQuestion();
            nextQuestion();
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    // Prevent back button
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

            {userName && (
                <QuizSocketComponent
                    userName={userName}
                    onGameBuzzered={onGameBuzzered}
                    onGameResult={onGameResult}
                />
            )}

            {/* Main Arena Area */}
            <div className="flex-grow flex flex-col relative z-10 p-4 md:p-8 h-screen overflow-y-auto">

                {/* Header: Timer & Round Info */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="font-serif text-3xl text-dark-academia-gold font-bold uppercase tracking-widest text-shadow-sm">
                            Duel Arena
                        </h2>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                            <span className="font-bold text-white">{player1.username}</span>
                            <span>vs</span>
                            <span className="font-bold text-white">{player2.username}</span>
                        </div>
                    </div>

                    {/* Local Timer Display */}
                    <div className="glass-panel px-4 py-2 flex flex-col items-center">
                        <span className="text-dark-academia-gold font-mono text-3xl font-bold">{timeLeft}</span>
                        <span className="text-[10px] uppercase text-gray-400 tracking-wider">Seconds</span>
                    </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`p-4 rounded-lg border ${userName === player1.username ? 'bg-indigo-900/30 border-indigo-500' : 'bg-dark-academia-charcoal/50 border-white/10'} text-center transition-all`}>
                        <div className="text-gray-400 text-xs uppercase tracking-widest">{player1.username}</div>
                        <div className="text-3xl text-white font-serif font-bold">{player1Score}</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${userName === player2.username ? 'bg-indigo-900/30 border-indigo-500' : 'bg-dark-academia-charcoal/50 border-white/10'} text-center transition-all`}>
                        <div className="text-gray-400 text-xs uppercase tracking-widest">{player2.username}</div>
                        <div className="text-3xl text-white font-serif font-bold">{player2Score}</div>
                    </div>
                </div>

                {/* Feedback / Status Message */}
                <AnimatePresence>
                    {showBuzzerMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-6 p-3 rounded text-center border font-bold uppercase tracking-wider shadow-lg ${buzzerMsg.msg.correct ? 'bg-green-900/80 border-green-500 text-green-100' : 'bg-red-900/80 border-red-500 text-red-100'
                                }`}
                        >
                            {buzzerMsg.msg.by === userName ? "YOU" : buzzerMsg.msg.by} {buzzerMsg.msg.correct ? "SCORED!" : "MISSED!"} (+{buzzerMsg.msg.score} pts)
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Question Card */}
                <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel-heavy p-8 md:p-12 mb-6 text-center relative flex-grow flex flex-col justify-center"
                >
                    <div className="vellum-overlay"></div>
                    <div className="relative z-10">
                        <div className="mb-2 text-dark-academia-gold text-xs font-bold uppercase tracking-widest">
                            Question {questionIndex + 1} / {questionsLength}
                        </div>
                        <h3 className="text-2xl md:text-3xl text-white font-serif leading-relaxed mb-8">
                            {questions[questionIndex].text}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions[questionIndex].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => BuzzerIt(opt)}
                                    className="bg-dark-academia-charcoal/60 border border-white/20 hover:bg-white/10 hover:border-dark-academia-gold text-white py-4 px-6 rounded-lg transition-all duration-300 font-sans text-lg text-left flex items-center group"
                                >
                                    <span className="w-8 h-8 rounded-full border border-gray-500 text-gray-400 group-hover:border-dark-academia-gold group-hover:text-dark-academia-gold flex items-center justify-center mr-4 text-sm font-bold">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-dark-academia-gold transition-all duration-1000 ease-linear" style={{ width: timelineWidth }}></div>
                </motion.div>

            </div>

            {/* Chat Sidebar Removed per request */}

        </div>
    );
};

export default Quiz;
