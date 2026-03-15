import React, { useRef } from 'react';

const TAG_COLORS = [
  'javascript','python','cpp','java','go','rust',
  'html','css','sql','bash','notes','config','other',
];

const TagInput = ({ tags, onChange }) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    const val = e.target.value.trim();
    if ((e.key === 'Enter' || e.key === ',') && val) {
      e.preventDefault();
      if (!tags.includes(val) && tags.length < 10) {
        onChange([...tags, val]);
      }
      e.target.value = '';
    } else if (e.key === 'Backspace' && !e.target.value && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="tag-input-row" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="tag-pill">
          {tag}
          <span className="tag-pill-remove" onClick={() => removeTag(tag)}>×</span>
        </span>
      ))}
      <input
        ref={inputRef}
        className="tag-raw-input"
        placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : ''}
        onKeyDown={handleKeyDown}
        id="tag-input"
      />
    </div>
  );
};

export default TagInput;
