import React from 'react';
import { FiSearch, FiAward, FiActivity, FiUser } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const Header = ({ title, icon, showSearch = false, showFilters = false, onSearch }) => {
  const { user, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery } = useApp();

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'stem', name: 'STEM' },
    { id: 'languages', name: 'Languages' },
    { id: 'tech', name: 'Tech' },
    { id: 'arts', name: 'Arts' },
    { id: 'business', name: 'Business' },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
        {/* --- Compact Top Bar --- */}
        <div className="flex items-center justify-between h-14">
          {/* Left: Title */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 bg-blue-400 rounded-md">
              {icon && React.cloneElement(icon, { className: "w-3.5 h-3.5 text-white" })}
            </div>
            <h1 className="text-lg font-semibold text-slate-900 leading-none">{title}</h1>
          </div>

          {/* Right: Stats + Avatar */}
          <div className="flex items-center gap-3">
            {/* Aura Points */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
              <FiAward className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                {user.auraPoints.toLocaleString()}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-md border border-orange-100">
              <FiActivity className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">{user.streak}</span>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
              <FiUser className="w-3.5 h-3.5 text-white" />
            </div>
          
     
          </div>
        </div>

        {/* --- Search & Filter Row --- */}
        {(showSearch || showFilters) && (
          <div className="flex items-center gap-3 py-2.5 border-t border-slate-100">
            {/* Search */}
            {showSearch && (
              <div className="flex-1 relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-500 text-sm"
                />
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryFilter(category.name)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap border transition-all duration-200 flex-shrink-0 ${
                      categoryFilter === category.name
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
