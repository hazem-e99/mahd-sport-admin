# Mahd Sports Academy Admin Panel##

## Project Overview

Mahd Sports Academy Admin Panel is a comprehensive React-based administrative dashboard built with TypeScript and Vite. The application provides a complete content management system for managing sports academy operations, including user surveys, awareness campaigns, notifications, and various configurations.

## 🏗️ Project Structure

```
mahdacademyadmin/
├── .env.Staging              # Staging environment variables
├── .env.development          # Development environment variables
├── .env.production          # Production environment variables
├── .gitlab-ci.yml           # GitLab CI/CD configuration
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── public/
│   ├── icons/               # Static icon assets
│   ├── images/              # Static image assets
│   └── locales/             # Translation files (ar.json, en.json)
└── src/
    ├── api/                 # API layer
    │   ├── endpoints/       # API endpoint definitions
    │   └── services/        # Service layer for API calls
    ├── components/          # Reusable UI components
    │   ├── common/          # Shared components
    │   ├── hooks/           # Custom React hooks
    │   └── icons/           # SVG icon components
    ├── constants/           # Application constants
    ├── context/             # React context providers
    ├── pages/               # Page components
    ├── styles/              # Global styles
    ├── types/               # TypeScript type definitions
    ├── utils/               # Utility functions
    ├── App.tsx              # Main application component
    ├── routes.tsx           # Application routing
    ├── msalConfig.ts        # Microsoft Authentication configuration
    └── i18n.ts              # Internationalization setup
```

## 🚀 Key Features

### 1. **Authentication & Authorization**
- Microsoft Azure AD integration using MSAL (Microsoft Authentication Library)
- Role-based access control
- Secure token management
- Automatic token refresh

### 2. **Multi-language Support**
- Arabic and English language support
- Dynamic language switching
- Localization service integration
- RTL (Right-to-Left) layout support

### 3. **Content Management**
- **Tab Configurations**: Manage navigation tabs and categories
- **Widget Configurations**: Configure dashboard widgets and layouts
- **Awareness Campaigns**: Create and manage promotional campaigns
- **FAQ Management**: Maintain frequently asked questions
- **Notification System**: Send and manage user notifications

### 4. **Survey & Feedback System**
- **User Surveys**: Create, edit, and manage user surveys
- **Survey Results**: View and analyze survey responses
- **User Feedback**: Collect and manage user feedback

### 5. **Administrative Features**
- **Audit Logs**: Track system activities and changes
- **Roles & Permissions**: Manage user roles and access levels
- **General Settings**: Configure application-wide settings
- **Corporate Management**: Manage corporate entities
- **Tour Steps**: Configure guided tours for users

### 6. **File Management**
- Image upload and management
- File upload with validation
- Asset optimization

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 19.1.0** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 6.3.5** - Fast build tool and dev server

### **UI & Styling**
- **Bootstrap 5.3.6** - UI component framework
- **React Bootstrap 2.10.9** - React Bootstrap components
- **Tailwind CSS 4.1.6** - Utility-first CSS framework
- **Sass 1.88.0** - CSS preprocessor

### **State Management & Forms**
- **React Hook Form 7.60.0** - Form management
- **Yup 1.6.1** - Schema validation
- **React Context** - Global state management

### **Routing & Navigation**
- **React Router 7.6.0** - Client-side routing
- **React Router DOM 7.6.0** - DOM bindings for React Router

### **Authentication**
- **@azure/msal-browser 4.21.1** - Microsoft Authentication Library
- **@azure/msal-react 3.0.19** - React integration for MSAL

### **HTTP Client & API**
- **Axios 1.9.0** - HTTP client for API calls
- **Custom API services** - Structured API layer

### **Internationalization**
- **i18next 25.1.2** - Internationalization framework
- **react-i18next 15.5.1** - React integration for i18next
- **i18next-http-backend 3.0.2** - Backend plugin for loading translations

### **Rich Text & Data Display**
- **@tiptap/react 2.12.0** - Rich text editor
- **React Data Table Component 7.7.0** - Data tables
- **React DatePicker 8.3.0** - Date selection
- **React Select 5.10.1** - Enhanced select components

