import AdminPageHeader from './AdminPageHeader';

interface SearchableHeaderProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
}

export default function SearchableHeader({ title, description, searchValue, onSearchChange, searchPlaceholder }: SearchableHeaderProps) {
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
        <button className="orders-filter-btn"><span className="msym">filter_list</span></button>
      </div>
    </div>
  );
}
