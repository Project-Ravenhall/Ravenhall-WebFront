import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';

export const Settings = () => {
  const [titlePref, setTitlePref] = useState(localStorage.getItem('titlePref') || 'local');
  const [authorPref, setAuthorPref] = useState(localStorage.getItem('authorPref') || 'local');

  useEffect(() => {
    localStorage.setItem('titlePref', titlePref);
  }, [titlePref]);

  useEffect(() => {
    localStorage.setItem('authorPref', authorPref);
  }, [authorPref]);

  return (
    <div className="flex h-screen w-full bg-surface text-primary font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-surface-hover px-8 py-5">
          <h2 className="text-xl font-semibold">Settings</h2>
        </header>

        <div className="w-full flex-1 p-8">
          
          <div className="w-full max-w-5xl mb-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white">Book Display Preferences</h3>
              <p className="text-sm text-muted mt-1">Choose how book metadata is displayed across your library.</p>
            </div>
            
            <div className="w-full flex flex-col gap-10">
              
              <fieldset className="flex flex-col">
                <legend className="text-sm font-medium text-white tracking-wide mb-4 uppercase">Book Title Source</legend>
                <div className="flex flex-col gap-3 w-full">
                  <label className="flex w-full items-center gap-4 px-6 py-5 rounded-xl cursor-pointer transition-colors bg-surface-hover/30 hover:bg-surface-hover border border-transparent has-[:checked]:bg-indigo-500/10 has-[:checked]:border-indigo-500/50">
                    <input type="radio" name="title" value="local" checked={titlePref === 'local'} onChange={(e) => setTitlePref(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                    <div>
                      <div className="font-medium text-white text-base">Local Title</div>
                      <div className="text-sm text-muted mt-0.5">Use the original filename or embedded metadata</div>
                    </div>
                  </label>
                  
                  <label className="flex w-full items-center gap-4 px-6 py-5 rounded-xl cursor-pointer transition-colors bg-surface-hover/30 hover:bg-surface-hover border border-transparent has-[:checked]:bg-indigo-500/10 has-[:checked]:border-indigo-500/50">
                    <input type="radio" name="title" value="api" checked={titlePref === 'api'} onChange={(e) => setTitlePref(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                    <div>
                      <div className="font-medium text-white text-base">API Title</div>
                      <div className="text-sm text-muted mt-0.5">Use the clean title fetched from Google Books</div>
                    </div>
                  </label>
                </div>
              </fieldset>

              <fieldset className="flex flex-col">
                <legend className="text-sm font-medium text-white tracking-wide mb-4 uppercase">Book Authors Source</legend>
                <div className="flex flex-col gap-3 w-full">
                  <label className="flex w-full items-center gap-4 px-6 py-5 rounded-xl cursor-pointer transition-colors bg-surface-hover/30 hover:bg-surface-hover border border-transparent has-[:checked]:bg-indigo-500/10 has-[:checked]:border-indigo-500/50">
                    <input type="radio" name="authors" value="local" checked={authorPref === 'local'} onChange={(e) => setAuthorPref(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                    <div>
                      <div className="font-medium text-white text-base">Local Authors</div>
                      <div className="text-sm text-muted mt-0.5">Use the authors found in the original file</div>
                    </div>
                  </label>
                  
                  <label className="flex w-full items-center gap-4 px-6 py-5 rounded-xl cursor-pointer transition-colors bg-surface-hover/30 hover:bg-surface-hover border border-transparent has-[:checked]:bg-indigo-500/10 has-[:checked]:border-indigo-500/50">
                    <input type="radio" name="authors" value="api" checked={authorPref === 'api'} onChange={(e) => setAuthorPref(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                    <div>
                      <div className="font-medium text-white text-base">API Authors</div>
                      <div className="text-sm text-muted mt-0.5">Use the official authors from Google Books</div>
                    </div>
                  </label>
                </div>
              </fieldset>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
