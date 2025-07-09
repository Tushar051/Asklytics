# Asklytics - GenAI-Powered Business Analytics Platform

Asklytics is a full-stack business analytics application that enables non-technical users to gain powerful insights from their organizational data through natural language queries. Built with Spring Boot (Java) backend and React.js frontend, it provides an intuitive interface for data analysis without requiring SQL knowledge.

## 🚀 Features

### Authentication & User Management
- **JWT-based Authentication** with secure token management
- **User Registration** with email verification (OTP)
- **Password Reset** functionality
- **Role-based Access Control**
- **Account Security** with login attempt limiting

### Data Sources
- **Live Database Connection** (MySQL/PostgreSQL)
- **CSV File Upload** with automatic parsing
- **Demo Dataset** for testing and exploration
- **Secure Credential Storage** with encryption

### Analytics Engine
- **Natural Language Processing** using Google Gemini AI
- **Automatic SQL Generation** from plain English queries
- **Multiple Chart Types** (Bar, Pie, Line charts)
- **Data Summarization** with AI-powered insights
- **Query History** with re-visualization capabilities

### User Interface
- **Modern, Responsive Design** with Tailwind CSS
- **Real-time Notifications** with toast messages
- **Interactive Charts** and data visualizations
- **Mobile-friendly** responsive layout
- **Dark/Light Mode** support

## 🛠️ Technology Stack

### Backend
- **Java 17** with Spring Boot 3.2.0
- **Spring Security** with JWT authentication
- **Spring Data MongoDB** for user management
- **Google Gemini AI API** for natural language processing
- **XChart** for chart generation
- **OpenCSV** for CSV processing
- **H2 Database** for temporary data storage

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Chart.js** for data visualization
- **Axios** for API communication

### Database
- **MongoDB** for user management and metadata
- **MySQL/PostgreSQL** support for live data sources
- **H2 Database** for temporary CSV data

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher
- **MongoDB** (local installation or cloud service)
- **Maven** (for backend build)
- **npm** or **yarn** (for frontend build)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Asklytics
```

### 2. Backend Setup

#### Configure MongoDB
Ensure MongoDB is running on your local machine or update the connection string in `backend/src/main/resources/application.yml`.

#### Configure Email Settings (Optional)
For email verification functionality, update the email configuration in `application.yml`:
```yaml
spring:
  mail:
    username: your-email@gmail.com
    password: your-app-password
```

#### Configure Gemini API (Required)
Add your Google Gemini API key to the environment variables or update `application.yml`:
```yaml
gemini:
  api-key: your-gemini-api-key
```

#### Build and Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📖 Usage Guide

### 1. User Registration
1. Navigate to the registration page
2. Fill in your details (name, email, password, gender)
3. Verify your email address using the link sent to your inbox
4. Log in to access the dashboard

### 2. Data Upload
- **CSV Upload**: Drag and drop CSV files or click to browse
- **Database Connection**: Enter your database credentials to connect to live data
- **Demo Data**: Use the provided sample dataset for testing

### 3. Natural Language Queries
1. Go to the Analytics section
2. Type your question in plain English (e.g., "Show average salary of engineers in Bangalore")
3. Click "Analyze" to generate insights
4. View the generated SQL, summary, and visualizations

### 4. Query History
- Access your previous queries in the History section
- Re-visualize results with different chart types
- Export data and insights

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Database Configuration
Update `application.yml` for your MongoDB connection:
```yaml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: asklytics
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Build the JAR file:
```bash
mvn clean package
```

2. Deploy to your preferred platform (AWS, Railway, Render, etc.)

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

## 🔒 Security Features

- **JWT Token Authentication** with refresh tokens
- **Password Encryption** using BCrypt
- **SQL Injection Prevention** through parameterized queries
- **CORS Configuration** for secure cross-origin requests
- **Rate Limiting** for API endpoints
- **Input Validation** and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Advanced chart customization
- [ ] Real-time data streaming
- [ ] Multi-language support
- [ ] Advanced analytics algorithms
- [ ] Mobile application
- [ ] API rate limiting and monitoring
- [ ] Advanced user roles and permissions
- [ ] Data export in multiple formats
- [ ] Integration with popular BI tools

---

**Built with ❤️ for modern business analytics**
