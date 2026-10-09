import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header({ activeCategory, setActiveCategory, setCurrentTab, theme, onToggleTheme }) {
    const categories = ["React", "Tailwind", "Fullstack", "UI/UX"];

    return (
        <header className='header-panel border-b border-slate-200/80 pb-6 mb-8'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
                <div className='max-w-2xl'>
                    <button
                        type='button'
                        onClick={() => setCurrentTab('dashboard')}
                        className='inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 transition-colors hover:border-indigo-200 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300'
                    >
                        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' />
                        Portfolio workspace
                    </button>
                    <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
                        Ilma's Portfolio
                    </h2>
                    <p className='mt-2 text-sm leading-6 text-slate-500 sm:text-base'>
                        Frontend Developer | Learning Backend building connected, useful web experiences.
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                    <button
                        type='button'
                        onClick={() => setCurrentTab('projects')}
                        className='hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:flex'
                    >
                        <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                        Live workspace
                    </button>
                </div>
            </div>
            <div className='mt-8 flex space-x-2 overflow-x-auto pb-2 scrollbar-none'>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                            activeCategory === cat
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </header>
    )
}
