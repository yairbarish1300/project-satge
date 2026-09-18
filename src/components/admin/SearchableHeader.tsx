import { useEffect, useRef, useState } from 'react';
import AdminPageHeader from './AdminPageHeader';

export interface FilterOption {
  value: string;
  label: string;
}

interface SearchableHeaderProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  // When provided, the filter button opens a dropdown of these options
  // instead of sitting there doing nothing. 'all' is treated as "no filter".
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}

export default function SearchableHeader({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  activeFilter,
  onFilterChange,
}: SearchableHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const hasFilters = Boolean(filterOptions?.length && onFilterChange);
  const isFilterActive = Boolean(activeFilter && activeFilter !== 'all');

  return (
    <div className="orders-top">
      <AdminPageHeader title={title} description={description} />
      <div className="orders-search-group">
        <div className="orders-search-wrap">
          <span className="msym orders-search-icon">search</span>
          <input
            className="orders-search"
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {hasFilters && (
          <div className="orders-filter-wrap" ref={wrapRef}>
            <button
              type="button"
              className={`orders-filter-btn ${isFilterActive ? 'active' : ''}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-label="סינון"
            >
              <span className="msym">filter_list</span>
            </button>

            {isOpen && (
              <ul className="orders-filter-menu" role="listbox">
                {filterOptions!.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`orders-filter-option ${activeFilter === opt.value ? 'active' : ''}`}
                      onClick={() => {
                        onFilterChange!(opt.value);
                        setIsOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
