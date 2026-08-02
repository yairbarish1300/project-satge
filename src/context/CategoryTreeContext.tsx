import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const CATEGORY_STORAGE_KEY = 'stage-category-tree-v1';

export type CategoryLeaf = {
  id: string;
  name: string;
};

export type CategoryBranch = {
  id: string;
  name: string;
  leaves: CategoryLeaf[];
};

type CategoryTreeContextType = {
  branches: CategoryBranch[];
  addBranch: (name: string) => boolean;
  removeBranch: (branchId: string) => void;
  renameBranch: (branchId: string, nextName: string) => boolean;
  addLeaf: (branchId: string, leafName: string) => boolean;
  removeLeaf: (branchId: string, leafId: string) => void;
  renameLeaf: (branchId: string, leafId: string, nextName: string) => boolean;
};

const CategoryTreeContext = createContext<CategoryTreeContextType | null>(null);

const INITIAL_BRANCHES: CategoryBranch[] = [
  {
    id: 'branch-audio',
    name: 'Audio',
    leaves: [
      { id: 'leaf-speaker', name: 'רמקול' },
      { id: 'leaf-mic', name: 'מיקרופון' },
      { id: 'leaf-amp', name: 'מגבר' },
    ],
  },
  {
    id: 'branch-lighting',
    name: 'Lighting',
    leaves: [{ id: 'leaf-lighting', name: 'תאורה' }],
  },
  {
    id: 'branch-accessories',
    name: 'Accessories',
    leaves: [{ id: 'leaf-headphones', name: 'אוזניות' }],
  },
];

function normalizedName(value: string) {
  return value.trim().toLowerCase();
}

export function CategoryTreeProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<CategoryBranch[]>(() => {
    if (typeof window === 'undefined') return INITIAL_BRANCHES;
    try {
      const raw = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
      if (!raw) return INITIAL_BRANCHES;
      const parsed = JSON.parse(raw) as CategoryBranch[];
      if (!Array.isArray(parsed)) return INITIAL_BRANCHES;
      return parsed;
    } catch {
      return INITIAL_BRANCHES;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(branches));
  }, [branches]);

  const value = useMemo<CategoryTreeContextType>(() => {
    const addBranch = (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return false;
      const exists = branches.some((b) => normalizedName(b.name) === normalizedName(trimmed));
      if (exists) return false;

      setBranches((prev) => [...prev, { id: `branch-${Date.now()}`, name: trimmed, leaves: [] }]);
      return true;
    };

    const removeBranch = (branchId: string) => {
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
    };

    const renameBranch = (branchId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return false;

      const exists = branches.some((branch) => branch.id !== branchId && normalizedName(branch.name) === normalizedName(trimmed));
      if (exists) return false;

      setBranches((prev) => prev.map((branch) => (branch.id === branchId ? { ...branch, name: trimmed } : branch)));
      return true;
    };

    const addLeaf = (branchId: string, leafName: string) => {
      const trimmed = leafName.trim();
      if (!trimmed) return false;

      const duplicateInBranch = branches
        .find((b) => b.id === branchId)
        ?.leaves.some((leaf) => normalizedName(leaf.name) === normalizedName(trimmed));

      if (duplicateInBranch) return false;

      setBranches((prev) =>
        prev.map((b) =>
          b.id === branchId
            ? { ...b, leaves: [...b.leaves, { id: `leaf-${Date.now()}-${Math.floor(Math.random() * 1000)}`, name: trimmed }] }
            : b,
        ),
      );

      return true;
    };

    const removeLeaf = (branchId: string, leafId: string) => {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === branchId
            ? { ...b, leaves: b.leaves.filter((leaf) => leaf.id !== leafId) }
            : b,
        ),
      );
    };

    const renameLeaf = (branchId: string, leafId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return false;

      const targetBranch = branches.find((branch) => branch.id === branchId);
      const exists = targetBranch?.leaves.some((leaf) => leaf.id !== leafId && normalizedName(leaf.name) === normalizedName(trimmed));
      if (exists) return false;

      setBranches((prev) =>
        prev.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                leaves: branch.leaves.map((leaf) => (leaf.id === leafId ? { ...leaf, name: trimmed } : leaf)),
              }
            : branch,
        ),
      );

      return true;
    };

    return {
      branches,
      addBranch,
      removeBranch,
      renameBranch,
      addLeaf,
      removeLeaf,
      renameLeaf,
    };
  }, [branches]);

  return <CategoryTreeContext.Provider value={value}>{children}</CategoryTreeContext.Provider>;
}

export function useCategoryTree() {
  const context = useContext(CategoryTreeContext);
  if (!context) {
    throw new Error('useCategoryTree must be used within CategoryTreeProvider');
  }
  return context;
}
