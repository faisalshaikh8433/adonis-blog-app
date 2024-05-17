# Blog App

This is a simple blog app where users can create blogs and posts related to the blogs. 
User can create post using integrated rich text editor with custom link scraper.
[Short demo link](https://drive.google.com/file/d/110CC1VeeraOApL42rrpGhCx4dPTWyb-p/view?usp=drive_link): On the first tab blog app is loaded and on the second tab live blog site is loaded.

## Technologies Used

- [AdonisJS](https://adonisjs.com/): A Node.js framework for building web applications.
- [InertiaJS](https://inertiajs.com/): A client-side server-rendered framework for Vue.js, React, and Svelte.
- [Vue.js](https://vuejs.org/): A progressive JavaScript framework for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/): A progressive JavaScript framework for building user interfaces.

## Prerequisites

- Node.js >= 20.6
- MySQL database

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/faisalshaikh8433/adonis-blog-app.git

2. Navigate to the project directory:

   ```bash
   cd adonis-blog-app
   
3. Install dependency:

   ```bash
   npm install

4. Copy the .env.example file and create a .env file:

   ```bash
   cp .env.example .env

5. Run the database migrations to create the required tables:

   ```bash
   node ace migration:run

6. Start the development server:

   ```bash
   npm run dev
