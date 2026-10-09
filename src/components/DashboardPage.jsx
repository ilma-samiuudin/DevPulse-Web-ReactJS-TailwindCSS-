import ProjectCard from "./ProjectCard";

export default function DashboardPage({ projects, filteredProjects, reactCount, fullstackCount }) {
  const totalProjects = projects.length;

  return (
    <>
      <section className="dashboard-intro mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(79,70,229,0.35)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Ilma · Frontend Developer | Learning Backend
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              I build web apps from interface to API.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              I work across responsive React interfaces, backend services, and the data that brings them together.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">{projects.length} projects in portfolio</span>
            <span className="rounded-full bg-indigo-50 px-3 py-2 text-indigo-700">{reactCount} React</span>
            <span className="rounded-full bg-violet-50 px-3 py-2 text-violet-700">{fullstackCount} Frontend</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-50 transition-transform duration-500 group-hover:scale-125" />
          <p className="relative text-xs font-semibold text-slate-400 uppercase tracking-wider">Total projects</p>
          <p className="relative text-3xl font-black text-slate-900 mt-2">
            {totalProjects}<span className="ml-2 text-base font-semibold text-slate-400">works</span>
          </p>
        </div>
        <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-100 transition-transform duration-500 group-hover:scale-125" />
          <p className="relative text-xs font-semibold text-slate-400 uppercase tracking-wider">React projects</p>
          <p className="relative text-3xl font-black text-indigo-600 mt-2">
            {reactCount}<span className="ml-2 text-base font-semibold text-slate-400">built</span>
          </p>
        </div>
        <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 transition-transform duration-500 group-hover:scale-125" />
          <p className="relative text-xs font-semibold text-slate-400 uppercase tracking-wider">Frontend work</p>
          <p className="relative text-3xl font-black text-emerald-600 mt-2">
            {fullstackCount}<span className="ml-2 text-base font-semibold text-slate-400">items</span>
          </p>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          No projects Found in this category
        </div>
      )}
    </>
  );
}