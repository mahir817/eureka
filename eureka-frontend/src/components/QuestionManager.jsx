import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        text: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
        category: '',
        stream: 'Computer Science',
        difficulty: 'Easy'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:8081/questions');
            setQuestions(response.data);
        } catch (error) {
            console.error("Error fetching questions", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const newQuestions = rows.slice(1).map(row => {
                const cols = row.split(',');
                // Assumed CSV format: text,opt1,opt2,opt3,opt4,answer,category,stream,difficulty
                return {
                    text: cols[0],
                    options: [cols[1], cols[2], cols[3], cols[4]],
                    answer: cols[5],
                    category: cols[6],
                    stream: cols[7],
                    difficulty: cols[8] ? cols[8].trim() : 'Easy'
                };
            });

            try {
                await axios.post('http://localhost:8081/questions/questions', newQuestions);
                alert('Bulk upload successful!');
                fetchQuestions();
            } catch (error) {
                console.error("Bulk upload failed", error);
                alert('Upload failed. Check CSV format.');
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            text: formData.text,
            options: [formData.option1, formData.option2, formData.option3, formData.option4],
            answer: formData.answer,
            category: formData.category,
            stream: formData.stream,
            difficulty: formData.difficulty
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:8081/questions/${editingId}`, payload);
            } else {
                await axios.post('http://localhost:8081/questions', payload);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                text: '', option1: '', option2: '', option3: '', option4: '',
                answer: '', category: '', stream: 'Computer Science', difficulty: 'Easy'
            });
            fetchQuestions();
        } catch (error) {
            console.error("Error saving question", error);
        }
    };

    const handleEdit = (q) => {
        setFormData({
            text: q.text,
            option1: q.options[0],
            option2: q.options[1],
            option3: q.options[2],
            option4: q.options[3],
            answer: q.answer,
            category: q.category,
            stream: q.stream,
            difficulty: q.difficulty
        });
        setEditingId(q.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`http://localhost:8081/questions/${id}`);
            fetchQuestions();
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Question Management</h2>

            <div className="d-flex justify-content-between mb-4">
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                    {showForm ? 'Close Form' : 'Add New Question'}
                </button>
                <div>
                    <label className="btn btn-success me-2">
                        Upload CSV
                        <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                    </label>
                    <small className="d-block text-muted">Format: Text,Opt1,Opt2,Opt3,Opt4,Ans,Cat,Stream,Diff</small>
                </div>
            </div>

            {showForm && (
                <div className="card p-4 mb-4 shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Question Text</label>
                            <input className="form-control" name="text" value={formData.text} onChange={handleInputChange} required />
                        </div>
                        <div className="row">
                            {[1, 2, 3, 4].map(n => (
                                <div className="col-md-6 mb-3" key={n}>
                                    <label>Option {n}</label>
                                    <input className="form-control" name={`option${n}`} value={formData[`option${n}`]} onChange={handleInputChange} required />
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Correct Answer (Matches one option)</label>
                                <input className="form-control" name="answer" value={formData.answer} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Category</label>
                                <input className="form-control" name="category" value={formData.category} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Stream</label>
                                <select className="form-select" name="stream" value={formData.stream} onChange={handleInputChange}>
                                    <option>Computer Science</option>
                                    <option>Electrical</option>
                                    <option>Mechanical</option>
                                    <option>Civil</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Difficulty</label>
                                <select className="form-select" name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Save'} Question</button>
                    </form>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Category</th>
                            <th>Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(q => (
                            <tr key={q.id}>
                                <td>{q.id}</td>
                                <td>{q.text}</td>
                                <td>{q.category} ({q.stream})</td>
                                <td>{q.difficulty}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(q)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(q.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionManager;
