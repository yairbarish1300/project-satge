import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const pushTag = () => {
    const next = draft.trim();
    if (!next) return;
    if (!tags.includes(next)) onChange([...tags, next]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      pushTag();
    }
  };

  return (
    <div className="add-product-field">
      <span>תגיות</span>
      <div className="add-product-tag-input-wrap">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} placeholder="הכנס תגית ולחץ Enter" />
        <button type="button" onClick={pushTag}>הוסף</button>
      </div>
      {tags.length > 0 ? (
        <div className="add-product-tags">
          {tags.map((tag) => (
            <button key={tag} type="button" className="add-product-tag" onClick={() => onChange(tags.filter((t) => t !== tag))}>
              {tag}
              <span className="msym msym-16">close</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
