import { useMemo, useState } from "react";

const statusOptions = ["All", "Active", "In progress", "Completed", "Planning"];

export default function ProjectLedger({ projects }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category))],
    [projects]
  );
  const visibleProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase();
    const searchableText = [project.title, project.category, project.description, ...(project.tech || [])]
      .join(" ")
      .toLowerCase();
    return (
      searchableText.includes(query) &&
      (statusFilter === "All" || (project.status || "Active") === statusFilter) &&
      (categoryFilter === "All" || project.category === categoryFilter)
    );
  });

  function formatDate(value) {
    if (!value) return "Not specified";
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  return (
    <section className="animate-fade-up">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Workspace records</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Project ledger</h1>
          <p className="mt-2 text-sm text-slate-500">Review project status, stack, and details in one place.</p>
        </div>
        <p className="text-sm font-semibold text-slate-500">{visibleProjects.length} of {projects.length} projects</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by project, technology, or category"
          aria-label="Search ledger projects"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter ledger by status"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter ledger by category"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="All">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">Project</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Technologies</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleProjects.map((project) => {
              const status = project.status || "Active";
              return (
                <tr key={project.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="text-left font-bold text-slate-900 underline decoration-transparent underline-offset-4 transition-colors hover:text-indigo-600 hover:decoration-current focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {project.title}
                    </button>
                    <p className="mt-1 max-w-sm truncate text-xs text-slate-500">{project.description}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{project.category}</td>
                  <td className="px-5 py-4 text-slate-600">{(project.tech || []).join(", ") || "Not specified"}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />{status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{formatDate(project.createdAt)}</td>
                </tr>
              );
            })}
            {visibleProjects.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">
                  No projects match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ledger-project-title"
            className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{selectedProject.category}</p>
                <h2 id="ledger-project-title" className="mt-2 text-2xl font-black text-slate-900">{selectedProject.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">×</button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">{selectedProject.description}</p>
            <p className="mt-4 text-sm text-slate-500"><span className="font-semibold text-slate-700">Status:</span> {selectedProject.status || "Active"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(selectedProject.tech || []).map((technology) => (
                <span key={technology} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{technology}</span>
              ))}
            </div>
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
              <button type="button" onClick={() => setSelectedProject(null)} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500">Close</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}