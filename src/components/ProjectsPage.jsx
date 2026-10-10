import { useEffect, useMemo, useRef, useState } from "react";
import { getAvailableProjectCategories, projectMatchesCategory } from "../data/ProjectCategories";

const statusOptions = ["Active", "In progress", "Completed", "Planning"];
const categoryOptions = [
  "React",
  "Tailwind",
  "Fullstack",
  "UI/UX",
  "Context API",
  "REST API",
  "JWT",
];

export default function ProjectsPage({ projects, setProjects }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({
    title: "",
    category: "React",
    description: "",
    tech: "",
    status: "Active",
  });
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeStatus, setActiveStatus] = useState("Active");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (!isFormOpen && !selectedProject) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFormOpen(false);
        setSelectedProject(null);
      }
    };

    const previousFocus = document.activeElement;
    formRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isFormOpen, selectedProject]);

  const categoryFilters = useMemo(() => getAvailableProjectCategories(projects), [projects]);

  const categories = useMemo(
    () =>
      categoryFilters.map((category) => ({
        name: category,
        count: projects.filter((project) => projectMatchesCategory(project, category)).length,
      })),
    [categoryFilters, projects]
  );
  const statusCounts = useMemo(
    () => Object.fromEntries(
      statusOptions.map((status) => [
        status,
        projects.filter((project) => (project.status || "Active") === status).length,
      ])
    ),
    [projects]
  );

  const totalProjects = projects.length;
  const visibleProjects = projects.filter((project) => {
    const matchesSearch = `${project.title} ${project.description} ${project.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = projectMatchesCategory(project, activeFilter);
    const matchesStatus = activeStatus === "All" || (project.status || "Active") === activeStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const matchingProjectNames = projects.filter((project) =>
    project.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  function openCreateForm() {
    setFormMode("create");
    setFormData({ title: "", category: "React", description: "", tech: "", status: "Active" });
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(project) {
    setFormMode("edit");
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      tech: project.tech.join(", "),
      status: project.status || "Active",
    });
    setSelectedProject(project);
    setError("");
    setIsFormOpen(true);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const techList = formData.tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!title || !description || techList.length === 0) {
      setError("Please add a title, description, and at least one technology.");
      return;
    }

    const projectData = {
      id: formMode === "edit" ? selectedProject.id : Date.now(),
      title,
      category: formData.category,
      description,
      tech: techList,
      status: formData.status,
      createdAt: formMode === "edit" ? selectedProject.createdAt : new Date().toISOString(),
    };

    if (formMode === "edit") {
      setProjects((current) =>
        current.map((project) => (project.id === selectedProject.id ? projectData : project))
      );
    } else {
      setProjects((current) => [projectData, ...current]);
    }

    setFormData({ title: "", category: "React", description: "", tech: "", status: "Active" });
    setIsFormOpen(false);
    setSelectedProject(null);
    setShowSuccess(true);
    setError("");

    window.setTimeout(() => setShowSuccess(false), 2600);
  }

  function handleDeleteProject(projectId) {
    setProjects((current) => current.filter((project) => project.id !== projectId));
    setSelectedProject(null);
  }

  function formatDate(value) {
    if (!value) return "Recently added";
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  return (
    <div className="projects-page animate-fade-up">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Project workspace
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Your projects
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Track every project and keep your portfolio growing.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
            +
          </span>
          Add new work
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            type="search"
            list="project-name-suggestions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <datalist id="project-name-suggestions">
            {matchingProjectNames.map((project) => (
              <option key={project.id} value={project.title} />
            ))}
          </datalist>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:items-end">
          <div className="flex w-full gap-2 overflow-x-auto py-1 md:justify-end" aria-label="Filter projects by status">
            {['All', ...statusOptions].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                aria-pressed={activeStatus === status}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                  {status}<span className="ml-1 opacity-70">{status === 'All' ? totalProjects : statusCounts[status]}</span>
              </button>
            ))}
          </div>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto py-1 md:justify-start" aria-label="Filter projects by category">
            {['All', ...categoryFilters].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total projects</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{totalProjects}</p>
        </div>
        {categories.filter((category) => category.count > 0).map((category) => (
          <div
            key={category.name}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{category.name}</p>
            <p className="mt-3 text-3xl font-black text-indigo-600">{category.count}</p>
          </div>
        ))}
      </div>

      {visibleProjects.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="project-card group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-card-in"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                    {project.category}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-indigo-600">
                    {project.title}
                  </h2>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((techItem) => (
                  <span
                    key={`${project.id}-${techItem}`}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  >
                    {techItem}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className={`inline-flex items-center gap-2 text-xs font-semibold ${
                  project.status === 'Completed'
                    ? 'text-emerald-600'
                    : project.status === 'In progress'
                      ? 'text-amber-600'
                      : project.status === 'Planning'
                        ? 'text-violet-600'
                        : 'text-slate-600'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {project.status || 'Active'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="text-sm font-bold text-indigo-600 transition-transform hover:translate-x-1"
                >
                  View details →
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center shadow-inner">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-600">
            ✦
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">No projects match your search</h2>
          <p className="mt-2 text-sm text-slate-500">Try a different keyword or add a new project.</p>
        </div>
      )}

      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-base">✓</span>
            Project saved successfully
          </div>
        </div>
      )}

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <article
            ref={formRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  {selectedProject.category}
                </p>
                <h2 id="project-details-title" className="mt-2 text-2xl font-black text-slate-900">
                  {selectedProject.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Added {formatDate(selectedProject.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {selectedProject.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedProject.tech.map((techItem) => (
                <span key={`${selectedProject.id}-${techItem}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {techItem}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                Delete project
              </button>
              <button
                type="button"
                onClick={() => openEditForm(selectedProject)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Edit project
              </button>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </article>
        </div>
      )}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            ref={formRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-project-title"
            className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  New project
                </p>
                <h2 id="add-project-title" className="mt-2 text-2xl font-black text-slate-900">
                  Add your work
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label="Close project form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
                  Project name
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Portfolio redesign"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe what you built and what makes it special..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="tech" className="mb-2 block text-sm font-semibold text-slate-700">
                  Technologies
                </label>
                <input
                  id="tech"
                  name="tech"
                  value={formData.tech}
                  onChange={handleInputChange}
                  placeholder="React, Tailwind CSS, Context API"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-semibold text-slate-700">
                  Project status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  {formMode === "edit" ? "Save changes" : "Save project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
