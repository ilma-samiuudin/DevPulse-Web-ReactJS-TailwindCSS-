export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className="theme-toggle inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      <span>{theme === "light" ? "Dark" : "Light"} mode</span>
    </button>
  );
}
