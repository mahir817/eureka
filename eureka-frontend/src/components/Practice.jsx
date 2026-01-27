import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
    }, []);

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
        if (selectedOption) return; // Prevent multiple clicks

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

    if (setupMode) {
        return (
            <div className="container mt-5">
                <div className="card shadow col-md-8 mx-auto">
                    <div className="card-header bg-primary text-white">
                        <h3>Practice Setup</h3>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Select Stream</label>
                            <select className="form-select" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                                {Object.keys(streamData).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select Category</label>
                            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="%">Mixed</option>
                                {streamData[selectedStream]?.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Difficulty</label>
                            <select className="form-select" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Number of Questions</label>
                            <input type="number" className="form-control" value={selectedCount} onChange={e => setSelectedCount(e.target.value)} min="5" max="50" />
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-success btn-lg" onClick={startPractice}>Start Practice</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="text-center mt-5"><h1>Loading Practice Questions...</h1></div>;

    if (finished) {
        return (
            <div className="container mt-5 text-center">
                <div className="card shadow p-5">
                    <h1 className="text-primary mb-4">Practice Complete!</h1>
                    <h3>Your Score: {score} / {questions.length * 10}</h3>
                    <div className="mt-4">
                        <button className="btn btn-primary me-3" onClick={() => window.location.reload()}>Try Again</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/home', { state: { userName } })}>Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h3>No practice questions available.</h3>
                <p>Try different settings or add some questions in the Question Manager.</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Setup Again</button>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between">
                            <span>Question {currentQIndex + 1} / {questions.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <div className="card-body text-center">
                            <h4 className="card-title mb-4 py-3">{currentQ.text}</h4>

                            {feedback && (
                                <div className={`alert ${feedback.startsWith('Correct') ? 'alert-success' : 'alert-danger'} mb-3`}>
                                    {feedback}
                                </div>
                            )}

                            <div className="d-grid gap-3">
                                <div className="row">
                                    <div className="col-6 mb-2">
                                        <button
                                            className={`btn w-100 py-3 ${selectedOption === currentQ.options[0] ? (currentQ.options[0] === currentQ.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                                            onClick={() => handleOptionClick(currentQ.options[0])}
                                            disabled={selectedOption !== null}
                                        >
                                            {currentQ.options[0]}
                                        </button>
                                    </div>
                                    <div className="col-6 mb-2">
                                        <button
                                            className={`btn w-100 py-3 ${selectedOption === currentQ.options[1] ? (currentQ.options[1] === currentQ.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                                            onClick={() => handleOptionClick(currentQ.options[1])}
                                            disabled={selectedOption !== null}
                                        >
                                            {currentQ.options[1]}
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className={`btn w-100 py-3 ${selectedOption === currentQ.options[2] ? (currentQ.options[2] === currentQ.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                                            onClick={() => handleOptionClick(currentQ.options[2])}
                                            disabled={selectedOption !== null}
                                        >
                                            {currentQ.options[2]}
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className={`btn w-100 py-3 ${selectedOption === currentQ.options[3] ? (currentQ.options[3] === currentQ.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
                                            onClick={() => handleOptionClick(currentQ.options[3])}
                                            disabled={selectedOption !== null}
                                        >
                                            {currentQ.options[3]}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Practice;
