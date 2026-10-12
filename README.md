তোমার BazarDor প্রজেক্টের জন্য একটি professional `README.md` তৈরি করে দিলাম। এতে প্রজেক্টের পরিচিতি, ব্যবহৃত technologies, features, API, authentication, installation, environment variables এবং deployment নির্দেশনা থাকবে।

এটি GitHub repository-তে সরাসরি ব্যবহার করতে পারবে।

# 🛒 BazarDor — বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর

BazarDor is a modern, responsive web application designed to help users explore grocery products, compare market prices, and access product information conveniently. The project provides a user-friendly interface with authentication, product details, and market price information.

**Live Demo:** [https://hsn-bazar-dor.vercel.app](https://hsn-bazar-dor.vercel.app)

## ✨ Features

- **Responsive Design:** Works across mobile, tablet, and desktop devices.
- **Product Listing:** Browse grocery products with relevant information.
- **Category Filtering:** Explore products by categories.
- **Product Details:** View individual product information and available market price data.
- **Price History:** Access historical price information where available.
- **Market Price Comparison:** View market-specific pricing information where provided by the API.
- **User Authentication:** Sign in and create an account using Better Auth.
- **Social Login:** Google and GitHub authentication support.
- **User Profile:** Update profile information.
- **Protected Routes:** Restrict selected pages to authenticated users.
- **Loading States:** Display loading indicators and skeletons while data is loading.
- **Notifications:** Provide feedback for user actions using toast notifications.
- **Custom Error Page:** Display a custom 404 page for unavailable routes.

## 🧰 Technologies Used

| Technology                            | Purpose                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| Next.js 16                            | React framework, App Router, routing, and server-side functionality                        |
| React 19                              | Building interactive user interfaces                                                       |
| JavaScript (JSX)                      | Application logic and React components                                                     |
| Tailwind CSS                          | Responsive styling and UI design                                                           |
| Better Auth                           | Authentication and session management                                                      |
| MongoDB                               | Database for authentication and related persistent data, according to server configuration |
| REST API                              | Fetching grocery products, categories, and price information                               |
| React Hot Toast / Toast notifications | User feedback and notifications                                                            |
| Vercel                                | Application deployment and hosting                                                         |
| Git and GitHub                        | Version control and source code management                                                 |

> **Note:** The table describes the technologies used or configured for this project. Check your current `package.json` and server configuration for exact dependency versions and confirm which database collections store application data.

## 🏗️ How It Works

### 1. Frontend

The user interface is built with React and Next.js. Reusable components help organize the navigation bar, product cards, category links, authentication forms, and footer.

### 2. Product Data

The application communicates with the BazarDor REST API to retrieve product and category information.

**API base URL:**

`https://openapi.programming-hero.com/api/bazardor`

Example endpoints:

- Categories: `/categories`
- All products: `/products`
- Filter products by category: `/products?category=chal`
- Individual product: `/products/1`

API availability and the exact response structure should be verified against the current API documentation.

### 3. Authentication

Better Auth manages user authentication and sessions. The application supports email-based authentication and configured social providers, including Google and GitHub.

Protected pages can check the user's authentication session before displaying private content.

### 4. Database

MongoDB is used for persistent data associated with the configured backend. Authentication records and session-related data depend on the Better Auth database adapter and server configuration.

### 5. Deployment

The application is deployed on Vercel. Environment variables must be configured in the deployment dashboard, and the production build must complete successfully.

## 📋 Prerequisites

Before running the project, install:

- Node.js (a version compatible with your installed Next.js release)
- npm
- Git
- A MongoDB database configured for the backend
- API access and OAuth credentials where required

## 🚀 Getting Started

### 1. Clone the repository

```
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual repository URL and project directory.

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secure_random_secret

BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret

BETTER_AUTH_GITHUB_CLIENT_ID=your_github_client_id
BETTER_AUTH_GITHUB_CLIENT_SECRET=your_github_client_secret

# Add your MongoDB connection variable
# using the exact name required by your server configuration.
```

**Security:** Never commit `.env.local`, database credentials, OAuth secrets, or authentication secrets to GitHub. Use the appropriate production values in Vercel environment settings.

### 4. Start the development server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```
npm run build
```

### 6. Run the production server

```
npm run start
```

Run the production server after a successful build.

## 🔐 OAuth Configuration

For Google and GitHub login:

1. Create OAuth credentials with the relevant provider.
2. Add the client ID and client secret to your environment variables.
3. Configure the exact callback URL required by your Better Auth setup.
4. Add production environment variables in Vercel.
5. Redeploy the application after changing production environment variables.

For Google, the expected callback URL in a standard Better Auth configuration is:

`https://hsn-bazar-dor.vercel.app/api/auth/callback/google`

Verify the actual callback path against your configured auth base path.

## 📁 Project Structure

The following is an illustrative structure; adapt it to match the actual files in your repository.

```
src/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── sign-in/
│   │   └── page.jsx
│   ├── sign-up/
│   │   └── page.jsx
│   └── product/
│       └── [slug]/
│           └── page.jsx
├── components/
│   ├── Navbar.jsx
│   ├── AuthMenu.jsx
│   └── Footer.jsx
└── lib/
    ├── auth-client.js
    └── social-auth.js
```

File extensions and folder names may differ in your actual repository.

## 🌐 Deployment

The application can be deployed through Vercel:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Verify the authentication callback URLs.
5. Deploy and test the production application.

## 🔮 Future Improvements

- Search and advanced filtering
- Price trend charts
- Market and location-based comparisons
- Price alerts and notifications
- Product favorites and saved lists
- More detailed price history
- Improved accessibility and performance

## 📄 License

Add your preferred license before distributing or reusing the project.

---

**BazarDor — Making everyday market prices easier to explore.**

## কীভাবে technologies একসঙ্গে কাজ করে?

Frontend — React + Tailwind CSS

ইউজার ইন্টারফেস, ফর্ম, কার্ড ও responsive layout

Next.js

Routing, pages, server-side logic ও protected routes

REST API

Product, category ও price data

Better Auth + MongoDB

Authentication, sessions ও persistent data

এটি প্রজেক্টের ধারণাগত architecture; সঠিক request flow ও database usage তোমার source code-এর ওপর নির্ভর করে।

