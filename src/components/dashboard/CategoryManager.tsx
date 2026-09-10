import { useState } from 'react';
import { useCategoryTree } from '../../context/CategoryTreeContext';
import BranchCard from './BranchCard';

export default function CategoryManager() {
  const { branches, loading, error, addBranch } = useCategoryTree();
  const [newBranchName, setNewBranchName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onAddBranch = async () => {
    if (!newBranchName.trim() || submitting) return;
    setSubmitting(true);
    try {
      if (await addBranch(newBranchName)) {
        setNewBranchName('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="dashboard-category-manager">
      <div className="dashboard-category-head">
        <h3>ניהול קטגוריות לחנות</h3>
        <p>הוספה והסרה של ענפים ועלים. העדכון מופיע מיידית ב־Store.</p>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="dashboard-category-add-branch">
        <input
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddBranch()}
          placeholder="שם ענף חדש"
        />
        <button onClick={onAddBranch} disabled={submitting}>{submitting ? 'מוסיף...' : 'הוסף ענף'}</button>
      </div>

      {loading ? (
        <p className="admin-loading-row">טוען קטגוריות...</p>
      ) : (
        <div className="dashboard-branches-grid">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      )}
    </section>
  );
}
