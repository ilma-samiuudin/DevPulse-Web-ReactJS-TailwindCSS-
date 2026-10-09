import ContactLinks from "./ContactLinks";
import { skillGroups } from "../data/SkillsData";

export default function AboutPage() {
  return (
    <section className="about-section animate-fade-up">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(79,70,229,0.35)] sm:p-10">
        <div className="profile-intro flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">About</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Hello, I'm <span className="text-indigo-600">Ilma</span>.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              I enjoy building the complete experience: shaping a clear interface, connecting it to useful APIs, and making sure the data flows reliably behind it. My work brings together React, Python, and the tools I use to develop and maintain web applications.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          <h3 className="text-lg font-bold text-slate-900">Skills &amp; tools</h3>
          {skillGroups.map((group) => (
            <section key={group.name} aria-label={group.name}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {group.name}
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.skills.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-indigo-200 hover:bg-white"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <ContactLinks />
      </div>
    </section>
  );
}