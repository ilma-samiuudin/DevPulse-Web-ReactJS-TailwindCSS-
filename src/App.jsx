import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProjectsPage from "./components/ProjectsPage";
import DashboardPage from "./components/DashboardPage";
import AboutPage from "./components/AboutPage";
import ProjectLedger from "./components/ProjectLedger";
import { projectsData } from "./data/ProjectsData";
import { projectMatchesCategory } from "./data/ProjectCategories";

const STORAGE_KEY = "devpulse-projects";
const THEME_STORAGE_KEY = "devpulse-theme";
const DISALLOWED_TECH = new Set([
  "node.js",
  "nodejs",
  "mongodb",
  "mongo db",
  "tailwind v4",
  "tailwindv4",
  "vite",
]);

function normalizeTechValue(value) {
  return String(value || "").trim();
}

function sanitizeProjects(projectList) {
  if (!Array.isArray(projectList)) {
    return projectsData;
  }

  return projectList
    .filter(Boolean)
    .map((project) => ({
      ...project,
      tech: Array.isArray(project.tech)
        ? project.tech
            .map(normalizeTechValue)
            .filter((tech) => tech && !DISALLOWED_TECH.has(tech.toLowerCase().replace(/\s+/g, " ").trim()))
        : [],
    }));
}

function getInitialProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? sanitizeProjects(JSON.parse(saved)) : projectsData;
  } catch {
    return projectsData;
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("React");
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "light");
  const [projects, setProjects] = useState(getInitialProjects);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => projectMatchesCategory(project, activeCategory));

  const reactCount = projects.filter((p) => p.category === "React").length;
  const fullstackCount = projects.filter(
    (p) => p.category === "Fullstack"
  ).length;

  return (
    <div className="app-shell min-h-screen flex text-slate-800 font-sans">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-panel flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="mobile-topbar md:hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">
              DevPulse
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">Portfolio workspace</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-center text-sm font-bold leading-8 text-indigo-600">
            {projects.length}
          </div>
        </div>

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Header
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setCurrentTab={setCurrentTab}
            theme={theme}
            onToggleTheme={() => setTheme((current) => current === "light" ? "dark" : "light")}
          />

          {currentTab === "dashboard" && (
            <DashboardPage
              projects={projects}
              filteredProjects={filteredProjects}
              reactCount={reactCount}
              fullstackCount={fullstackCount}
            />
          )}

          {currentTab === "projects" && (
            <ProjectsPage projects={projects} setProjects={setProjects} />
          )}

          {currentTab === "about" && <AboutPage />}

          {currentTab !== "dashboard" && currentTab !== "projects" && currentTab !== "about" && (
            <ProjectLedger projects={projects} />
          )}
        </main>

        <footer className="mt-10 border-t border-slate-200/80 px-6 py-6 text-xs text-slate-500 md:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span>DevPulse • Built to organize creative work.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Portfolio workspace</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Clean, focused, responsive</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
