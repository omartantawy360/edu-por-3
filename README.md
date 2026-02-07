# EduComp - Student Competition Platform

EduComp is a modern, feature-rich web platform designed to manage and streamline student competitions. It bridges the gap between administrators, students, and teams, offering tools for registration, team formation, project submission, and evaluation.

## 🚀 Key Features

### 🎓 For Students
*   **Interactive Dashboard**: Real-time overview of active competitions, upcoming deadlines, and recent achievements.
*   **Team Management**: Create or join teams, manage members, and collaborate in a dedicated **Team Hub** with built-in chat.
*   **Competition Discovery**: personalized recommendations and easy registration for various competitions.
*   **Submission Tracking**: Upload project details, abstracts, repositories, and track submission status.
*   **Certificates & Achievements**: View and download certificates for completed and winning competitions.
*   **Profile Management**: Customizable user profiles and settings.

### 🛡️ For Administrators
*   **Admin Dashboard**: comprehensive analytics on students, competitions, and pass/fail rates.
*   **User Management**: Approve or reject student registrations and manage user roles.
*   **Competition Management**: Create and configure new competitions with specific stages and requirements.
*   **Evaluation System**: Review submissions, provide feedback, and mark students as Passed/Failed.
*   **Notification System**: Send global or targeted notifications to students.

### 🎨 UI/UX
*   **Modern Design**: Built with Tailwind CSS for a responsive, clean, and accessible interface.
*   **Dark Mode**: Fully supported dark/light theme toggling.
*   **Smooth Animations**: Fluid transitions and micro-interactions for a premium feel.
*   **Responsive Layout**: Optimized for desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

*   **Frontend Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **State Management**: React Context API
*   **Utilities**: `clsx`, `tailwind-merge` for dynamic class management.
*   **Animations**: `tailwindcss-animate` and CSS transitions.

## 📂 Project Structure

```bash
src/
├── components/         # Reusable UI components
│   ├── Layout/         # Sidebar, DashboardLayout
│   └── ui/             # Buttons, Cards, Badges, Inputs, etc.
├── context/            # Global State Management
│   ├── AppContext.jsx  # Main application monitoring state
│   ├── AuthContext.jsx # Authentication handling
│   ├── ChatContext.jsx # Team chat functionality
│   ├── TeamContext.jsx # Team management logic
│   └── ThemeContext.jsx# Dark/Light mode logic
├── pages/              # Main Route Views
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── TeamsPage.jsx
│   ├── TeamHub.jsx
│   ├── CreateCompetition.jsx
│   └── ...
├── utils/              # Helper functions (cn, formatters)
└── App.jsx             # Main App entry with Routing
```

## ⚡ Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd edu-por-3
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
