import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../api';

const RichTextEditor = ({ value, onChange }) => {
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                // Save current cursor position
                const range = this.quill.getSelection(true);
                const { data } = await api.post('/api/upload', formData);
                // Insert image URL to editor
                this.quill.insertEmbed(range.index, 'image', data.imageUrl);
            } catch (error) {
                console.error('Image upload failed', error);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'emoji'],
                [{ 'align': [] }],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder="Enter your description here..."
            className="rich-text-editor"
        />
    );
};

export default RichTextEditor;