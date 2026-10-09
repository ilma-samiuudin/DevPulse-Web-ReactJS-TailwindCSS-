import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
    const navigationItems = [
        { id: "dashboard", label: "Dashboard" },
        { id: "projects", label: "My Projects" },
        { id: "about", label: "About" },
        { id: "ledger", label: "Project Ledger" },
    ];

    return (
        <aside className='sidebar-panel hidden md:flex flex-col w-64 h-screen text-white p-6 justify-between border-r border-white/10'>
            <div>
                <div className='flex items-center gap-3'>
                    <div>
                        <h1 className='text-xl font-black tracking-wide text-[#f8fafc]'>
                            DevPulse
                        </h1>
                        <p className='text-[10px] uppercase tracking-[0.2em] text-slate-400'>
                            Frontend Developer
                        </p>
                    </div>
                </div>

                <nav className='mt-10 space-y-2' aria-label='Main navigation'>
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-current={currentTab === item.id ? "page" : undefined}
                            onClick={() => setCurrentTab(item.id)}
                            className={`relative w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                currentTab === item.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className='text-xs text-slate-600 font-mono'>
                React · Python · APIs
            </div>
        </aside>
    )
}
