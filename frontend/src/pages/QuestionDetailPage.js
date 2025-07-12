import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import RichTextEditor from '../components/Common/RichTextEditor';
import DOMPurify from 'dompurify';

const QuestionDetailPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answerContent, setAnswerContent] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchQuestion = async () => {
        try {
            const { data } = await api.get(`/api/questions/${id}`);
            setQuestion(data);
        } catch (error) {
            console.error("Failed to fetch question", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        if (!answerContent) return;
        try {
            await api.post(`/api/questions/${id}/answers`, { content: answerContent });
            setAnswerContent('');
            fetchQuestion();
        } catch (error) {
            console.error("Failed to post answer", error);
        }
    };

    const handleVote = async (answerId, voteType) => {
        if (!user) { navigate('/login'); return; }
        try {
            const { data } = await api.post(`/api/questions/${id}/answers/${answerId}/vote`, { voteType });
            setQuestion(data);
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    const handleAcceptAnswer = async (answerId) => {
        if (!user) { navigate('/login'); return; }
        try {
            const { data } = await api.post(`/api/questions/${id}/answers/${answerId}/accept`);
            setQuestion(data);
        } catch (error) {
            console.error("Failed to accept answer", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!question) return <p>Question not found.</p>;

    const isOwner = user?.id === question.user?._id;

    return (
        <div>
            <div className="question-detail-header">
                <h1>{question.title}</h1>
                <div className="question-meta">
                    Asked by {question.user?.username || 'Anonymous'} on {new Date(question.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="question-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.description) }}></div>
            
            <div className="tags-container">
                {question.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>

            <div className="answers-section">
                <h2>{question.answers.length} Answer{question.answers.length !== 1 && 's'}</h2>
                {question.answers.map(answer => (
                    <div key={answer._id} className="answer-card">
                        <div className="vote-cell">
                            <button onClick={() => handleVote(answer._id, 'upvote')} className="vote-btn">▲</button>
                            <span className="vote-count">{answer.upvotes.length - answer.downvotes.length}</span>
                            <button onClick={() => handleVote(answer._id, 'downvote')} className="vote-btn">▼</button>
                            {question.acceptedAnswer === answer._id ? (
                                <div className="vote-btn accepted" title="Accepted Answer">✓</div>
                            ) : (
                                isOwner && !question.acceptedAnswer && (
                                    <button onClick={() => handleAcceptAnswer(answer._id)} className="vote-btn" title="Mark as accepted">✓</button>
                                )
                            )}
                        </div>
                        <div className="answer-body">
                            <div className="answer-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer.content) }}></div>
                            <div className="answer-author">
                                Answered by {answer.user.username} on {new Date(answer.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {user && (
                <div className="form-container" style={{ marginTop: '30px' }}>
                    <h3>Your Answer</h3>
                    <form onSubmit={handleAnswerSubmit}>
                        <RichTextEditor value={answerContent} onChange={setAnswerContent} />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Post Your Answer</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default QuestionDetailPage;