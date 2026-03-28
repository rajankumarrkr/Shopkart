# ShopKart 🛒

ShopKart is a modern, responsive, full-stack E-commerce platform built using the **MERN** (MongoDB, Express.js, React, Node.js) stack. It features a complete shopping flow, an administrative dashboard, rich UI/UX, and robust performance optimization.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT.
- **Product Management**: Intuitive navigation for product discovery, categories, and dynamic product details.
- **Admin Portal**: A dedicated administrative dashboard for managing products, users, and orders.
- **Shopping Cart & Checkout**: Seamless cart management with an efficient checkout process.
- **Responsive Design**: Mobile-first architecture built with Tailwind CSS.
- **Performance Optimized**: Features code-splitting, fast loading strategies, and minimized network overloads.

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: [React.js](https://reactjs.org/) (via Vite for fast builds)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: React Context API

### Backend (`/server`)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT & bcryptjs

---

## 💻 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine. You will also need a local or cloud instance of **MongoDB** running.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajankumarrkr/Shopkart.git
   cd Shopkart
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory using the provided sample or with the following variables:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

To run the application locally, you will need to start both the backend server and the frontend client simultaneously.

**1. Start the Backend Server:**
```bash
cd server
npm run dev
```

**2. Start the Frontend Client:**
```bash
cd client
npm run dev
```

The server will generally run on `http://localhost:5000` (or your configured port) and the client will be accessible at `http://localhost:5173`.

## 🛡️ Administrative Access

ShopKart uses role-based access control. Standard users can browse products and checkout, while administrators have a dedicated interface to manage the store.

- **Admin Login Endpoint**: `/admin/login`
- Use your designated Admin ID and password to access the dashboard.

---

*Designed and engineered with a focus on premium aesthetics and scalable architecture.*
