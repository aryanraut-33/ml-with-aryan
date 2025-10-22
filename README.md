# ML with Aryan: A Modern Content Platform

> A minimal, performant, and visually sophisticated full-stack platform for publishing and managing Machine Learning blogs and video content.

![ML with Aryan Homepage](https://i.imgur.com/your-screenshot-url.png) 
*(**Note:** You will need to take a screenshot of your live homepage, upload it to a service like Imgur, and replace the URL above.)*

## About The Project

"ML with Aryan" was built from the ground up as a personal content platform for a Machine Learning author. The core vision was to create a sleek, minimal-stack website that is easy to deploy, maintain, and extend. The platform serves two primary stakeholders:

*   **Readers:** Visitors who can browse, read, and watch articles and videos on a clean, responsive, and interactive user interface.
*   **Admin (Author):** The owner of the site, who can securely log in to a dedicated dashboard to perform full CRUD (Create, Read, Update, Delete) operations on all content, manage authors, and view performance analytics.

This project was architected by **Nova**, focusing on modern development patterns, a clean separation of concerns, and a premium user experience.

## Key Features

### For Readers
*   **Fully Responsive Design:** A seamless experience on any device, from mobile phones to widescreen desktops.
*   **Interactive UI:** Features a dynamic, animated background grid with a mouse-tracking "aura" effect, and a continuously scrolling logo carousel.
*   **Dynamic Content Hub:** Homepage features a magazine-style layout with a prominent "featured" post and a grid of older content.
*   **Content Toggling:** Users can instantly switch between "Latest Articles" and "Latest Videos" on the homepage without a page reload.
*   **Advanced Sorting:** Both the blogs and videos gallery pages can be sorted by "Latest" or "Most Popular" (by view count).
*   **Markdown Rendering:** Blog posts are rendered from Markdown, allowing for rich text formatting and inline images.

### For the Admin
*   **Secure Authentication:** A dedicated "Vault Access" login page with JWT-based authentication.
*   **Data-Rich Dashboard:** A command center that displays key performance indicators, including total views, content counts, and a visual bar chart of top-performing posts.
*   **Full CRUD Functionality:** Manage all aspects of blogs and videos, including titles, descriptions, tags, and author names.
*   **Local File Uploads:** A seamless thumbnail and inline image upload system integrated with Cloudinary for robust media management.
*   **Separated UI:** A distinct, professional admin interface that is functionally and visually separate from the public-facing site.

## Tech Stack

This project is built on the MERN stack, with a modern frontend framework and a focus on best practices for deployment.

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** CSS Modules, with a mobile-first, responsive design.
*   **UI & Animations:**
    *   `react-icons` for a comprehensive icon set.
    *   `react-tsparticles` & `tsparticles` for the animated particle background.
    *   `react-fast-marquee` for the infinite logo carousel.
    *   `recharts` for the dashboard performance chart.
*   **Data Fetching:** Axios

### Backend
*   **Framework:** Node.js with Express.js
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Handling:** Multer for receiving file uploads.

### Database & Cloud
*   **Database:** MongoDB Atlas (Cloud)
*   **ORM:** Mongoose
*   **Image Hosting:** Cloudinary for all media uploads.

### Deployment
*   **Frontend:** Vercel
*   **Backend:** Render

## High-Level Architecture

The project follows a modern, decoupled architecture with a clear separation of concerns:

*   **Monorepo:** Both frontend and backend codebases are managed within a single GitHub repository for streamlined development.
*   **REST API:** The Express.js backend serves a RESTful API that the frontend consumes for all data operations.
*   **Separate Deployments:**
    *   The Next.js frontend is deployed as a static/SSR site on **Vercel**, leveraging its global CDN for high performance.
    *   The Node.js backend is deployed as a web service on **Render**, handling all server-side logic and database connections.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need the following software installed on your machine:
*   Node.js (v18.x or later)
*   npm (comes with Node.js)
*   Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Setup the Backend:**
    ```sh
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the environment variables listed below. Then, run the server:
    ```sh
    npm run dev
    ```

3.  **Setup the Frontend:**
    In a new terminal window:
    ```sh
    cd frontend
    npm install
    ```
    Create a `.env.local` file in the `frontend` directory and add the environment variable listed below. Then, run the development server:
    ```sh
    npm run dev
    ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` and `.env.local` files.

### Backend (`backend/.env`)

```sh
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

# Frontend (`frontend/.env.local`)

```sh
NEXT_PUBLIC_API_URL
```

## Deployment

This project is designed for separate deployments on Vercel and Render from a single monorepo.

- **Render (Backend)**

- **Vercel (Frontend)**

---

## Future Enhancements

- **Full-Text Search:** Implement a search bar to query blogs and videos.  
- **CI/CD Pipeline:** Add GitHub Actions to run tests before deployment.  
- **Pagination:** For the `/blogs` and `/videos` pages to handle a large amount of content.  
- **Advanced Analytics:** Integrate a more robust analytics tool for deeper insights.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
