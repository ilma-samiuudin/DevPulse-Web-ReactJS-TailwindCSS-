export const skillGroups = [
  {
    name: "Frontend",
    skills: ["HTML 5", "CSS", "JavaScript", "Bootstrap", "Tailwind CSS", "React.js", "Context API", "jQuery"],
  },
  {
    name: "Backend & Data",
    skills: ["Python", "FastAPI", "SQL", "REST APIs"],
  },
  {
    name: "Tools",
    skills: ["Git & GitHub"],
  },
];

export const skills = skillGroups.flatMap((group) => group.skills);