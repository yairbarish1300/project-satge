import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCatalog } from '../context/ProductCatalogContext';
import './Header.css';

interface HeaderProps {
  currentPage?: 'home' | 'shop' | 'inventory' | 'orders' | 'dashboard' | 'login' | 'checkout' | 'product' | 'contact';
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const MAX_SUGGESTIONS = 6;

export default function Header({
  currentPage = 'home',
  showSearch = true,
  searchValue = '',
  onSearchChange = () => {},
}: HeaderProps) {
  const navigate = useNavigate();
  const { products } = useProductCatalog();
  const [searchInput, setSearchInput] = useState(searchValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matches = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, MAX_SUGGESTIONS);
  }, [searchInput, products]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onSearchChange(value);
    setIsDropdownOpen(true);
  };

  const goToProductOrder = (productId: string) => {
    setIsDropdownOpen(false);
    setSearchInput('');
    onSearchChange('');
    navigate(`/checkout?productId=${productId}`);
  };

  const handleSearchBlur = () => {
    // Delay closing so a click on a dropdown option registers before it unmounts.
    blurTimeout.current = setTimeout(() => setIsDropdownOpen(false), 150);
  };

  const handleSearchFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setIsDropdownOpen(true);
  };

  const isActive = (page: string) => currentPage === page;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Left: Logo + Nav */}
        <div className="app-header-left">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="app-header-logo"
          >
            STAGE
          </a>
          <nav className="app-header-nav">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className={`app-header-link ${isActive('home') ? 'active' : ''}`}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop');
              }}
              className={`app-header-link ${isActive('shop') ? 'active' : ''}`}
            >
              Shop
            </a>
          </nav>
        </div>

        {/* Right: Search + Login */}
        <div className="app-header-right">
          {showSearch && (
            <div className="app-header-search-wrap">
              <input
                type="text"
                placeholder="חיפוש ציוד..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="app-header-search"
                role="combobox"
                aria-expanded={isDropdownOpen && matches.length > 0}
                aria-autocomplete="list"
                autoComplete="off"
              />
              <span className="app-header-search-icon msym">
                search
              </span>

              {isDropdownOpen && matches.length > 0 && (
                <ul className="app-header-search-results" role="listbox">
                  {matches.map((product) => (
                    <li key={product.id} role="option" aria-selected={false}>
                      <button
                        type="button"
                        className="app-header-search-result"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToProductOrder(product.id)}
                      >
                        <span className="app-header-search-result-name">{product.name}</span>
                        <span className="app-header-search-result-cta">
                          הזמן
                          <span className="msym">arrow_back</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            onClick={() => navigate('/login')}
            className="app-header-login"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
