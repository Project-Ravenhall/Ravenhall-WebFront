import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `block px-4 py-2.5 rounded-lg transition-colors font-semibold tracking-wide text-center border ${
      isActive
        ? 'bg-surface-hover/50 border-borderbase/50 text-indigo-400'
        : 'border-transparent text-primary hover:bg-surface-hover/30 hover:text-white'
    }`;
  };

  return (
    <div className="w-64 bg-base border-r border-surface-hover hidden md:flex flex-col p-6 shrink-0">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <img src="/favicon.svg" alt="Logo" className="w-8 h-8 rounded-md shadow-sm" />
        <h1 className="text-2xl font-bold text-white tracking-wide">Ravenhall</h1>
      </div>
      <nav className="flex flex-col gap-3 font-medium">
        <Link to="/home" className={getLinkClass('/home')}>
          Home
        </Link>
        <Link to="/settings" className={getLinkClass('/settings')}>
          Settings
        </Link>
      </nav>
    </div>
  );
};
