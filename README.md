# EventHub MVP

A comprehensive event management platform built with a modern full-stack architecture. This application allows users to discover events, organize their own, manage plans and quotas, and interact with a community feed.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Directory)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Components:** Radix UI, Lucide React
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (with TypeORM)
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **Tools:** Nodemon, Jest (Testing)

## 📂 Project Structure

```
events_mvp/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── database/        # DB connection & migrations
│   │   ├── middleware/      # Custom middleware (Auth, Error)
│   │   ├── models/          # TypeORM Entities
│   │   ├── routes/          # API Routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── package.json
│
└── frontend/                # Next.js Client Application
    ├── src/
    │   ├── app/             # App Router pages
    │   ├── components/      # Reusable UI components
    │   ├── lib/             # Utilities & API clients
    │   └── store/           # Global state (Zustand)
    └── package.json
```

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🏁 Getting Started

### 1. Database Setup

Create a PostgreSQL database for the project.
```sql
CREATE DATABASE events_mvp;
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` root:
```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=events_mvp

# JWT Auth
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary (Optional for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run database migrations and seed data:
```bash
npm run db:reset
# Or run individually:
# npm run db:migrate
# npm run db:seed
```

Start the development server:
```bash
npm run dev
```
The backend server should now be running at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file in the `frontend` root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

Start the development server:
```bash
npm run dev
```
The application should now be accessible at `http://localhost:3000`.

## 📜 Key Scripts

### Backend
- `npm run dev`: Starts the server in development mode with Nodemon.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled production server.
- `npm run db:migrate`: Runs pending database migrations.
- `npm run db:seed`: Seeds the database with initial data.
- `npm test`: Runs test suite using Jest.

### Frontend
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
