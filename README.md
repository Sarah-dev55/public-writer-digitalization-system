# public-writer-digitalization-system
A comprehensive web platform designed to digitalize and streamline the services of a professional public writer specializing in international administrative procedures.

The project uses:

* **Frontend:** React.js + Tailwind CSS
* **Backend:** Node.js + Express
## Frontend (`frontend/`)

```
frontend/
├── index.html                     # Main HTML file (root of frontend)
├── favicon.ico                    # Favicon
├── public/
│   └── assets/                    # Static assets (images, logos, icons)
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── common/                # Shared components (Button, Card, Modal)
│   │   ├── layout/                # Layout components (Header, Footer, Sidebar)
│   │   └── forms/                 # Form components (LoginForm, SignUpForm, etc.)
│   ├── pages/                     # Page components
│   │   ├── Home.jsx               # Landing page with services info
│   │   ├── Login.jsx              # Login page
│   │   ├── SignUp.jsx             # Registration page
│   │   ├── client/                # Client interface pages
│   │   │   ├── Overview.jsx       # Client dashboard
│   │   │   ├── Appointments.jsx   # View/book appointments
│   │   │   └── Documents.jsx      # Manage documents
│   │   └── admin/                 # Admin interface pages
│   │       ├── Dashboard.jsx      # Admin dashboard
│   │       ├── Clients.jsx        # Manage clients
│   │       ├── Appointments.jsx   # Manage all appointments
│   │       └── Documents.jsx      # Manage all documents
│   ├── services/                  # API service functions (Axios calls)
│   ├── context/                   # React Context for state management
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions (validators, formatters)
│   ├── routes/                    # Route components and protected routes
│   ├── styles/                    # Tailwind imports and custom CSS
│   ├── App.jsx                     # Main App component
│   └── main.jsx                    # React entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env.example                    # Environment variables template* **Database:** MongoDB

---

## Project Structure

#
```

> **Note:** Some pages and components listed above are **examples only**. You can freely **add new pages, components, hooks, utils, or modify existing ones** according to project needs.

---

### Backend (`backend/`)

```
backend/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.js            # MySQL connection setup
│   │   ├── auth.js                # JWT & authentication config
│   │   └── multer.js              # File upload configuration
│   ├── controllers/               # Request handlers / business logic
│   │   ├── authController.js      # Login, signup, logout logic
│   │   ├── userController.js      # User management logic
│   │   ├── appointmentController.js
│   │   └── documentController.js
│   ├── models/                    # Database models / queries
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Document.js
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── documentRoutes.js
│   ├── middleware/                # Express middleware
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── adminMiddleware.js     # Admin role check
│   │   ├── errorHandler.js        # Global error handling
│   │   └── uploadMiddleware.js    # File upload handling
│   ├── utils/                     # Helper functions
│   │   ├── validators.js
│   │   ├── emailService.js
│   │   └── helpers.js
│   └── app.js                     # Express app setup
├── uploads/                        # Folder for uploaded files
│   └── documents/
├── package.json
├── server.js                       # Server entry point
└── .env.example                    # Environment variables template
```

> **Note:** Some controllers, models, or routes are **examples only**. You can **add or modify backend files** as needed for new features.

---

## Getting Started

### Frontend

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```
4. The app will run at `http://localhost:5173` by default.

### Backend

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your environment variables (database, JWT secret, etc.).
4. Start the server:

   ```bash
   npm start
   ```
5. The API will run at `http://localhost:5000` (or your configured port).

---

## Notes

* Use Postman or any API client to test backend endpoints.
* The folder structure is designed for **scalability** and **team collaboration**.
* `uploads/` stores user-uploaded documents.
* React context (`context/`) and services (`services/`) handle state management and API calls respectively.
* You can freely **add, modify, or remove pages, components, controllers, routes, and other files** according to the project requirements.
