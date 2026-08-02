import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  currentPage?: 'home' | 'shop' | 'inventory' | 'orders' | 'dashboard' | 'login' | 'checkout' | 'product';
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({
  currentPage = 'home',
  showSearch = true,
  searchValue = '',
  onSearchChange = () => {},
}: HeaderProps) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(searchValue);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onSearchChange(value);
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
                className="app-header-search"
              />
              <span className="app-header-search-icon msym">
                search
              </span>
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
