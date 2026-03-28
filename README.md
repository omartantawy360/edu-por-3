# <p align="center">🎓 EduComp</p>

<p align="center">
  <strong>The Ultimate Student Competition Management Platform</strong><br>
  <em>Empowering the next generation of innovators through structured excellence and professional lifecycle management.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-7-purple?logo=vite" alt="Vite 7">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/State-6_Contexts-orange" alt="6-Context Architecture">
</p>

<p align="center">
  <a href="https://omartantawy360.github.io/edu-por-3"><strong>🚀 Live Demo</strong></a> | 
  <a href="#-visual-tour">Visual Tour</a> | 
  <a href="#-ecosystems">Ecosystems</a> | 
  <a href="#-competition-lifecycle">Lifecycle</a> | 
  <a href="#-technical-architecture">Architecture</a> | 
  <a href="#-setup--installation">Setup</a>
</p>

---

## 🌟 Overview

**EduComp** is a premium, high-performance web ecosystem designed to orchestrate academic competitions with professional-grade precision. It serves as a comprehensive platform with specialized, role-aware interfaces for **Students**, **Judges**, and **Administrators**—all synchronized by a state-of-the-art **Competition Lifecycle Engine**.

Built with **React 19** and **Vite 7**, EduComp leverages a sophisticated modular architecture to handle everything from team formation and AI-powered coaching to rubric-based anonymous peer reviews and automated certificate minting.

> [!IMPORTANT]
> **Phase-Aware UI**: The entire platform is dynamically adaptive. Dashboards, available actions, and visibility states automatically shift as competitions transition through their lifecycle, ensuring a seamless journey from initial registration to final result publication.

---

## 📸 Visual Tour

### 🏙️ Command & Control
| **Student Hub & AI Coach** | **Admin Competition Orchestrator** |
| :---: | :---: |
| ![Student Dashboard](/C:/Users/omart/.gemini/antigravity/brain/e48b3ba5-ebe0-4c53-b307-7c297d3747ad/student_dashboard_main_1774726664930.png) | ![Admin Dashboard](/C:/Users/omart/.gemini/antigravity/brain/e48b3ba5-ebe0-4c53-b307-7c297d3747ad/admin_competitions_tab_1774727598814.png) |
| *Personalized timeline, task list, and AI assistant.* | *Dynamic workflow management and phase control.* |

### 📊 Intelligence & Recognition
| **Advanced Admin Analytics** | **Automated Leaderboards** |
| :---: | :---: |
| ![Admin Analytics](/C:/Users/omart/.gemini/antigravity/brain/e48b3ba5-ebe0-4c53-b307-7c297d3747ad/admin_analytics_1774726448269.webp) | ![Showcase](/C:/Users/omart/.gemini/antigravity/brain/e48b3ba5-ebe0-4c53-b307-7c297d3747ad/new_features_showcase_1774726277562.webp) |
| *Real-time metrics on registration and performance.* | *Live ranking engine with rubric-weighted scores.* |

---

## 🌍 Ecosystems

### 🎓 1. Student Hub (The Competitor)
Designed to foster student growth and professional visibility.
- **🚀 Dynamic Journey Timeline**: A centralized view of all active competitions, upcoming deadlines, and required actions.
- **🤖 AI Innovation Coach**: A persistent, context-aware AI assistant providing real-time feedback on project innovation, technical feasibility, and pitch deck quality.
- **👥 Anonymous Peer Review**: A fair, rubric-based evaluation system where students review peer projects, promoting critical thinking and community feedback.
- **🌟 Professional Portfolios**: Automated, sharable profiles showcasing skills, project history, and verifiable digital accolades.
- **🤝 Team Forge**: Advanced collaboration tools for forming teams, recruiting members, and managing group dynamics.
- **💬 Synergy Chat**: Real-time communication channel integrated directly into the team workflow.

### ⚖️ 2. Judge Portal (The Evaluator)
A streamlined, high-focus interface for objective assessment.
- **🔒 Phase-Locked Evaluation**: Judging panels only activate when the competition enters the 'Evaluation' phase, ensuring data integrity.
- **📋 Master Rubrics**: Interactive scoring sheets with criteria-specific weights and real-time total calculation.
- **🚩 Conflict Flagging**: Integrated system for judges to report conflicts of interest, triggering automated admin reassignment.
- **💬 Qualitative Feedback**: Dedicated channels for providing detailed constructive criticism alongside quantitative scores.

### 🛡️ 3. Admin Center (The Orchestrator)
The mission control for complex educational initiatives.
- **🧙‍♂️ Competition Wizard**: A guided, multi-step engine for managing the entire lifecycle—from draft to archival.
- **⚖️ Conflict Resolution Console**: Centralized hub for reviewing judge-flagged conflicts and rerouting evaluators.
- **📊 Rank Engine**: Automated, real-time leaderboard generation based on complex scoring models and judge consensus.
- **📢 Broadcast Network**: Targeted announcement system for reaching specific competition cohorts or the entire student body.
- **📜 Certificate Mint**: Bulk generation of verifiable digital certificates for winners and participants.

---

## 🏆 Competition Lifecycle
The platform enforces a professional, 6-stage lifecycle to ensure fairness and structure:

```mermaid
graph LR
    A[Draft] --> B[Registration]
    B --> C[Evaluation]
    C --> D[Peer Review]
    D --> E[Results Ready]
    E --> F[Published]
    F --> G[Archived]
```

1.  **Draft**: Rules, rubrics, and demographics are configured.
2.  **Registration**: Competitions appear on student dashboards; teams enroll and submit initial documents.
3.  **Evaluation (Judging)**: Expert panels review projects using professional rubrics.
4.  **Peer Review**: Finalists evaluate each other's work to broaden perspective and fairness.
5.  **Results Ready**: Admin verifies top rankings and audits score consistency.
6.  **Results Published**: Results go live; student banners appear; certificates are minted for export.

---

## 🧠 Technical Architecture

### 🛡️ 6-Context Strategic State
EduComp utilizes a sophisticated **6-Context Architecture** to maintain high performance and prevent unnecessary re-renders:
- **AuthContext**: Manages secure identity, role-based routing (`student`, `judge`, `admin`), and session persistence.
- **AppContext**: The primary source of truth for competition data, lifecycle phases, and global configurations.
- **TeamContext**: Handles complex many-to-many relationships between students, teams, and registrations.
- **ChatContext**: Manages real-time message streams and unread notifications.
- **JudgeContext**: Orchestrates specific evaluation data, assignments, and conflict flagging logic.
- **NotificationContext**: A system-wide broadcast service for targeted alerts and unread counts.

### 🎨 Visual & Performance Engineering
- **Logic**: [React 19](https://react.dev/) — Leveraging the latest concurrent features and optimized rendering patterns.
- **Build**: [Vite 7](https://vitejs.dev/) — Lighting-fast HMR and optimized production bundles.
- **Design**: [Tailwind CSS](https://tailwindcss.com/) — A premium glassmorphism-inspired design system.
- **Icons**: [Lucide-React](https://lucide.dev/) — Professional, consistent iconography.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) — Smooth, hardware-accelerated micro-interactions.

---

## ⚡ Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Quick Start
1. **Clone the Repository**
   ```bash
   git clone https://github.com/omartantawy360/edu-por-3.git
   cd edu-por-3
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run Development Server**
   ```bash
   npm run dev
   ```
4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📄 License
This project is licensed under the **MIT License**.

<p align="center">
  <strong>Built with ❤️ for the Global Student Community</strong>
</p>
