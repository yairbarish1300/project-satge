import type { CategoryBranch } from '../../context/CategoryTreeContext';

interface CategorySidebarProps {
  branches: CategoryBranch[];
  selectedLeafIds: string[];
  onLeafToggle: (id: string) => void;
}

export default function CategorySidebar({ branches, selectedLeafIds, onLeafToggle }: CategorySidebarProps) {
  return (
    <aside className="rp-sidebar">
      <h3>קטגוריות</h3>
      {branches.map((branch) => (
        <div key={branch.id} className="rp-category-branch">
          <p className="rp-category-branch-title">{branch.name}</p>
          {branch.leaves.map((leaf) => (
            <label key={leaf.id} className="rp-check">
              <input type="checkbox" checked={selectedLeafIds.includes(leaf.id)} onChange={() => onLeafToggle(leaf.id)} />
              <span>{leaf.name}</span>
            </label>
          ))}
        </div>
      ))}
    </aside>
  );
}
