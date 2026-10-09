import React from 'react';

export default function ProjectCard({ project}) {
    return (
        <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between h-full'>
            <div>
                <div className='flex justify-between items-start gap-4'>
                    <h3 className='font-bold text-xl text-slate-900 group-hover:text-indigo-600 trasition-colors'>
                        {project.title}
                    </h3>
                    <span className='text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600'>
                        {project.category}
                    </span>
                </div>

                <p className='text-sm text-slate-500 mt-3 leading-relaxed'>
                    {project.description}
                </p>
            </div>

            <div className='flex flex-wrap gap-2 mt-6'>
                {project.tech.map((techItem, index) => (
                    <span key={index} className='text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium'>
                        {techItem}
                    </span>
                ))}
            </div>
        </div>
    );
}