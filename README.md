# ResumeAI Pro 🚀

An AI-powered resume analyzer that helps job seekers match their skills to job requirements, get ATS scores, and receive personalized improvement suggestions.

![ResumeAI Pro](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## 🌐 Live Demo

**Deployed on Vercel**: [Coming Soon]

## ✨ Features

- **AI-Powered Analysis** - Uses OpenAI GPT-4o-mini for intelligent resume analysis
- **Skill Matching** - Compare your skills against job requirements instantly
- **ATS Score** - Get your resume score for applicant tracking systems
- **PDF Support** - Upload PDF resumes or paste text directly
- **Multiple Job Roles** - Analyze for Web Dev, Data Analyst, DevOps, Cloud Engineer, and more
- **Personalized Suggestions** - Get actionable recommendations to improve your resume
- **Dark/Light Mode** - Beautiful UI with theme support
- **Responsive Design** - Works perfectly on desktop and mobile

## 🎯 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **AI**: OpenAI GPT-4o-mini
- **PDF Parsing**: PDF.js
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phaneendrakumarbabu/skill-matcher-pro.git
cd skill-matcher-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## 📖 Usage

1. **Upload or Paste Resume** - Upload a PDF or paste your resume text
2. **Select Job Role** - Choose your target job role (Web Developer, Data Analyst, etc.)
3. **Analyze** - Click "Analyze Resume" to get AI-powered insights
4. **Review Results** - See your skill match percentage, ATS score, and personalized suggestions

## 🔧 Configuration

### Environment Variables

- `VITE_OPENAI_API_KEY` - Your OpenAI API key (required for AI analysis)

### Fallback Mode

If the OpenAI API key is not configured or the API fails, the app automatically falls back to basic keyword matching analysis.

## 🏗️ Project Structure

```
skill-matcher-pro/
├── public/              # Static assets
│   ├── favicon.svg      # App icon
│   └── robots.txt
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn UI components
│   │   ├── Navbar.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ...
│   ├── lib/            # Utility functions
│   │   ├── aiService.ts      # OpenAI integration
│   │   ├── pdfParser.ts      # PDF parsing
│   │   └── resumeData.ts     # Resume analysis logic
│   ├── pages/          # Page components
│   │   ├── Landing.tsx
│   │   ├── Analyzer.tsx
│   │   └── Results.tsx
│   └── main.tsx        # App entry point
├── .env.example        # Example environment variables
└── package.json
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔒 Security Notes

⚠️ **Important**: The current implementation uses `dangerouslyAllowBrowser: true` which exposes the API key in the browser. This is for development/demo purposes only.

### For Production:
1. Create a backend API endpoint
2. Move OpenAI calls to the backend
3. Never expose API keys in frontend code
4. Implement rate limiting and authentication

## 💰 API Costs

The AI analysis uses approximately 1,000-2,000 tokens per analysis, costing roughly $0.001-0.002 per resume with GPT-4o-mini.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Phaneendra Kumar Babu**
- GitHub: [@phaneendrakumarbabu](https://github.com/phaneendrakumarbabu)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT-4o-mini API
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Lucide](https://lucide.dev/) for the icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Phaneendra Kumar Babu


## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phaneendrakumarbabu/skill-matcher-pro)

**Manual Deployment:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login and Deploy**
```bash
vercel login
cd skill-matcher-pro-main
vercel --prod
```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_OPENAI_API_KEY` with your OpenAI API key

4. **Update Firebase Authorized Domains**
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Build Locally

```bash
npm run build
npm run preview
```

## 📚 Documentation

- [Firebase Integration Guide](FIREBASE_INTEGRATION.md)
- [Dashboard Features](DASHBOARD_FEATURES.md)
- [Sign-In Integration](SIGNIN_INTEGRATION.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
# Required for AI features
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase (already configured in code)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🎯 Roadmap

- [x] AI-powered resume analysis
- [x] User authentication (Firebase)
- [x] Dashboard with history tracking
- [x] PDF export functionality
- [x] Beautiful sign-in/up pages
- [ ] Cover letter generator
- [ ] LinkedIn profile analyzer
- [ ] Job matching system
- [ ] Mobile app (React Native)
- [ ] Chrome extension

## 📊 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + Shadcn UI
- Framer Motion (Animations)
- Recharts (Data visualization)

**Backend:**
- Firebase Authentication
- Cloud Firestore
- Firebase Analytics

**AI:**
- OpenAI GPT-4o-mini

**Deployment:**
- Vercel (Recommended)
- Compatible with Netlify, Railway, etc.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Phaneendra Kumar Babu**
- GitHub: [@phaneendrakumarbabu](https://github.com/phaneendrakumarbabu)
- Project: [ResumeAI Pro](https://github.com/phaneendrakumarbabu/skill-matcher-pro)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT-4o-mini API
- [Firebase](https://firebase.google.com/) for authentication and database
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Lucide](https://lucide.dev/) for the icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for hosting

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Phaneendra Kumar Babu**

⭐ Star this repo if you find it helpful!