### **Notifications & UI Enhancements**
- **React Toastify 11.0.5** - Toast notifications
- **React Tooltip 5.28.1** - Tooltips
- **@hello-pangea/dnd 18.0.1** - Drag and drop functionality

## 🌍 Environment Configuration

The application supports multiple environments with specific configurations:

### **Development Environment**
- Local development server on port 3000
- Debug mode enabled
- MSAL logging enabled
- Local API endpoints

### **Staging Environment**
- Staging server configuration
- Production-like environment for testing
- Staging API endpoints

### **Production Environment**
- Optimized build
- Error reporting enabled
- Production API endpoints
- Enhanced security settings

## 📝 Development Scripts

```bash
# Development
npm run dev                 # Start development server

# Building
npm run build              # Build for production
npm run build:dev          # Build for development
npm run build:staging      # Build for staging
npm run build:prod         # Build for production

# Quality Assurance
npm run lint               # Run ESLint
npm run preview            # Preview production build

# Icon Generation
npm run svgr               # Generate React components from SVG icons
```

## 🔧 Key Configuration Files

### **Environment Variables**
- `VITE_BASE_URL` - Application base URL
- `VITE_API_BASE_URL` - API server URL
- `VITE_SIGNALR_HUB_URL` - SignalR hub URL for real-time notifications
- `VITE_REDIRECT_BASE_URL` - OAuth redirect URL
- `VITE_LOGOUT_URL` - Logout redirect URL

### **Authentication Configuration**
- Azure AD client configuration
- MSAL cache settings
- API scopes and permissions
- Token management

### **Internationalization**
- Language detection
- Translation file loading
- Fallback language configuration

## 🏛️ Architecture Patterns

### **Component Architecture**
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-based Structure**: Pages and components grouped by functionality
- **Separation of Concerns**: Clear separation between UI, business logic, and data

### **State Management**
- **React Context**: Global state for authentication and language
- **Local State**: Component-specific state using useState and useReducer
- **Form State**: React Hook Form for complex form management

### **API Layer**
- **Service Pattern**: Dedicated service classes for API interactions
- **Endpoint Configuration**: Centralized API endpoint definitions
- **Error Handling**: Consistent error handling across the application

### **Routing Strategy**
- **Nested Routing**: Hierarchical route structure
- **Language-based Routing**: URLs include language parameter (/:lng/page)
- **Lazy Loading**: Code splitting for better performance

## 🔒 Security Features

- **Azure AD Integration**: Enterprise-grade authentication
- **Token-based Authentication**: Secure API access
- **Role-based Access Control**: Granular permission system
- **HTTPS Enforcement**: Secure communication
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content sanitization

## 📱 Responsive Design

- **Mobile-first Approach**: Optimized for mobile devices
- **Bootstrap Grid System**: Responsive layout system
- **Tailwind Utilities**: Fine-grained responsive controls
- **Touch-friendly Interface**: Optimized for touch interactions

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Tree Shaking**: Elimination of unused code
- **Asset Optimization**: Optimized images and assets
- **Caching Strategy**: Efficient caching of API responses
- **Bundle Analysis**: Monitoring and optimization of bundle size

## 🧪 Development Best Practices

- **TypeScript**: Type safety throughout the application
- **ESLint**: Code quality and consistency
- **Component Reusability**: Modular and reusable components
- **Custom Hooks**: Reusable business logic
- **Error Boundaries**: Graceful error handling
- **Accessibility**: WCAG compliance considerations

## 📋 Deployment

The application uses GitLab CI/CD for automated deployment:

- **Automated Testing**: Run tests on every commit
- **Multi-environment Deployment**: Separate pipelines for dev, staging, and production
- **Build Optimization**: Optimized builds for each environment
- **Environment-specific Configuration**: Dynamic configuration based on deployment target

---

*This documentation serves as a comprehensive guide to understanding the Mahd Sports Academy Admin Panel architecture, features, and development practices.*