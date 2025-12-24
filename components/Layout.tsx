import React from 'react';
import { ViewState } from '../types';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  // Menu items kept in English as requested
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: HomeIcon },
    { id: ViewState.LIBRARY, label: 'Library', icon: DocumentTextIcon },
    { id: ViewState.SEARCH, label: 'Smart Search', icon: MagnifyingGlassIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-emerald-800">
          <div className="bg-white p-1.5 rounded-lg">
            <BookOpenIcon className="h-6 w-6 text-emerald-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Prospan Lib</h1>
            <p className="text-xs text-emerald-300">Kho dữ liệu thông minh</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="bg-emerald-800 rounded-lg p-3 text-xs text-emerald-200">
            <p className="font-semibold text-white mb-1">Trạng thái: Trực tuyến</p>
            <p>Đã kết nối dữ liệu.</p>
            <p>AI Engine sẵn sàng.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(n => n.id === currentView)?.label}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200">
                BS
             </div>
             <span className="text-sm text-gray-600 font-medium">Bác sĩ</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;