# James Cedeño — Portfolio

A modern, dark-themed portfolio built with **Next.js 14** and **TypeScript**, deployable on **Vercel**.

## 🚀 Deploy to Vercel (One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/james-cedeno-portfolio)

---

## 🛠 Local Development

### Prerequisites
- Node.js 18+ (or 20+)
- npm / yarn / pnpm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel (Manual)

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Leave all settings as default — Vercel auto-detects Next.js
6. Click **"Deploy"**

Your portfolio will be live at `https://your-project.vercel.app` in ~60 seconds.

---

## 📁 Project Structure

```
portfolio/
├── src/
│   └── app/
│       ├── layout.tsx     # Root layout (fonts, metadata)
│       ├── page.tsx       # Main portfolio page
│       ├── page.module.css # Component styles
│       ├── globals.css    # Global CSS & design tokens
│       └── data.ts        # Resume data (edit this!)
├── public/
│   └── robots.txt
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## ✏️ Customization

All personal data is in **`src/app/data.ts`**. Edit that file to update:
- Name, title, summary
- Contact info
- Work experience
- Skills
- Education
- References

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS Variables
- **Fonts**: Syne (display) · DM Sans (body) · DM Mono (code)
- **Deployment**: Vercel
