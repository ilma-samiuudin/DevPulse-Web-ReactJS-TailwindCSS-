const contactLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ilma-samiuddin-dev",
    detail: "Connect professionally",
  },
  {
    label: "GitHub",
    href: "https://github.com/ilma-samiuudin",
    detail: "Explore my code",
  },
  {
    label: "Email",
    href: "mailto:iilmaansari26@gmail.com",
    detail: "iilmaansari26@gmail.com",
  },
];

export default function ContactLinks() {
  return (
    <section className="mt-10 border-t border-slate-200 pt-8" aria-labelledby="contact-heading">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Find me online</p>
        <h3 id="contact-heading" className="mt-2 text-xl font-bold text-slate-900">Let's connect</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label === "Email" ? undefined : "_blank"}
            rel={link.label === "Email" ? undefined : "noreferrer"}
            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-indigo-300 hover:bg-white"
          >
            <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-700">{link.label}</span>
            <span className="mt-1 block break-all text-xs text-slate-500">{link.detail}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
