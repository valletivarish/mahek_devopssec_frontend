# Event RSVP and Attendance Manager - Frontend

A React 18 single-page application for managing events, RSVPs, attendees, and attendance tracking with interactive dashboards and forecasting analytics.

## Student Information

- Student: Mahek Naaz
- Student ID: 24217808
- Module: Cloud DevOpsSec (H9CDOS)

## Tech Stack

- React 18.3 with Vite
- React Router DOM 6 for routing
- Axios with JWT interceptor for API calls
- Recharts for data visualisation (charts and graphs)
- React Hook Form with Yup for form validation
- React Toastify for toast notifications
- React Icons for UI icons
- Tailwind CSS for styling

## Project Structure

```
src/
    components/
        Auth/           Login and registration forms, protected route guard
        Layout/         Navbar, Sidebar, and MainLayout wrapper
        Dashboard/      Dashboard with summary cards and charts
        Events/         Event list and form (CRUD)
        Attendees/      Attendee list and form (CRUD)
        Categories/     Category list and form (CRUD)
        Rsvps/          RSVP list and form (CRUD)
        CheckIns/       Check-in list and form
        Forecast/       Attendance forecasting analytics page
        common/         LoadingSpinner, ErrorMessage, ConfirmDialog
    context/            AuthContext for JWT state management
    services/           API service files (axios-based)
    utils/              Validation schemas and date formatting utilities
```

## Pages

- /login - User login page
- /register - User registration page
- /dashboard - Overview with summary cards and charts
- /events - Event management (list, create, edit, delete)
- /attendees - Attendee management (list, create, edit, delete)
- /categories - Category management (list, create, edit, delete)
- /rsvps - RSVP management (list, create, edit, delete)
- /checkins - Check-in management (list, create)
- /forecast - Attendance prediction analytics

## Running Locally

### Prerequisites
- Node.js 18 or higher
- npm 9+

### Setup
1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm run dev
```
3. Access the application: http://localhost:5173

### Environment Variables
Create a `.env` file for production API URL:
```
VITE_API_URL=http://your-ec2-ip:8080/api
```

## Building for Production

```bash
npm run build
```

Output is generated in the `dist/` directory.

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## CI/CD Pipeline

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and runs:
- Dependency installation (npm ci)
- ESLint code quality check
- Security audit (npm audit)
- Production build
- Security scanning (Trivy)
- Deployment to AWS S3 (on push to main)

## Cloud Deployment

- Hosting: AWS S3 with static website hosting
- Infrastructure as Code: Terraform (see terraform/ directory)
