import { skills } from "./SkillsData";

const hiddenCategories = new Set([
  "nodejs",
  "node.js",
  "mongodb",
  "mongo db",
  "tailwindv4",
  "tailwind v4",
  "vite",
]);

export const projectCategories = [
  "React",
  "Tailwind",
  "Fullstack",
  "UI/UX",
  ...skills.filter((skill) => skill !== "React.js" && skill !== "Tailwind CSS"),
];

function normalizeCategory(value) {
  const normalized = String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases = {
    reactjs: "react",
    tailwindcss: "tailwind",
    restapis: "restapi",
    restapi: "restapi",
    nodejs: "nodejs",
    gitgithub: "gitgithub",
  };
  return aliases[normalized] || normalized;
}

export function getAvailableProjectCategories(projects = []) {
  const labels = [];
  const seen = new Set();

  projects.forEach((project) => {
    [project.category, ...(project.tech || [])].forEach((value) => {
      const label = String(value || "").trim();
      if (!label) return;

      const normalized = normalizeCategory(label);
      if (hiddenCategories.has(normalized)) return;
      if (!seen.has(normalized)) {
        seen.add(normalized);
        labels.push(label);
      }
    });
  });

  return labels;
}

export function projectMatchesCategory(project, category) {
  if (category === "All") return true;

  const selectedCategory = normalizeCategory(category);
  if (hiddenCategories.has(selectedCategory)) return false;

  return [project.category, ...(project.tech || [])].some(
    (value) => normalizeCategory(value) === selectedCategory
  );
}