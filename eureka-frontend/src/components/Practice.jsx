import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Practice = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;

    const [streamData, setStreamData] = useState({});
    const [selectedStream, setSelectedStream] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("%");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
    const [selectedCount, setSelectedCount] = useState(10);
    const [setupMode, setSetupMode] = useState(true);

    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (!userName) navigate("/login", { replace: true });
        fetchStreams();
    }, [userName, navigate]);

    const fetchStreams = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/questions/streams`);
            const data = response.data;
            setStreamData(data);
            if (Object.keys(data).length > 0) setSelectedStream(Object.keys(data)[0]);
        } catch (e) { console.error(e); }
    };

    const startPractice = async () => {
        setLoading(true);
        setSetupMode(false);
        try {
            const response = await axios.get('http://localhost:8081/questions/individual/questions', {
                params: {
                    stream: selectedStream,
                    categoryLike: selectedCategory === "Mixed" ? "%" : selectedCategory,
                    difficulty: selectedDifficulty,
                    count: selectedCount
                }
            });

            const shuffled = response.data.map(q => ({
                ...q,
                options: q.options.sort(() => Math.random() - 0.5)
            }));

            setQuestions(shuffled);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching practice questions", error);
            setLoading(false);
        }
    };

    const handleOptionClick = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const currentQ = questions[currentQIndex];

        if (option === currentQ.answer) {
            setScore(score + 10);
            setFeedback("Correct! +10 Points");
        } else {
            setFeedback(`Wrong! The answer was: ${currentQ.answer}`);
        }

        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(currentQIndex + 1);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    // Styling constants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    if (setupMode) {
        return (
            <div className="min-h-screen bg-fixed bg-cover bg-academy flex items-center justify-center p-4">
                <motion.div
                    initial="hidden" animate="visible" exit="exit" variants={containerVariants}
                    className="glass-panel-heavy p-8 w-full max-w-2xl relative overflow-hidden"
                >
                    <div className="vellum-overlay"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-8 border-b border-white/10 pb-4">
                            <h3 className="font-serif text-3xl font-bold text-dark-academia-gold mb-2 tracking-widest uppercase">Training Grounds</h3>
                            <p className="text-gray-400 italic font-serif">Prepare your mind for the arena</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Discipline (Stream)</label>
                                <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-4 py-3 focus:border-dark-academia-gold focus:outline-none transition-colors" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                                    {Object.keys(streamData).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject (Category)</label>
                                <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-4 py-3 focus:border-dark-academia-gold focus:outline-none transition-colors" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="%">Mixed Arts</option>
                                    {streamData[selectedStream]?.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Intensity</label>
                                    <select className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-4 py-3 focus:border-dark-academia-gold focus:outline-none transition-colors" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                                        <option value="Easy">Novice</option>
                                        <option value="Medium">Adept</option>
                                        <option value="Hard">Master</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Length</label>
                                    <input type="number" className="w-full bg-dark-academia-charcoal/80 border border-white/20 text-white rounded px-4 py-3 focus:border-dark-academia-gold focus:outline-none transition-colors" value={selectedCount} onChange={e => setSelectedCount(e.target.value)} min="5" max="50" />
                                </div>
                            </div>

                            <button className="btn-gold w-full py-4 text-lg mt-8 shadow-lg transform hover:scale-[1.02] transition-transform" onClick={startPractice}>
                                Commence Training
                            </button>

                            <button className="w-full text-center text-gray-500 text-sm hover:text-white mt-4 transition-colors" onClick={() => navigate('/home', { state: { userName } })}>
                                Returns to Quarters
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen bg-fixed bg-cover bg-academy flex items-center justify-center">
            <div className="text-center animate-pulse">
                <i className="fa fa-hourglass-half text-6xl text-dark-academia-gold mb-4"></i>
                <h1 className="text-2xl font-serif text-white tracking-widest">Consulting the Archives...</h1>
            </div>
        </div>
    );

    if (finished) {
        return (
            <div className="min-h-screen bg-fixed bg-cover bg-academy flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel-heavy p-8 max-w-lg w-full text-center relative overflow-hidden"
                >
                    <div className="vellum-overlay"></div>
                    <div className="relative z-10">
                        <i className="fa fa-flag-checkered text-5xl text-dark-academia-gold mb-4"></i>
                        <h1 className="text-4xl text-white font-serif font-bold mb-2">Training Complete</h1>
                        <div className="w-24 h-1 bg-dark-academia-gold mx-auto my-6"></div>

                        <div className="mb-8">
                            <span className="block text-gray-400 text-sm uppercase tracking-widest mb-2">Final Score</span>
                            <span className="text-6xl font-bold text-dark-academia-gold">{score} <span className="text-2xl text-white/50">/ {questions.length * 10}</span></span>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button className="btn-gold w-full py-3" onClick={() => window.location.reload()}>Another Round</button>
                            <button className="btn-glass w-full py-3" onClick={() => navigate('/home', { state: { userName } })}>Return to Quarters</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-academy flex items-center justify-center p-4">
                <div className="glass-panel p-8 text-center max-w-md">
                    <h3 className="text-xl text-white font-serif mb-4">No scrolls found in this archive.</h3>
                    <button className="btn-gold" onClick={() => window.location.reload()}>Reconfigure</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-academy flex flex-col items-center justify-center p-4">

            {/* Header / StatusBar */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
                <div className="glass-panel px-6 py-2 flex items-center space-x-3">
                    <span className="text-gray-400 text-xs font-bold uppercase">Progress</span>
                    <span className="text-dark-academia-gold font-serif text-xl">{currentQIndex + 1} <span className="text-white/50 text-sm">/ {questions.length}</span></span>
                </div>

                <div className="glass-panel px-6 py-2 flex items-center space-x-3">
                    <span className="text-gray-400 text-xs font-bold uppercase">Score</span>
                    <motion.span
                        key={score}
                        initial={{ scale: 1.5, color: '#fff' }}
                        animate={{ scale: 1, color: '#d4af37' }}
                        className="text-dark-academia-gold font-mono text-xl"
                    >
                        {score}
                    </motion.span>
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-4xl"
            >
                <div className="glass-panel-heavy p-8 md:p-12 mb-8 relative overflow-hidden min-h-[200px] flex items-center justify-center text-center">
                    <div className="vellum-overlay"></div>
                    <h4 className="relative z-10 text-2xl md:text-3xl text-white font-serif leading-relaxed">
                        {currentQ.text}
                    </h4>
                </div>

                {/* Feedback Overlay (Optional, could be better) */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`mb-6 p-4 rounded text-center font-bold tracking-widest uppercase border ${feedback.startsWith('Correct') ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-red-900/50 border-red-500 text-red-200'}`}
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {currentQ.options.map((option, idx) => {
                        let btnClass = "bg-dark-academia-charcoal/60 border-white/10 hover:border-dark-academia-gold/50 hover:bg-white/10";
                        if (selectedOption) {
                            if (option === currentQ.answer) btnClass = "bg-green-900/40 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                            else if (option === selectedOption) btnClass = "bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                            else btnClass = "opacity-50 border-transparent";
                        }

                        return (
                            <motion.button
                                whileHover={!selectedOption ? { scale: 1.02 } : {}}
                                whileTap={!selectedOption ? { scale: 0.98 } : {}}
                                key={idx}
                                className={`
                                    relative p-6 rounded-xl border-2 text-left transition-all duration-300
                                    flex items-center group
                                    ${btnClass}
                                `}
                                onClick={() => handleOptionClick(option)}
                                disabled={selectedOption !== null}
                            >
                                <div className={`
                                    w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-serif font-bold text-sm
                                    ${selectedOption && option === currentQ.answer ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500 group-hover:border-dark-academia-gold group-hover:text-dark-academia-gold'}
                                `}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className={`text-lg ${selectedOption && option === currentQ.answer ? 'text-green-100 font-bold' : 'text-gray-200 group-hover:text-white'}`}>
                                    {option}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default Practice;
