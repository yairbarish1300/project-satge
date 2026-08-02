import { useState } from 'react';
import { useCategoryTree } from '../../context/CategoryTreeContext';
import BranchCard from './BranchCard';

export default function CategoryManager() {
  const { branches, addBranch } = useCategoryTree();
  const [newBranchName, setNewBranchName] = useState('');

  const onAddBranch = () => {
    if (!addBranch(newBranchName)) return;
    setNewBranchName('');
  };

  return (
    <section className="dashboard-category-manager">
      <div className="dashboard-category-head">
        <h3>ניהול קטגוריות לחנות</h3>
        <p>הוספה והסרה של ענפים ועלים. העדכון מופיע מיידית ב־Store.</p>
      </div>

      <div className="dashboard-category-add-branch">
        <input value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} placeholder="שם ענף חדש" />
        <button onClick={onAddBranch}>הוסף ענף</button>
      </div>

      <div className="dashboard-branches-grid">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>
    </section>
  );
}
