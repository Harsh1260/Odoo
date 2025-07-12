import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import RichTextEditor from '../components/Common/RichTextEditor';
import DOMPurify from 'dompurify';

// --- NEW: A dedicated component for the comment section ---
const CommentSection = ({ questionId, answerId, comments, onCommentPosted }) => {
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        if (!newComment.trim()) return;

        try {
            const { data: updatedQuestion } = await api.post(`/api/questions/${questionId}/answers/${answerId}/comments`, { content: newComment });
            onCommentPosted(updatedQuestion); // Notify parent component to update state
            setNewComment(''); // Clear the input field
        } catch (error) {
            console.error("Failed to post comment", error);
            alert('Could not post comment.');
        }
    };

    return (
        <div className="comment-section">
            <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />
            {comments.map(comment => (
                <div key={comment._id} className="comment-display">
                    <p>
                        {comment.content} – 
                        <strong>{comment.user?.username || 'user'}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#6a737c' }}> on {new Date(comment.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
            ))}
            {user && (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Add</button>
                </form>
            )}
        </div>
    );
};


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

    const handleAnswerSubmit = async (e) => { e.preventDefault(); if (!user) { navigate('/login'); return; } if (!answerContent) return; try { await api.post(`/api/questions/${id}/answers`, { content: answerContent }); setAnswerContent(''); fetchQuestion(); } catch (error) { console.error("Failed to post answer", error); } };
    const handleVote = async (answerId, voteType) => { if (!user) { navigate('/login'); return; } try { const { data } = await api.post(`/api/questions/${id}/answers/${answerId}/vote`, { voteType }); setQuestion(data); } catch (error) { console.error("Failed to vote", error); } };
    const handleAcceptAnswer = async (answerId) => { if (!user) { navigate('/login'); return; } try { const { data } = await api.post(`/api/questions/${id}/answers/${answerId}/accept`); setQuestion(data); } catch (error) { console.error("Failed to accept answer", error); } };
    const handleDeleteQuestion = async () => { if (window.confirm('ADMIN ACTION: Are you sure?')) { try { await api.delete(`/api/admin/questions/${id}`); navigate('/'); } catch (error) { console.error('Failed to delete question', error); } } };
    const handleDeleteAnswer = async (answerId) => { if (window.confirm('ADMIN ACTION: Are you sure?')) { try { await api.delete(`/api/admin/questions/${id}/answers/${answerId}`); fetchQuestion(); } catch (error) { console.error('Failed to delete answer', error); } } };

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
                {user?.role === 'Admin' && (
                    <button onClick={handleDeleteQuestion} style={{color: 'red', marginLeft: '20px', border: '1px solid red', padding: '5px 10px', cursor: 'pointer'}}>
                        Delete Question (Admin)
                    </button>
                )}
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
                            <div className="answer-author" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px'}}>
                                <span>Answered by {answer.user.username} on {new Date(answer.createdAt).toLocaleDateString()}</span>
                                {user?.role === 'Admin' && (
                                    <button onClick={() => handleDeleteAnswer(answer._id)} style={{color: 'red', border: '1px solid red', padding: '5px 10px', cursor: 'pointer'}}>
                                        Delete (Admin)
                                    </button>
                                )}
                            </div>
                            <CommentSection
                                questionId={question._id}
                                answerId={answer._id}
                                comments={answer.comments || []}
                                onCommentPosted={(updatedQuestion) => setQuestion(updatedQuestion)}
                            />
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