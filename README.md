# Snippet SOS – A Developer Snippet & Paste Management Platform

Snippet SOS is a professional, developer-focused platform designed to help you create, store, manage, and share text pastes securely. Whether you are dealing with code snippets, terminal commands, quick notes, or configuration files, Snippet SOS provides a clean, minimal interface inspired by the best developer tools.

---

## Motivation / Why This Project Exists

Developers frequently deal with temporary snippets of code, reusable logic, system configurations, and terminal commands. While fully-fledged version control is great for entire projects, it's often too heavy for quick sharing or storing a single script. Sending code over messaging platforms breaks formatting, and existing paste tools are often cluttered with ads or lacking modern developer-first features.

Snippet SOS solves this by offering a fast, clean, and organized space to save and retrieve your snippets locally, categorizing them via tags and favorites, making them instantly accessible and easily shareable.

---

## Key Features

- **Create Paste**: Add title, content, tags, visibility, and expiration.
- **Edit Paste**: Update your existing snippets at any time.
- **Delete Paste**: Remove pastes you no longer need.
- **View Paste**: Read-only view with syntax styled appearance.
- **Copy to Clipboard**: One-click copying for fast workflow.
- **Shareable Paste Link**: Native device sharing or clipboard copy for easy distribution.
- **Search Pastes**: Find snippets instantly by title or content.
- **Favorite Pastes**: Star your most important pastes for quick access.
- **Tags**: Organize snippets with tags like `javascript`, `config`, or `notes`.
- **Public / Private**: Keep sensitive configs private or share useful snippets with the community.
- **User Authentication**: Secure JWT-based registration and login.
- **Download as Text**: Save any paste directly as a `.txt` file.
- **Auto-save Drafts**: Never lose your progress while typing.
- **Expiration Options**: Set pastes to self-destruct after 1 hour, 1 day, 7 days, or 30 days.

---

## Tech Stack

Snippet SOS is built using the **MERN** stack for a robust, scalable architecture.

**Frontend:**
- **React.js** (Bootstrapped with Vite)
- **React Router v6** (Client-side routing and protected routes)
- **Axios** (API requests and interceptors)
- **Vanilla CSS** (Custom CSS Variables, Dark theme design system)

**Backend:**
- **Node.js**
- **Express.js** (REST API framework)

**Database & Auth:**
- **MongoDB** (NoSQL Database)
- **Mongoose** (ODM for MongoDB scheduling and validation)
- **JSON Web Tokens (JWT)** (Stateless Authentication)
- **Bcrypt.js** (Password hashing)

---

## Architecture Overview

Snippet SOS follows a standard client-server architecture:
1. **Frontend (React)**: Handles the user interface, component state, form validation, and client-side routing. It stores the JWT token locally and attaches it to authenticated requests.
2. **Backend (Express API)**: Exposes RESTful endpoints for authentication and paste management. It contains middleware to verify tokens and optionally authenticate open endpoints (like viewing public pastes).
3. **Database (MongoDB)**: Stores `Users` and `Pastes` collections securely. Uses Mongoose for schema validation.

---

## Folder Structure

```text
codepaste-hub/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic handlers (authController, pasteController)
│   ├── middleware/      # JWT verification middleware
│   ├── models/          # Mongoose schemas (User, Paste)
│   ├── routes/          # Express route definitions
│   ├── server.js        # Main Express entry point
│   ├── package.json
│   └── .env             # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar, PasteCard, Toast)
    │   ├── context/     # React Context for global auth state
    │   ├── pages/       # Route-level components (Home, ViewPaste, Login)
    │   ├── services/    # Axios API configuration
    │   ├── App.jsx      # Main application and router setup
    │   ├── main.jsx     # Frontend entry point
    │   └── index.css    # Global styling and design system
    └── package.json
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET  /api/auth/me` - Get current logged-in user details

### Pastes
- `GET    /api/pastes` - Get all pastes owned by the authenticated user
- `POST   /api/pastes` - Create a new paste
- `GET    /api/pastes/public` - Get all public pastes
- `GET    /api/pastes/:id` - Get a specific paste by ID
- `PUT    /api/pastes/:id` - Update a paste (owner only)
- `DELETE /api/pastes/:id` - Delete a paste (owner only)
- `PATCH  /api/pastes/:id/favorite` - Toggle favorite status

---

## Installation Guide

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/snippet-sos.git
cd snippet-sos
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/codepaste-hub
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## Future Improvements

- [ ] **Syntax Highlighting**: Integrate `Prism.js` or `highlight.js` for automatic language detection and styling.
- [ ] **Real-time Collaboration**: Use WebSockets to allow multiple users to edit a scratchpad together.
- [ ] **Folder Organization**: Allow users to group pastes into custom folders alongside tags.
- [ ] **Code Editor Integration**: Implement `Monaco Editor` or `CodeMirror` instead of a standard textarea for authentic IDE features.

---

## Contributing

Contributions are welcome! If you have ideas for improvements, feel free to open an issue or fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

**[Mahindra .D. Choudhary]**  
*Full Stack Developer*  
[GitHub](https://github.com/Mahindra021) • [LinkedIn](https://www.linkedin.com/in/mahindra021/)
