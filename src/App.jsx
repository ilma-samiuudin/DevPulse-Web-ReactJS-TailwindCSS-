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
const mobileNavigationItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "ledger", label: "Ledger" },
];
const DISALLOWED_TECH = new Set([
  "node.js",
  "nodejs",
  "mongodb",
  "mongo db",
  "tailwind v4",
  "tailwindv4",
  "local storage",
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
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "dark");
  const [projects, setProjects] = useState(getInitialProjects);

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
  }

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
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">
              DevPulse
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-700">Portfolio workspace</p>
          </div>
        </div>

        <main className="w-full px-3 py-5 pb-24 sm:px-5 sm:py-6 sm:pb-24 lg:px-8 lg:py-10 2xl:px-10">
          <Header
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setCurrentTab={setCurrentTab}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {currentTab === "dashboard" && (
            <DashboardPage
              projects={projects}
              filteredProjects={filteredProjects}
              reactCount={reactCount}
              fullstackCount={fullstackCount}
              onOpenProjects={() => setCurrentTab("projects")}
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

        <nav className="mobile-nav md:hidden" aria-label="Mobile navigation">
          {mobileNavigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={currentTab === item.id ? "page" : undefined}
              onClick={() => setCurrentTab(item.id)}
              className={`mobile-nav-item ${currentTab === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <footer className="mt-10 border-t border-slate-200/80 px-3 py-6 pb-24 text-xs text-slate-500 sm:px-5 md:px-8 md:pb-6 2xl:px-10">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
