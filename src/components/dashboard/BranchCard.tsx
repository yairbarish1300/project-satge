import { useState } from 'react';
import { useCategoryTree, type CategoryBranch } from '../../context/CategoryTreeContext';

interface BranchCardProps {
  branch: CategoryBranch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const { removeBranch, renameBranch, addLeaf, removeLeaf, renameLeaf } = useCategoryTree();

  const [leafDraft, setLeafDraft] = useState('');
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [branchEditDraft, setBranchEditDraft] = useState('');
  const [editingLeafId, setEditingLeafId] = useState<string | null>(null);
  const [leafEditDraft, setLeafEditDraft] = useState('');

  const startBranchEdit = () => {
    setIsEditingBranch(true);
    setBranchEditDraft(branch.name);
  };

  const saveBranchEdit = () => {
    if (!renameBranch(branch.id, branchEditDraft)) return;
    setIsEditingBranch(false);
  };

  const onAddLeaf = () => {
    if (!addLeaf(branch.id, leafDraft)) return;
    setLeafDraft('');
  };

  const startLeafEdit = (leafId: string, currentName: string) => {
    setEditingLeafId(leafId);
    setLeafEditDraft(currentName);
  };

  const saveLeafEdit = (leafId: string) => {
    if (!renameLeaf(branch.id, leafId, leafEditDraft)) return;
    setEditingLeafId(null);
  };

  return (
    <article className="dashboard-branch-card">
      <div className="dashboard-branch-head">
        {isEditingBranch ? (
          <div className="dashboard-edit-wrap">
            <input className="dashboard-edit-input" value={branchEditDraft} onChange={(e) => setBranchEditDraft(e.target.value)} />
            <button className="dashboard-edit-btn save" onClick={saveBranchEdit}>שמור</button>
            <button className="dashboard-edit-btn cancel" onClick={() => setIsEditingBranch(false)}>ביטול</button>
          </div>
        ) : (
          <>
            <h4>{branch.name}</h4>
            <div className="dashboard-branch-actions">
              <button className="dashboard-edit-btn" onClick={startBranchEdit}>ערוך</button>
              <button className="dashboard-remove-btn" onClick={() => removeBranch(branch.id)}>הסר ענף</button>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-leaf-list">
        {branch.leaves.length ? (
          branch.leaves.map((leaf) => (
            <div className="dashboard-leaf-item" key={leaf.id}>
              {editingLeafId === leaf.id ? (
                <div className="dashboard-edit-wrap compact">
                  <input className="dashboard-edit-input" value={leafEditDraft} onChange={(e) => setLeafEditDraft(e.target.value)} />
                  <button className="dashboard-edit-btn save small" onClick={() => saveLeafEdit(leaf.id)}>שמור</button>
                  <button className="dashboard-edit-btn cancel small" onClick={() => setEditingLeafId(null)}>ביטול</button>
                </div>
              ) : (
                <>
                  <span>{leaf.name}</span>
                  <div className="dashboard-branch-actions">
                    <button className="dashboard-edit-btn small" onClick={() => startLeafEdit(leaf.id, leaf.name)}>ערוך</button>
                    <button className="dashboard-remove-btn small" onClick={() => removeLeaf(branch.id, leaf.id)}>הסר</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="dashboard-empty-copy">אין עלים בענף הזה</p>
        )}
      </div>

      <div className="dashboard-add-leaf">
        <input value={leafDraft} onChange={(e) => setLeafDraft(e.target.value)} placeholder="שם עלה חדש" />
        <button onClick={onAddLeaf}>הוסף עלה</button>
      </div>
    </article>
  );
}
