# 📚 My List Feature Backend Service

This project implements the backend API services for the "My List" feature, allowing users to manage a personalized list of their favorite movies and TV shows.

## ✨ Project Overview

This service is built using **Node.js, Express, and Mongoose (MongoDB)** with **TypeScript** for strong type safety and scalability. The design prioritizes **performance** and **data integrity** through optimized database querying and indexing.

The core functional requirements addressed are:

* **Add to My List:** Add a validated `Movie` or `TVShow` by `contentId` to the user's list, ensuring no duplicates and validating content existence.
* **Remove from My List:** Remove a specific item from the list.
* **List My Items:** Retrieve a paginated list of items, including the full content details (movie/TV show information).

***

## Project Structure and Simplicity

The project was intentionally kept simple and monolithic for rapid development and clear organization within the scope of this assignment. All routes are defined directly in the main server.ts file, serving the single /api/v1/my-list route. Furthermore, the validation schemas (Joi) and the core business logic (database lookup, saving, error handling) are encapsulated entirely within the respective controller files. This pattern reduces file jumps and keeps all necessary logic for a single endpoint cohesive.


## 🚀 Setup and Running the Application

### Prerequisites

You need the following installed locally:

* **Node.js** (LTS version recommended)
* **MongoDB Instance** (Local or Cloud-hosted like MongoDB Atlas)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <YOUR_REPOSITORY_URL>
cd my-list-backend
npm install