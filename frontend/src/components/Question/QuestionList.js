import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/api/questions');
                setQuestions(data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (loading) return <p>Loading questions...</p>;

    return (
        <div>
            {questions.map(q => (
                <div key={q._id} className="question-summary">
                    <h3 className="question-summary-title">
                        <Link to={`/questions/${q._id}`}>{q.title}</Link>
                    </h3>
                    <div className="question-summary-meta">
                        <span>{q.answers.length} answers</span> • <span>Asked by {q.user?.username || 'Unknown'} on {new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuestionList;