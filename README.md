<div align="center">

# 🎭 Vybe

### A Modern Full-Stack Social Media Platform

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[Live Demo](https://vybe-ev36.onrender.com/) • [Report Bug](https://github.com/Ujjwal-Kumar6/Socal-midia/issues) • [Request Feature](https://github.com/Ujjwal-Kumar6/Socal-midia/issues)

</div>

---

## 📖 Overview

**Vybe** is a feature-rich social media web application that brings people together through shared experiences and interactions. Built with modern web technologies, it demonstrates real-world full-stack development practices including authentication, RESTful API design, responsive UI, and cloud deployment.

This project showcases my journey in mastering full-stack development while still in Class 10, proving that age is no barrier to creating professional-grade applications.

### 🌟 Why Vybe?

- **Real-World Architecture**: Implements industry-standard patterns and practices
- **Scalable Design**: Built with growth and maintainability in mind
- **Modern Stack**: Leverages cutting-edge technologies for optimal performance
- **Production Ready**: Fully deployed and accessible online

---

## ✨ Features

<table>
  <tr>
    <td>
      <h3>🔐 Authentication</h3>
      <ul>
        <li>Secure user registration</li>
        <li>Login with JWT tokens</li>
        <li>Protected routes</li>
        <li>Session management</li>
      </ul>
    </td>
    <td>
      <h3>👤 User Profiles</h3>
      <ul>
        <li>Customizable profiles</li>
        <li>Profile pictures</li>
        <li>Bio and personal info</li>
        <li>Activity tracking</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📱 Social Features</h3>
      <ul>
        <li>Create and share posts</li>
        <li>Like and comment system</li>
        <li>Real-time feed updates</li>
        <li>User interactions</li>
      </ul>
    </td>
    <td>
      <h3>🎨 User Experience</h3>
      <ul>
        <li>Responsive design</li>
        <li>Intuitive interface</li>
        <li>Fast page loads (Vite)</li>
        <li>Smooth animations</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

### Frontend
```
⚛️  React 18          - UI Library
⚡  Vite              - Build Tool & Dev Server
🎨  CSS3              - Styling
📡  Axios             - HTTP Client
🔄  React Router      - Navigation
```

### Backend
```
🟢  Node.js           - Runtime Environment
🚂  Express.js        - Web Framework
🔑  JWT               - Authentication
🗄️  Database          - Data Storage
📋  REST API          - API Architecture
```

### DevOps & Tools
```
🐙  Git & GitHub      - Version Control
🚀  Render            - Cloud Hosting
🔧  VS Code           - Development Environment
📦  npm               - Package Management
```

---

## 📂 Project Structure

```
📦 Vybe/
│
├── 📂 backend/
│   ├── 📂 controllers/       # Business logic
│   ├── 📂 models/            # Database schemas
│   ├── 📂 routes/            # API endpoints
│   ├── 📂 middleware/        # Auth & validation
│   ├── 📜 server.js          # Entry point
│   └── 📜 package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable UI components
│   │   ├── 📂 pages/         # Route pages
│   │   ├── 📂 hooks/         # Custom React hooks
│   │   ├── 📂 utils/         # Helper functions
│   │   ├── 📂 assets/        # Images, icons, etc.
│   │   ├── 📜 App.jsx        # Root component
│   │   └── 📜 main.jsx       # Entry point
│   │
│   ├── 📜 vite.config.js     # Vite configuration
│   ├── 📜 index.html
│   └── 📜 package.json
│
├── 📜 .gitignore
├── 📜 README.md
└── 📜 package.json
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ujjwal-Kumar6/Socal-midia.git
   cd Socal-midia
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Run the application**
   
   **Development Mode:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```
   
   **Production Mode:**
   ```bash
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🌍 Deployment

This project is deployed on [Render](https://render.com/) and is live at:

### 🔗 [https://vybe-ev36.onrender.com/](https://vybe-ev36.onrender.com/)

### Deployment Steps:

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Build the frontend: `npm run build`
   - Test production build locally

2. **Deploy to Render**
   - Connect your GitHub repository
   - Configure build commands
   - Set environment variables
   - Deploy!

---


## 🎯 Roadmap

- [x] User authentication system
- [x] Post creation and feed
- [x] User profiles
- [x] Responsive design
- [x] Real-time notifications
- [x] Direct messaging
- [x] Image uploads with cloud storage
- [x] Advanced search functionality
- [x] Dark mode toggle
- [x] Mobile app (React Native)

---

## 🧠 What I Learned

Building Vybe has been an incredible learning experience. Here are the key takeaways:

### Technical Skills
- **Full-Stack Architecture**: Understanding how frontend and backend work together
- **RESTful API Design**: Creating scalable and maintainable APIs
- **State Management**: Handling complex application state in React
- **Authentication Flow**: Implementing secure JWT-based authentication
- **Database Design**: Structuring data for optimal performance
- **Deployment**: Taking an application from local development to production

### Soft Skills
- **Problem Solving**: Debugging complex issues across the stack
- **Project Management**: Planning and executing a full-scale project
- **Documentation**: Writing clear and helpful documentation
- **Version Control**: Using Git effectively for collaboration

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About the Developer

<div align="center">

### Ujjwal Kumar

**Class 10 Student | Full-Stack Developer | Tech Enthusiast**

*Building this production-grade social media platform while still in Class 10 (January 2026)*

[![GitHub](https://img.shields.io/badge/GitHub-Ujjwal--Kumar6-181717?style=for-the-badge&logo=github)](https://github.com/Ujjwal-Kumar6)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](#)

</div>

---

## 🙏 Acknowledgments

- Inspired by modern social media platforms
- Built with amazing open-source technologies
- Thanks to the developer community for continuous learning resources
- Special mention to all contributors and supporters

---

## 📞 Contact & Support

- **Email**: [uk7320942276@gmail.com](mailto:uk7320942276@gmail.com)

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Made with ❤️ by Ujjwal Kumar**

*Building the future, one commit at a time* 🚀

[![Star this repo](https://img.shields.io/github/stars/Ujjwal-Kumar6/Socal-midia?style=social)](https://github.com/Ujjwal-Kumar6/Socal-midia)
[![Follow on GitHub](https://img.shields.io/github/followers/Ujjwal-Kumar6?style=social)](https://github.com/Ujjwal-Kumar6)

</div>
