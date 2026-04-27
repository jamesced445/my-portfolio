"use client";

import { useState, useEffect, useRef } from "react";
import { resumeData, projectsData } from "./data";
import styles from "./page.module.css";
import Chatbot from "./components/Chatbot";

const NAV_LINKS = ["About", "Experience", "Projects", "Skills", "Education", "Contact"];

const SKILL_COLORS: Record<string, string> = {
  Backend: "#00e5ff",
  Frontend: "#7b61ff",
  Database: "#ff6b6b",
  Mobile: "#ffd166",
  DevOps: "#06d6a0",
  Tools: "#f72585",
  Methodology: "#b5838d",
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [filter, setFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const categories = ["All", ...Array.from(new Set(resumeData.skills.map((s) => s.category)))];
  const filteredSkills =
    filter === "All" ? resumeData.skills : resumeData.skills.filter((s) => s.category === filter);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const parallaxY = scrollY * 0.4;

  return (
    <div className={styles.root}>
      {/* NAV */}
      <nav className={`${styles.nav} ${scrollY > 60 ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <button className={styles.logo} onClick={() => scrollTo("about")}>
            <span className={styles.logoAccent}>J</span>C
          </button>
          <ul className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  className={`${styles.navLink} ${activeSection === link.toLowerCase() ? styles.navLinkActive : ""}`}
                  onClick={() => scrollTo(link)}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <a className={styles.navCta} onClick={() => scrollTo("contact")}>
            Hire Me
          </a>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? styles.barOpen : ""}></span>
            <span className={menuOpen ? styles.barOpen : ""}></span>
            <span className={menuOpen ? styles.barOpen : ""}></span>
          </button>
        </div>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map((link) => (
              <button key={link} className={styles.mobileLink} onClick={() => scrollTo(link)}>
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="about" className={`${styles.hero} grid-bg`} ref={heroRef}>
        <div className={styles.heroGlow} style={{ transform: `translateY(${parallaxY}px)` }} />
        <div className={styles.heroGlow2} style={{ transform: `translateY(${-parallaxY * 0.5}px)` }} />

        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardRing} />
              <div className={styles.heroAvatar}>
                <img src="/profile.jpg" alt="James Cedeño" className={styles.heroAvatarImg} />
              </div>
              <div className={styles.heroCardInfo}>
                <p className={styles.heroCardName}>{resumeData.name}</p>
                <p className={styles.heroCardRole}>{resumeData.age}</p>
              </div>
              <div className={styles.heroCardTags}>
                {["C#","ASP.NET/.NET Core", "API", "MSSQL", "React Native", "Javascript", "HTML/CSS"].map((t) => (
                  <span key={t} className={styles.heroCardTag}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Available for work
            </div>
            <h1 className={styles.heroName}>{resumeData.title}</h1>
            <p className={styles.heroSummary}>{resumeData.summary}</p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>6+</span>
                <span className={styles.heroStatLabel}>Years Exp.</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>5</span>
                <span className={styles.heroStatLabel}>Companies</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>19+</span>
                <span className={styles.heroStatLabel}>Technologies</span>
              </div>
            </div>

            <div className={styles.heroCtas}>
              <button className={styles.btnPrimary} onClick={() => scrollTo("experience")}>
                View Experience
              </button>
               <a
                  href="/James_Cedeno_Resume.pdf"
                  download="James_Cedeno_Resume.pdf"
                  className={styles.btnDownload}
                >
                  ↓ Download CV
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${resumeData.contact.email}&su=Hello&body=Hi%20there`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnOutline}
                >
                Send Email
              </a>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Work History</span>
            <h2 className={styles.sectionTitle}>Experience</h2>
          </div>

          <div className={styles.timeline}>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <div className={styles.timelineDotInner} />
                </div>
                <div className={styles.timelineCard}>
                  <div className={styles.timelineCardHeader}>
                    <div>
                      <h3 className={styles.timelineRole}>{exp.role}</h3>
                      <p className={styles.timelineCompany}>{exp.company}</p>
                    </div>
                    <div className={styles.timelineMeta}>
                      <span className={styles.timelinePeriod}>{exp.period}</span>
                      <span className={styles.timelineLocation}>{exp.location}</span>
                    </div>
                  </div>
                  <ul className={styles.timelineHighlights}>
                    {exp.highlights.map((h, j) => (
                      <li key={j} className={styles.timelineHighlight}>
                        <span className={styles.bulletArrow}>▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What I&apos;ve Built</span>
            <h2 className={styles.sectionTitle}>Projects</h2>
          </div>

          <div className={styles.filterRow}>
            {["All", ...Array.from(new Set(projectsData.map((p) => p.category)))].map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${projectFilter === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setProjectFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.projectsGrid}>
            {projectsData
              .filter((p) => projectFilter === "All" || p.category === projectFilter)
              .map((project, i) => (
                <div key={i} className={styles.projectCard} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={styles.projectCardTop}>
                    <div className={styles.projectIconWrap} style={{ background: project.iconBg }}>
                      <span className={styles.projectIcon}>{project.icon}</span>
                    </div>
                    <span className={styles.projectCategory} style={{ color: project.accentColor }}>
                      {project.category}
                    </span>
                  </div>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <ul className={styles.projectFeatures}>
                    {project.features.map((f, j) => (
                      <li key={j} className={styles.projectFeature}>
                        <span className={styles.featureDot} style={{ background: project.accentColor }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.projectTechRow}>
                    {project.tech.map((t) => (
                      <span key={t} className={styles.projectTech}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Tech Stack</span>
            <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          </div>

          <div className={styles.filterRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.skillsGrid}>
            {filteredSkills.map((skill, i) => (
              <div
                key={skill.name}
                className={styles.skillCard}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className={styles.skillCategoryDot}
                  style={{ background: SKILL_COLORS[skill.category] ?? "#666" }}
                />
                <p className={styles.skillName}>{skill.name}</p>
                <div className={styles.skillMeta}>
                  <span
                    className={styles.skillCategory}
                    style={{ color: SKILL_COLORS[skill.category] ?? "#666" }}
                  >
                    {skill.category}
                  </span>
                  {skill.years > 0 && (
                    <span className={styles.skillYears}>{skill.years}yr{skill.years > 1 ? "s" : ""}</span>
                  )}
                </div>
                {skill.years > 0 && (
                  <div className={styles.skillBar}>
                    <div
                      className={styles.skillBarFill}
                      style={{
                        width: `${Math.min(100, (skill.years / 6) * 100)}%`,
                        background: SKILL_COLORS[skill.category] ?? "#00e5ff",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Academic Background</span>
            <h2 className={styles.sectionTitle}>Education</h2>
          </div>

          <div className={styles.eduCard}>
            <div className={styles.eduIcon}>🎓</div>
            <div className={styles.eduContent}>
              <h3 className={styles.eduDegree}>{resumeData.education.degree}</h3>
              <p className={styles.eduSchool}>{resumeData.education.school}</p>
              <div className={styles.eduMeta}>
                <span>{resumeData.education.location}</span>
                <span className={styles.eduDot}>•</span>
                <span>{resumeData.education.period}</span>
              </div>
              <ul className={styles.eduPoints}>
                <li>Digital literacy with foundational knowledge of computer hardware, OS, and networking</li>
                <li>Proficient in web publishing, spreadsheet, and database software</li>
                <li>Gained practical IT experience through hands-on activities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Get In Touch</span>
            <h2 className={styles.sectionTitle}>Contact</h2>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <p className={styles.contactIntro}>
                I&apos;m open to full-time roles, freelance projects, and collaborations.
                Whether you have a project in mind or just want to say hi — my inbox is open.
              </p>
              <div className={styles.contactItems}>
                <a href={`mailto:${resumeData.contact.email}`} className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉</span>
                  <span>{resumeData.contact.email}</span>
                </a>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📱</span>
                  <span>{resumeData.contact.phone}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  <span>{resumeData.contact.location}</span>
                </div>
              </div>
            </div>

            <div className={styles.referencePanel}>
              <h3 className={styles.refTitle}>References</h3>
              <div className={styles.refGrid}>
                {resumeData.references.map((ref, i) => (
                  <div key={i} className={styles.refCard}>
                    <p className={styles.refName}>{ref.name}</p>
                    <p className={styles.refCompany}>{ref.company}</p>
                    <p className={styles.refContact}>{ref.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            Built by James Cedeño · 2025
          </p>
          <p className={styles.footerSub}>Next.js · TypeScript · Vercel</p>
        </div>
      </footer>

      {/* CHATBOT — fixed overlay, no layout impact */}
      <Chatbot />
    </div>
  );
}
