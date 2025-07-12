import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/Common/RichTextEditor';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const AskQuestionPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!title || !description || !tags) {
            setError('All fields are required.');
            return;
        }
        try {
            const { data } = await api.post('/api/questions', { title, description, tags });
            navigate(`/questions/${data._id}`);
        } catch (err) {
            setError('Failed to post question. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Ask a Public Question</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <p>Be specific and imagine you’re asking a question to another person.</p>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., How do I implement authentication in React?"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <p>Include all the information someone would need to answer your question.</p>
                    <RichTextEditor value={description} onChange={setDescription} />
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <p>Add up to 5 tags to describe what your question is about. Use comma to separate tags.</p>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., react,jwt,node.js"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Post Your Question</button>
            </form>
        </div>
    );
};

export default AskQuestionPage;