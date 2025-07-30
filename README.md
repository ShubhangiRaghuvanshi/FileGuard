# 🛡️ FileGuard - Secure File Upload & Malware Scanning

A full-stack application that allows users to upload documents and simulates malware scanning asynchronously in the background.

## 🚀 Features

### Backend
- **File Upload API** - Accepts PDF, DOCX, JPG, PNG files (max 5MB)
- **Malware Scanning Simulation** - Background job queue with realistic scanning
- **Threat Detection** - Advanced pattern matching for dangerous keywords
- **Security Notifications** - Slack/Webhook integration for infected files
- **MongoDB Integration** - Persistent storage of file metadata and scan results
- **Real-time Updates** - Auto-refresh dashboard with live scan status

### Frontend
- **Modern UI/UX** - Beautiful, responsive design with gradient backgrounds
- **Drag & Drop Upload** - Intuitive file upload interface
- **Real-time Dashboard** - Live updates every 5 seconds
- **Status Filtering** - Filter by Clean, Infected, Pending status
- **Progress Indicators** - Upload progress and scanning animations
- **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: React, TypeScript, CSS3
- **Database**: MongoDB with Mongoose
- **Queue**: In-memory job queue (easily upgradable to RabbitMQ)
- **File Storage**: Local file system
- **Security**: File type validation, size limits, threat detection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd FileGuard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=mongodb://localhost:27017/fileguard
PORT=5000
# Optional: Security notifications
SECURITY_WEBHOOK_URL=your-webhook-url
SLACK_WEBHOOK_URL=your-slack-webhook
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will start on `http://localhost:3000`

## 📖 Usage

### 1. Upload Files
- Navigate to the Upload page
- Drag & drop files or click to select
- Supported formats: PDF, DOCX, JPG, PNG (max 5MB)
- Watch upload progress and "Scan in progress..." message

### 2. Monitor Scans
- Switch to Dashboard tab
- View all uploaded files with real-time status
- Filter by status: All, Pending, Clean, Infected
- Auto-refresh every 5 seconds

### 3. Scan Results
- **Clean**: ✅ Green indicator
- **Infected**: 🚨 Red indicator with threat details
- **Pending**: ⏳ Yellow indicator with spinner
- **Error**: ❌ Gray indicator

## 🔍 Malware Detection

The system simulates malware scanning by checking for dangerous patterns:

### High Severity Threats
- `rm -rf` - System deletion commands
- `eval(` - Code execution
- `exec(` - Process execution
- `shell_exec` - Shell command execution
- `system(` - System command execution
- `exploit` - Exploitation attempts

### Medium Severity Threats
- `bitcoin` - Cryptocurrency references
- `malware` - Malware references
- `virus` - Virus references
- `hack` - Hacking references
- `passwd` - Password references
- `ssh-key` - SSH key references

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend server port (default: 5000)
- `SECURITY_WEBHOOK_URL` - Generic webhook for security alerts
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications

### Customizing Threat Detection
Edit `backend/src/worker/scanner.ts` to modify:
- Threat patterns and keywords
- Scan duration simulation
- Severity levels

## 📁 Project Structure

```
FileGuard/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── queue/           # Job queue system
│   │   ├── worker/          # Malware scanning worker
│   │   ├── db.ts           # Database connection
│   │   └── app.ts          # Express server
│   ├── uploads/            # File storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # App entry point
│   └── package.json
└── README.md
```

## 🧪 Testing

### Test Clean Files
Upload any normal document or image file.

### Test Infected Files
Create a text file with dangerous keywords:
```
This file contains: rm -rf
And also: eval(
And: bitcoin
This should be detected as infected.
```

## 🔒 Security Features

- File type validation
- File size limits (5MB)
- Secure file storage
- Threat pattern detection
- Security notifications
- Input sanitization

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for the CyberXplore Developer Challenge.

## 🎯 Future Enhancements

- [ ] RabbitMQ integration for production queue
- [ ] Redis caching for performance
- [ ] File hash checking
- [ ] Advanced threat detection algorithms
- [ ] User authentication
- [ ] File encryption
- [ ] API rate limiting
- [ ] Comprehensive logging
- [ ] Unit and integration tests

---

**Built with ❤️ for the CyberXplore Developer Challenge** 