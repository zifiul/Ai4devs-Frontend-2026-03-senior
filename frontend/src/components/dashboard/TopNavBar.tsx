import React, { useState } from 'react';

const TopNavBar: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <header className="fixed top-0 left-[256px] right-0 h-[48px] bg-[#f9f9f9] border-b border-[#e2e2e2] flex items-center justify-between px-6 z-20">
      <div className="bg-white border border-[#e2e2e2] rounded-[2px] w-[256px] h-[34px] flex items-center px-2 gap-2">
        <svg className="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          className="flex-1 text-[14px] text-[#6b7280] outline-none bg-transparent"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Global search"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-[#737687] hover:text-[#1a1c1c]"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <button
          type="button"
          className="text-[#737687] hover:text-[#1a1c1c]"
          aria-label="Help"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <div className="rounded-full w-8 h-8 border border-[#e2e2e2] overflow-hidden bg-[#e2e2e2] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#737687]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
