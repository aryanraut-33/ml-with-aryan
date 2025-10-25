# ML with Aryan - V2: A Modern Content Platform

> An interactive, community-driven, and visually sophisticated full-stack platform for publishing and managing Machine Learning content.

[![Landing Page](https://res.cloudinary.com/dxghlnzxg/image/upload/v1761355771/Screenshot_2025-10-25_at_6.59.12_AM_q839vf.png)](https://aryanraut.tech)

(click the screengrab to visit the website)

## About The Project

"ML with Aryan" has evolved from a personal portfolio into a dynamic content hub. Version 2 introduces a full suite of community features, a complete UI/UX overhaul, and a robust, mobile-first responsive architecture. The platform is designed for a premium user experience, from its immersive, interactive design to its powerful authoring tools.

The platform serves three primary roles:

*   **Readers:** Visitors who can browse, read, and watch content on a stunning, responsive interface.
*   **Authenticated Users:** Logged-in members who can personalize their experience by liking and bookmarking content, which is saved to their private "Vault".
*   **Admin (Author):** The owner of the site, who has access to a secure, data-rich dashboard to perform full CRUD operations on all content and view performance analytics.

This project was architected by **Nova**, with an unwavering focus on modern development patterns, a clean separation of concerns, and a world-class user experience.

## V2 Key Features

### For Readers & Users
*   **Full User Authentication:** Secure sign-up and login system for all users.
*   **Personalized "My Vault":** A dedicated profile page where users can find all their bookmarked articles and videos.
*   **Content Interaction:** The ability to "Like" and "Bookmark" content, with the user's interaction state reflected across the site.
*   **Fully Responsive Design:** A seamless, adaptive experience on any device, from mobile phones to widescreen desktops.
*   **Immersive UI:** A unique aesthetic featuring a dynamic, animated grid background and a mouse-tracking "aura" effect.
*   **Dynamic Content Hub:** Homepage features a magazine-style "featured + grid" layout and a toggle to instantly switch between articles and videos.
*   **Advanced Sorting:** Both the blogs and videos gallery pages can be sorted by "Latest" or "Most Popular" (by view count).
*   **Easy Sharing:** A one-click "Copy Link" feature on all content pages.

### For the Admin
*   **Data-Rich Dashboard:** A redesigned command center displaying key performance indicators: Total Views, Likes, Bookmarks, and content counts, complete with a visual bar chart of top-performing posts.
*   **Enhanced Content Management:** Management tables now display like and bookmark counts for each post.
*   **Markdown with Inline Images:** The main content editor is powered by Markdown, with an integrated image uploader to easily embed media anywhere within an article.
*   **Local File Uploads:** A seamless thumbnail and inline image upload system integrated with **Cloudinary** for robust media management.
*   **Refined UI/UX:** A professional, horizontal command bar and consistent design language that is functionally and visually separate from the public site.

## Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** CSS Modules (Mobile-First)
*   **UI & Animations:**
    *   `react-icons`
    *   `react-tsparticles` & `tsparticles` (Subtle background animation)
    *   `react-fast-marquee` (Infinite logo carousel)
    *   `recharts` (Dashboard performance chart)
*   **Markdown:** `react-markdown`
*   **Data Fetching:** Axios

### Backend
*   **Framework:** Node.js with Express.js
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Handling:** Multer

### Database & Cloud
*   **Database:** MongoDB Atlas
*   **ORM:** Mongoose
*   **Image Hosting:** Cloudinary

### Deployment
*   **Frontend:** Vercel
*   **Backend:** Render

## Getting Started

### Prerequisites
*   Node.js (v18.x or later)
*   npm
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
    In a new terminal:
    ```sh
    cd frontend
    npm install
    ```
    Create a `.env.local` file in the `frontend` directory and add the environment variable listed below. Then, run the development server:
    ```sh
    npm run dev
    ```

## Environment Variables needed for respective deployments

#### Backend (`backend/.env`)
```env
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

#### Frontend (`frontend/.env.local`)

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
- **Reader Comments:** The reader should be able to comment and interact with the author and community, under any resource
- **Pagination:** For the `/blogs` and `/videos` pages to handle a large amount of content.  

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
