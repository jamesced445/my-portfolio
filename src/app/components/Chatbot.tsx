"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { resumeData, projectsData } from "../data";

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ── Knowledge Base ─────────────────────────────────────────────────────────
const KB = {
  name: resumeData.name,
  age: resumeData.age,
  title: resumeData.title,
  summary: resumeData.summary,
  email: resumeData.contact.email,
  phone: resumeData.contact.phone,
  location: resumeData.contact.location,
  experience: resumeData.experience,
  skills: resumeData.skills,
  education: resumeData.education,
  references: resumeData.references,
  projects: projectsData,
};

const GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo"];

// ── Intent → Response Map ──────────────────────────────────────────────────
function getResponse(input: string): string {
  const q = input.toLowerCase().trim();

  if (GREETINGS.some((g) => q === g || q.startsWith(g + " ") || q.startsWith(g + "!"))) {
    return `Hey there! 👋 I'm James' portfolio assistant. Ask me anything about James — his skills, experience, projects, education, or how to contact him!`;
  }

  if (/(who are you|what are you|about (this )?bot|are you (an )?ai|are you (a )?chatbot)/i.test(q)) {
    return `I'm a portfolio assistant for **${KB.name}**. I can answer questions about James' skills, work experience, projects, education, and contact info. What would you like to know?`;
  }

  if (/(what.*(his|your) name|who is (this|james|he)|introduce|full name)/i.test(q)) {
    return `His full name is **${KB.name}**. He's a ${KB.title} based in the Philippines with 6+ years of professional experience.`;
  }

  if (/(age|old|born|birthday|birth)/i.test(q)) {
    return `James is **${KB.age}**. 🎂`;
  }

  if (/(title|role|position|job|what does he do|profession|developer|engineer)/i.test(q)) {
    return `James is a **${KB.title}**. He specializes in building enterprise web apps, REST APIs, and mobile applications — primarily with the .NET ecosystem and C#.`;
  }

  if (/(summary|about|profile|overview|tell me about|background|who is)/i.test(q)) {
    return `📋 **About James:**\n\n${KB.summary}`;
  }

  if (/(email|gmail|mail)/i.test(q)) {
    return `📧 You can reach James at **${KB.email}**`;
  }

  if (/(phone|mobile|number|call|contact number)/i.test(q)) {
    return `📱 James' phone number is **${KB.phone}**`;
  }

  if (/(location|based|where|city|address|place|live|reside|relocation)/i.test(q)) {
    return `📍 James is based in **${KB.location}**`;
  }

  if (/(contact|reach|hire|available|open to work|get in touch)/i.test(q)) {
    return `You can get in touch with James via:\n\n📧 **Email:** ${KB.email}\n📱 **Phone:** ${KB.phone}\n📍 **Location:** ${KB.location}\n\nHe's currently **open for work** — full-time roles, freelance, and collaborations!`;
  }

  if (/(c#|csharp|\.net|dotnet|asp\.net|net core)/i.test(q)) {
    return `💻 C# and .NET are James' core strengths — he has **6+ years** of experience with ASP.NET, .NET Core MVC, and .NET Core API (with Swagger). It's the backbone of his professional career.`;
  }
  if (/(sql|mssql|database|db|postgres|sybase)/i.test(q)) {
    return `🗄️ James is proficient in **Microsoft SQL Server** (6 years), and also has experience with **PostgreSQL** and **Sybase**. Database design, optimization, and query writing are part of his daily toolkit.`;
  }
  if (/(react native|mobile|expo|xamarin|maui)/i.test(q)) {
    return `📱 James has mobile development experience with **React Native / TypeScript / Expo**, **Xamarin**, and **.NET MAUI**. He built a native inventory/POS app and worked on the AXA Insurance mobile platform.`;
  }
  if (/(angular|javascript|jquery|frontend|html|css|bootstrap)/i.test(q)) {
    return `🎨 On the frontend, James works with **HTML/CSS/Bootstrap**, **JavaScript**, **jQuery**, and **AngularJS**. He focuses primarily on backend & API development but is comfortable full-stack.`;
  }
  if (/(azure|aws|cloud|devops|ci\/cd|iis|git)/i.test(q)) {
    return `☁️ James has DevOps experience with **Azure CI/CD**, **AWS (EC2, RDS, KMS)**, **GIT & TFS**, and **IIS Deployment**. He's worked with cloud services in enterprise insurance and government systems.`;
  }
  if (/(ai|openai|claude|gemini|llm|copilot)/i.test(q)) {
    return `🤖 James integrates **AI LLMs** (OpenAI, Claude, Gemini) into enterprise APIs and smart features. He uses AI tools daily including GitHub Copilot and is experienced in AI-powered API development.`;
  }
  if (/(laravel|php)/i.test(q)) {
    return `James has some experience with **Laravel (PHP)** — it's listed in his skills. His primary stack is .NET/C# but he's explored PHP for admin dashboards.`;
  }
  if (/(payment|gcash|maya|visa|mastercard|gateway|fintech)/i.test(q)) {
    return `💳 James built **multiple payment systems** — integrating GCash, Maya, LandBank, DBP, and Visa/Mastercard. He developed both a hospital billing system and a Unified Payment Gateway for government use.`;
  }

  if (/(skill|tech|stack|know|language|framework|expertise|proficient|technology)/i.test(q)) {
    const topSkills = KB.skills.filter((s) => s.years >= 3).map((s) => `**${s.name}** (${s.years}yrs)`);
    const otherSkills = KB.skills.filter((s) => s.years < 3).map((s) => s.name);
    return `🛠️ **James' Tech Stack:**\n\n**Core Skills (6+ years):**\n${topSkills.join(" · ")}\n\n**Also knows:** ${otherSkills.join(", ")}`;
  }

  if (/(boldr|back.?end engineer)/i.test(q)) {
    const exp = KB.experience.find((e) => /boldr/i.test(e.company));
    if (exp) return `🏢 **${exp.role} @ ${exp.company}** (${exp.period})\n📍 ${exp.location}\n\n${exp.highlights.map((h) => `▸ ${h}`).join("\n")}`;
  }
  if (/(ascendion|axa)/i.test(q)) {
    const exp = KB.experience.find((e) => /ascendion|axa/i.test(e.company));
    if (exp) return `🏢 **${exp.role} @ ${exp.company}** (${exp.period})\n📍 ${exp.location}\n\n${exp.highlights.map((h) => `▸ ${h}`).join("\n")}`;
  }
  if (/(spacetech|freelance)/i.test(q)) {
    const exp = KB.experience.find((e) => /spacetech/i.test(e.company));
    if (exp) return `🏢 **${exp.role} @ ${exp.company}** (${exp.period})\n📍 ${exp.location}\n\n${exp.highlights.map((h) => `▸ ${h}`).join("\n")}`;
  }
  if (/(lares|land registration)/i.test(q)) {
    const exp = KB.experience.find((e) => /lares/i.test(e.company));
    if (exp) return `🏢 **${exp.role} @ ${exp.company}** (${exp.period})\n📍 ${exp.location}\n\n${exp.highlights.map((h) => `▸ ${h}`).join("\n")}`;
  }
  if (/(geodata)/i.test(q)) {
    const exp = KB.experience.find((e) => /geodata/i.test(e.company));
    if (exp) return `🏢 **${exp.role} @ ${exp.company}** (${exp.period})\n📍 ${exp.location}\n\n${exp.highlights.map((h) => `▸ ${h}`).join("\n")}`;
  }

  if (/(experience|work history|career|companies|employer|worked|previous job|job history)/i.test(q)) {
    return `💼 **James has worked at ${KB.experience.length} companies:**\n\n${KB.experience
      .map((e) => `• **${e.role}** @ ${e.company} *(${e.period})*`)
      .join("\n")}\n\nAsk me about any specific company for more details!`;
  }

  if (/(current|latest|recent|now|present|nowadays)/i.test(q)) {
    const latest = KB.experience[0];
    return `🏢 James' most recent role is **${latest.role}** at **${latest.company}** (${latest.period}) in ${latest.location}.`;
  }

  if (/(how many years|years of experience|how long|experience years)/i.test(q)) {
    return `James has **6+ years** of professional experience in software development, working across healthcare, government, insurance, and fintech sectors.`;
  }

  if (/(hris|human resource|attendance|payroll)/i.test(q)) {
    const p = KB.projects.find((proj) => /hris/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(hospital|billing|statement of account|soa|philhealth|hmo)/i.test(q)) {
    const p = KB.projects.find((proj) => /hospital/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(eserbisyo|etitle|land title|government|gov|citizen)/i.test(q)) {
    const p = KB.projects.find((proj) => /eserbisyo/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(denr|linkage api|environment|natural resources)/i.test(q)) {
    const p = KB.projects.find((proj) => /denr/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(unified payment|gcash|maya|online payment|payment system)/i.test(q)) {
    const p = KB.projects.find((proj) => /unified payment/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(inventory|barcode|pos|point of sale|warehouse)/i.test(q)) {
    const p = KB.projects.find((proj) => /inventory/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(axa insurance|insurance web|insurance mobile|paperless)/i.test(q)) {
    const p = KB.projects.find((proj) => /axa/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(umi|core api|backbone|microservice)/i.test(q)) {
    const p = KB.projects.find((proj) => /umi/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }
  if (/(admin dashboard|dashboard|sales|income|expense|report)/i.test(q)) {
    const p = KB.projects.find((proj) => /admin dashboard/i.test(proj.name));
    if (p) return `🏗️ **${p.name}** — ${p.description}\n\n**Key features:** ${p.features.join(" · ")}\n\n**Tech:** ${p.tech?.join(", ")}`;
  }

  if (/(project|built|developed|portfolio|work|app|system|application)/i.test(q)) {
    return `🚀 **James has built ${KB.projects.length} major projects:**\n\n${KB.projects
      .map((p) => `• **${p.name}** *(${p.category})* — ${p.description.slice(0, 60)}...`)
      .join("\n")}\n\nAsk me about any specific project for full details!`;
  }

  if (/(education|degree|school|university|college|study|studied|graduate|aclc|bs it|information technology)/i.test(q)) {
    return `🎓 **Education:**\n\n**${KB.education.degree}**\n${KB.education.school}\n📍 ${KB.education.location} · ${KB.education.period}`;
  }

  if (/(reference|referral|recommend|vouch|contact person)/i.test(q)) {
    return `📋 **References:**\n\n${KB.references
      .map((r) => `• **${r.name}** — ${r.company} (${r.contact})`)
      .join("\n")}`;
  }

  if (/(hire|hiring|available|open to|looking for|job|opportunity|offer|freelance|full.?time|remote)/i.test(q)) {
    return `✅ Yes! James is **currently open** for full-time roles, freelance projects, and collaborations.\n\n📧 Reach him at **${KB.email}**\n📱 Or call **${KB.phone}**\n\nHe's open to relocation from Koronadal City, South Cotabato.`;
  }

  if (/(salary|rate|pay|compensation|how much|budget)/i.test(q)) {
    return `💬 Salary and rate details are best discussed directly with James.\n\n📧 Email: **${KB.email}**\n📱 Phone: **${KB.phone}**`;
  }

  if (/(thank|thanks|thank you|appreciated|bye|goodbye|see you|ciao|cheers)/i.test(q)) {
    return `You're welcome! Feel free to come back anytime. 😊 Don't hesitate to reach out to James directly at **${KB.email}** if you have more questions!`;
  }

  if (/(help|what can you|what do you know|topics|ask|menu|options)/i.test(q)) {
    return `Here's what I can tell you about James:\n\n👤 **About** — summary, age, title\n💼 **Experience** — 5 companies, roles & highlights\n🚀 **Projects** — 11 built systems\n🛠️ **Skills** — tech stack & expertise\n🎓 **Education** — degree & school\n📞 **Contact** — email, phone, location\n📋 **References** — professional contacts\n\nJust ask naturally — e.g. *"What projects has he built?"* or *"Is James available for hire?"*`;
  }

  return `❌ I can only answer questions about **James Cedeño's portfolio** — his skills, experience, projects, education, and contact info.\n\nTry asking: *"What are his skills?"*, *"Tell me about his experience"*, or *"How can I contact him?"*`;
}

// ── Suggested Questions ────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What are his skills?",
  "Tell me about his experience",
  "What projects has he built?",
  "How can I contact him?",
  "Is he available for hire?",
  "What's his educational background?",
];

// ── Component ──────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "bot",
      text: `Hi! 👋 I'm James' portfolio assistant. Ask me anything about his skills, experience, projects, or how to reach him!`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_MS = 5 * 60 * 1000;

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!ended) {
      idleTimer.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            from: "bot",
            text: "⏱️ This chat has ended due to inactivity (5 minutes). Feel free to restart anytime!",
            time: now(),
          },
        ]);
        setEnded(true);
      }, IDLE_MS);
    }
  }, [ended, IDLE_MS]);

  useEffect(() => {
    if (open && !ended) resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [open, ended, resetIdleTimer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 800);
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || ended) return;
    setShowSuggestions(false);
    resetIdleTimer();

    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "bot", text: response, time: now() },
      ]);
      setTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const restart = () => {
    setMessages([
      {
        id: Date.now(),
        from: "bot",
        text: `Welcome back! 👋 Ask me anything about James — his skills, experience, projects, or contact info!`,
        time: now(),
      },
    ]);
    setEnded(false);
    setShowSuggestions(true);
    setInput("");
    resetIdleTimer();
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <span key={i}>
          {parts}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });

  return (
    <>
      {/* ── Toggle Button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "24px",        // ← was 32px
          right: "16px",         // ← was 32px
          zIndex: 1000,
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          border: "2px solid rgba(0,229,255,0.4)",
          background: "linear-gradient(135deg, #0a0a0f 60%, #16161f)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 4px rgba(0,229,255,0.08), 0 8px 32px rgba(0,0,0,0.5)",
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          padding: 0,
          overflow: "hidden",
          transform: open ? "scale(0.92) rotate(8deg)" : "scale(1)",
        }}
        aria-label="Toggle chat"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <img
            src="/profile.jpg"
            alt="James Cedeño"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", borderRadius: "50%" }}
          />
        )}
        {!open && (
          <span style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "50%",
            border: "2px solid rgba(0,229,255,0.3)",
            animation: "chatPulse 2s ease infinite",
            pointerEvents: "none",
          }} />
        )}
      </button>

      {/* ── Chat Window ── */}
      <div
        data-chatwindow
        style={{
          position: "fixed",
          bottom: "100px",                              // ← was 108px
          right: "12px",                                // ← was 32px
          zIndex: 999,
          width: "min(380px, calc(100vw - 24px))",      // ← was 380px (fixed)
          maxHeight: "580px",
          display: "flex",
          flexDirection: "column",
          background: "#0e0e17",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: "16px",                         // ← was 20px
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          transformOrigin: "bottom right",
          transform: open ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #111119, #16161f)",
          borderBottom: "1px solid rgba(0,229,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "2px solid rgba(0,229,255,0.4)",
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(0,229,255,0.2)",
          }}>
            <img src="/profile.jpg" alt="James" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#e8e8f0", margin: 0, lineHeight: 1.2 }}>
              James
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#00e5ff", margin: "2px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e5ff", display: "inline-block", animation: "chatPulse 2s ease infinite" }} />
              AI Chat Assistant
            </p>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#6b6b80",
            cursor: "pointer",
            padding: "6px 8px",
            fontSize: "12px",
            lineHeight: 1,
            transition: "all 0.2s",
          }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          scrollbarWidth: "thin",
          scrollbarColor: "#7b61ff #0e0e17",
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: msg.from === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: "8px",
              animation: "chatFadeUp 0.3s ease both",
            }}>
              {msg.from === "bot" && (
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid rgba(0,229,255,0.3)",
                }}>
                  <img src="/profile.jpg" alt="J" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
                </div>
              )}
              <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                  background: msg.from === "user"
                    ? "linear-gradient(135deg, #00e5ff, #7b61ff)"
                    : "rgba(255,255,255,0.05)",
                  border: msg.from === "bot" ? "1px solid rgba(255,255,255,0.07)" : "none",
                  color: msg.from === "user" ? "#000" : "#e8e8f0",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  fontFamily: "var(--font-body)",
                  wordBreak: "break-word",
                }}>
                  {renderText(msg.text)}
                </div>
                <span style={{ fontSize: "10px", color: "#6b6b80", marginTop: "3px", fontFamily: "var(--font-mono)" }}>{msg.time}</span>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", animation: "chatFadeUp 0.3s ease both" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(0,229,255,0.3)" }}>
                <img src="/profile.jpg" alt="J" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
              </div>
              <div style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "4px 16px 16px 16px",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: "#00e5ff",
                    animation: `chatDot 1.2s ease infinite`,
                    animationDelay: `${i * 0.2}s`,
                    display: "inline-block",
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 2 && !ended && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: "rgba(0,229,255,0.06)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    borderRadius: "20px",
                    color: "#00e5ff",
                    fontSize: "11px",
                    padding: "5px 12px",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.15s",
                    letterSpacing: "0.3px",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {ended && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
              <button onClick={restart} style={{
                background: "linear-gradient(135deg, #00e5ff22, #7b61ff22)",
                border: "1px solid rgba(0,229,255,0.3)",
                borderRadius: "20px",
                color: "#00e5ff",
                fontSize: "12px",
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}>
                🔄 Restart Chat
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#0a0a0f",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ended ? "Chat has ended…" : "Ask about James…"}
            disabled={ended}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "10px 14px",
              color: "#e8e8f0",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              outline: "none",
              transition: "border-color 0.2s",
              caretColor: "#00e5ff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(0,229,255,0.4)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || ended}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              background: input.trim() && !ended ? "linear-gradient(135deg, #00e5ff, #7b61ff)" : "rgba(255,255,255,0.05)",
              cursor: input.trim() && !ended ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke={input.trim() && !ended ? "#000" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Global Animations ── */}
      <style>{`
        @keyframes chatPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes chatFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @media (max-width: 480px) {
          [data-chatwindow] {
            max-height: calc(100dvh - 120px) !important;
          }
        }
      `}</style>
    </>
  );
}