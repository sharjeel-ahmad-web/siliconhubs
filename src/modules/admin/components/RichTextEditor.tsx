'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-300 bg-slate-50 p-2">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="mx-1 w-px bg-slate-300" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1 w-px bg-slate-300" />

        <button
          type="button"
          onClick={insertLink}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<pre>')}
          className="rounded p-2 transition-colors hover:bg-slate-200"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <style jsx>{`
        .rich-text-editor:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          rich-text-editor prose prose-slate min-h-[200px] max-w-none p-4 outline-none
          ${isFocused ? 'ring-2 ring-inset ring-[#2563EB]' : ''}
        `}
        data-placeholder={placeholder}
      />
    </div>
  );
}
