Marketplace App
A modern marketplace web application built with React for the frontend, Node.js and Express for the backend, using Prisma to interface with a PostgreSQL database. This app allows users to browse, search, and filter products, add products to a shopping cart, and manage a wishlist.

Features
Product Listing: View a list of products from various categories.
Search Functionality: Search for products by name.
Product Detail Page: Users can view details of individual products.
Add to Cart: Add products to the cart with a quantity.
Wishlist: Add/remove products from a wishlist.
Category Filtering: Filter products by categories.
Responsive Design: Optimized for both desktop and mobile screens.
State Management: Using React Context API to manage cart and wishlist.
Technologies Used
Frontend:

React: UI library for building user interfaces.
React Router: For navigation and routing.
Axios: For making API requests.
Tailwind CSS: For styling and responsive design.
Backend:

Node.js: JavaScript runtime for building the server.
Express.js: Web framework for Node.js.
Prisma: ORM for interacting with PostgreSQL.
Database:

PostgreSQL: Relational database management system.

Installation
To run this app locally, follow the steps below:

Prerequisites
Node.js (v14 or above)
npm or yarn
PostgreSQL (Make sure you have PostgreSQL set up locally or use a cloud instance)
Clone the repository
bash

git clone https://github.com/yinkus89/marketplace-app.git
cd marketplace-app
Setup Backend (Node.js + PostgreSQL)
Install backend dependencies:
bash

cd backend
npm install
Setup PostgreSQL database and Prisma:
Create a .env file in the backend directory and configure your PostgreSQL connection URL:


DATABASE_URL="postgresql://username:password@localhost:5432/marketplace_db?schema=public"
Run Prisma migrations to set up the database schema:
bash

npx prisma migrate dev --name init
Start the backend server:
bash

npm run dev
Your backend should now be running on http://localhost:4000.

Setup Frontend (React)
Install frontend dependencies:
bash

cd frontend
npm install
Start the frontend React app:
bash

npm start
Your frontend should now be running on http://localhost:3000.

API Endpoints
The following API endpoints are available for interacting with the app:

GET /products: Fetches all products.
GET /categories: Fetches all product categories.
GET /product/:id: Fetches a single product by its ID.
POST /cart: Adds a product to the cart.
DELETE /cart/:id: Removes a product from the cart.
POST /wishlist: Adds a product to the wishlist.
DELETE /wishlist/:id: Removes a product from the wishlist.

Folder Structure
________________________
/marketplace-app
├── /backend                  # Backend code (Node.js, Express, Prisma)
│   ├── /controllers          # Controllers for handling routes (logic for handling HTTP requests)
│   ├── /models               # Prisma models and database logic (DB schema & interactions)
│   ├── /routes               # Express routes (API routes for products, categories, cart, etc.)
│   ├── /services             # Business logic and service layer (handle operations like adding products to cart, etc.)
│   ├── /middleware           # Middleware for handling tasks like authentication, logging, etc.
│   ├── /validators           # Input validation logic (validate data coming in from requests)
│   ├── /prisma               # Prisma schema and migrations (database schema & migrations)
│   ├── /utils                # Helper utilities (common functions for date formatting, error handling, etc.)
│   ├── /server               # Express server setup (App configuration, middleware, routing)
│   ├── /dist                 # Compiled production files (when you build the app for deployment)
├── /frontend                 # Frontend code (React)
│   ├── /components           # React components (ProductCard, Cart, etc.)
│   ├── /context              # React Context API (CartContext, WishlistContext)
│   ├── /pages                # Page components (Shop, ProductDetail, Cart)
│   ├── /api                  # API client for making requests to the backend
│   ├── /assets               # Images, icons, and static assets
│   └── /styles               # Tailwind CSS and custom styles
├── /node_modules             # Node.js modules
├── package.json              # Project metadata and dependencies
├── .env                      # Environment variables (backend)
└── README.md                 # Project README

------------------------
Folder Breakdown for Backend:
---------------------------------
1. /controllers
Purpose: Contains all the route handler functions that control the logic of various endpoints.
Example Files:
productController.js: Logic to handle product-related requests.
cartController.js: Logic to handle cart-related requests.
2. /models
Purpose: Contains the Prisma schema and any database-related logic. It defines the structure of your database tables and relations.
Example Files:
Product.js: Prisma model for the products table.
User.js: Prisma model for users if applicable.
3. /routes
Purpose: Contains all your Express route definitions.
Example Files:
productRoutes.js: Defines routes related to products (GET /products, POST /products, etc.).
categoryRoutes.js: Defines routes related to product categories.
4. /services
Purpose: Contains the service layer that handles the business logic. Services typically interact with models (i.e., Prisma queries) and prepare data for controllers.
Example Files:
productService.js: Contains logic to retrieve products from the database, add products to the cart, etc.
cartService.js: Business logic for cart operations such as adding/removing products, updating quantities, etc.
5. /middleware
Purpose: Contains reusable middleware functions like authentication checks, logging, etc.
Example Files:
authMiddleware.js: Check if the user is authenticated before allowing access to protected routes.
errorHandlingMiddleware.js: Centralized error handling middleware for catching unhandled errors.
6. /validators
Purpose: Contains input validation logic, ensuring data received in requests is valid and safe to use.
Example Files:
productValidator.js: Validates product creation requests.
cartValidator.js: Validates data when adding or updating items in the cart.
7. /prisma
Purpose: Contains the Prisma configuration, schema, and migration files. This directory is where your database models are defined.
Example Files:
schema.prisma: Prisma schema file where your database models and relations are defined.
migrations/: Contains Prisma migration files for evolving your database schema.
8. /utils
Purpose: Helper utilities that are used across the app. This could include things like formatting dates, generating random IDs, or custom error handling utilities.
Example Files:
errorUtils.js: Custom error handler that provides standardized error messages.
dateUtils.js: Utilities for working with dates (e.g., formatting, parsing).
9. /server
Purpose: Contains the main Express server configuration, middleware setup, and route handling.
Example Files:
app.js: Main entry point where the Express app is created, middleware is applied, and routes are registered.
server.js: Starts the Express server.
10. /dist
Purpose: This directory will contain the transpiled (compiled) code when the backend is built for production. This is generally where the production-ready files are stored after you run a build command (npm run build or similar).
Example Files:
index.js: The main entry file that will be executed in production.
app.js: Transpiled code from your source code.

