import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from "lowlight";
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/languageContext';
const lowlight = createLowlight(common);
import './TextEditor.component.scss';

interface TextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    hasError?: boolean;
    className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
    value = '',
    onChange,
    placeholder = 'typing here...',
    className,
    disabled = false
}) => {
    const { getValue } = useLanguage();
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Handle image insertion
    const handleInsertImage = () => {
        if (imageUrl.trim()) {
            editor?.chain().focus().setImage({ src: imageUrl.trim() }).run();

            // Add new line after image insertion
            editor?.chain().focus().createParagraphNear().run();

            setImageUrl('');
            setShowImageDialog(false);
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        if (editor?.isActive('image')) {
            editor.chain().focus().deleteSelection().run();
        }
    };

    const handleImageDialog = () => {
        setShowImageDialog(true);
    };

    const handleCancelImageDialog = () => {
        setImageUrl('');
        setShowImageDialog(false);
    };

    // Handle keyboard events in image dialog
    const handleImageDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && imageUrl.trim()) {
            e.preventDefault();
            handleInsertImage();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancelImageDialog();
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value || ``,
        editable: !disabled,
        // autofocus: true,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
    });

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || ``);
        }
    }, [editor, value, placeholder]);

    // Update editor editable state when disabled prop changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [editor, disabled]);

    if (!editor) {
        return null;
    }

    return (
        <>
            <div className={`editor-container ${disabled ? 'is-disabled' : ''} ${className || ''}`}>
                <div className="editor-toolbar">
                    <div className="toolbar-group">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo() || disabled}
                            className="toolbar-button"
                            type='button'
                            title="Undo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo() || disabled}
                            className="toolbar-button"
                            type='button'
                            title="Redo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                            </svg>
                        </button>
                    </div>

                    <div className="toolbar-group">
                        <select
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'p') {
                                    editor.chain().focus().setParagraph().run();
                                } else if (value.startsWith('h')) {
                                    editor.chain().focus().toggleHeading({ level: parseInt(value.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                                }
                            }}
                            value={(() => {
                                if (editor.isActive('heading', { level: 1 })) return 'h1';
                                if (editor.isActive('heading', { level: 2 })) return 'h2';
                                if (editor.isActive('heading', { level: 3 })) return 'h3';
                                return 'p';
                            })()}
                            className="toolbar-select"
                            disabled={disabled}
                        >
                            <option value="p">Normal text</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                        </select>
                    </div>

                    <div className="toolbar-group">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
                            title="Bold"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
                            title="Italic"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`toolbar-button ${editor.isActive('underline') ? 'is-active' : ''}`}
                            title="Underline"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
                            title="Strike"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
                            title="Inline Code"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
                            </svg>
                        </button>
                    </div>

                    <div className="toolbar-group">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                            title="Bullet List"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                            title="Ordered List"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const url = window.prompt('Enter the URL');
                                if (url) {
                                    editor.chain().focus().setLink({ href: url }).run();
                                }
                            }}
                            className={`toolbar-button ${editor.isActive('link') ? 'is-active' : ''}`}
                            title="Link"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                                <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleImageDialog}
                            className="toolbar-button"
                            title={getValue('image_url') || 'Image'}
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                            </svg>
                        </button>
                        {editor.isActive('image') && (
                            <button
                                onClick={handleRemoveImage}
                                className="toolbar-button remove-image"
                                title={getValue('remove_image') || 'Remove Image'}
                                type='button'
                                disabled={disabled}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={`toolbar-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
                            title="Code Block"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`toolbar-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                            title="Quote"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="toolbar-button"
                            title="Horizontal Rule"
                            type='button'
                            disabled={disabled}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3 9.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                <path fillRule="evenodd" d="M1 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zm0 10a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <EditorContent
                    editor={editor}
                    className="editor-content"
                    onClick={() => editor?.chain().focus().run()}
                />
            </div>

            {/* Image URL Dialog */}
            {showImageDialog && (
                <div className="image-dialog-overlay" onClick={handleCancelImageDialog}>
                    <div className="image-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="image-dialog-header">
                            <h5>{getValue('image_url') || 'Image URL'}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCancelImageDialog}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="image-dialog-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    {getValue('enter_image_url') || 'Enter the image URL'}
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onKeyDown={handleImageDialogKeyDown}
                                    placeholder={getValue('image_url_placeholder') || 'https://example.com/image.jpg'}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="image-dialog-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary me-2"
                                onClick={handleCancelImageDialog}
                            >
                                {getValue('cancel') || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleInsertImage}
                                disabled={!imageUrl.trim()}
                            >
                                {getValue('save') || 'Insert'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TextEditor;
