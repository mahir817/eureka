import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Practice = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const userName = state?.userName;

    // Default config if not coming from home
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        fetchPracticeQuestions();
    }, []);

    const fetchPracticeQuestions = async () => {
        try {
            // Fetch 10 random questions (using the existing endpoint logic, might need backend tweak to get random)
            // For now, we fetch all and shuffle, or fetch specific stream
            // Using the 'individual/questions' endpoint: count=10, stream=Computer Science, difficulty=Easy, categoryLike=%
            const response = await axios.get('http://localhost:8081/questions/individual/questions', {
                params: {
                    stream: 'Computer Science',
                    categoryLike: '%',
                    difficulty: 'Easy',
                    count: 10
                }
            });

            // Randomize options for each question
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
                <p>Please add some questions in the Question Manager first.</p>
                <button className="btn btn-primary" onClick={() => navigate('/questions')}>Go to Question Manager</button>
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
