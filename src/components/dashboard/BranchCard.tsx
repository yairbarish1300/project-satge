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
  const [busy, setBusy] = useState(false);

  const startBranchEdit = () => {
    setIsEditingBranch(true);
    setBranchEditDraft(branch.name);
  };

  const saveBranchEdit = async () => {
    setBusy(true);
    try {
      if (await renameBranch(branch.id, branchEditDraft)) {
        setIsEditingBranch(false);
      }
    } finally {
      setBusy(false);
    }
  };

  const onAddLeaf = async () => {
    if (!leafDraft.trim()) return;
    setBusy(true);
    try {
      if (await addLeaf(branch.id, leafDraft)) {
        setLeafDraft('');
      }
    } finally {
      setBusy(false);
    }
  };

  const startLeafEdit = (leafId: string, currentName: string) => {
    setEditingLeafId(leafId);
    setLeafEditDraft(currentName);
  };

  const saveLeafEdit = async (leafId: string) => {
    setBusy(true);
    try {
      if (await renameLeaf(branch.id, leafId, leafEditDraft)) {
        setEditingLeafId(null);
      }
    } finally {
      setBusy(false);
    }
  };

  const onRemoveBranch = async () => {
    setBusy(true);
    try {
      await removeBranch(branch.id);
    } finally {
      setBusy(false);
    }
  };

  const onRemoveLeaf = async (leafId: string) => {
    setBusy(true);
    try {
      await removeLeaf(branch.id, leafId);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="dashboard-branch-card">
      <div className="dashboard-branch-head">
        {isEditingBranch ? (
          <div className="dashboard-edit-wrap">
            <input className="dashboard-edit-input" value={branchEditDraft} onChange={(e) => setBranchEditDraft(e.target.value)} />
            <button className="dashboard-edit-btn save" onClick={saveBranchEdit} disabled={busy}>שמור</button>
            <button className="dashboard-edit-btn cancel" onClick={() => setIsEditingBranch(false)} disabled={busy}>ביטול</button>
          </div>
        ) : (
          <>
            <h4>{branch.name}</h4>
            <div className="dashboard-branch-actions">
              <button className="dashboard-edit-btn" onClick={startBranchEdit} disabled={busy}>ערוך</button>
              <button className="dashboard-remove-btn" onClick={onRemoveBranch} disabled={busy}>הסר ענף</button>
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
                  <button className="dashboard-edit-btn save small" onClick={() => saveLeafEdit(leaf.id)} disabled={busy}>שמור</button>
                  <button className="dashboard-edit-btn cancel small" onClick={() => setEditingLeafId(null)} disabled={busy}>ביטול</button>
                </div>
              ) : (
                <>
                  <span>{leaf.name}</span>
                  <div className="dashboard-branch-actions">
                    <button className="dashboard-edit-btn small" onClick={() => startLeafEdit(leaf.id, leaf.name)} disabled={busy}>ערוך</button>
                    <button className="dashboard-remove-btn small" onClick={() => onRemoveLeaf(leaf.id)} disabled={busy}>הסר</button>
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
        <input
          value={leafDraft}
          onChange={(e) => setLeafDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddLeaf()}
          placeholder="שם עלה חדש"
        />
        <button onClick={onAddLeaf} disabled={busy}>הוסף עלה</button>
      </div>
    </article>
  );
}
