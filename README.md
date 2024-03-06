# Dynamic Table Builder - Craft Your Database Schemas On-the-Fly

## Overview

This web application empowers you to dynamically create relational database tables without writing complex SQL statements. Fueled by React.js, Express.js, PostgreSQL, and Node.js, this user-friendly interface allows you to define table structures through a simple meta-data input system. Effortlessly craft your database schema on-the-fly, streamlining your development workflow and boosting your productivity.

## Frontend

### Installation and Startup Guide

1. Install Dependencies:

- Open your terminal or command prompt.
- Run the following command to navigate to Frontend directory and install all the project's required dependencies listed in package.json:

```
cd Frontend
npm install
```

2. Configure Environment Variables:

- Create a file named .env in your project's root directory.
- Add the following lines to your .env file, replacing the placeholder value:

```
VITE_REACT_API_BACKEND_URL=BACKEND_URL
```

- Replace BACKEND_URL with your backend connection URL.

3. Start the Server:

```
npm run dev
```

### Technologies Used

- React.js: A JavaScript library for building user interfaces.
- React Router DOM: A library for managing navigation within React applications.
- Material UI: A UI component library for React that implements Google's Material Design.

## Backend:

### Overview

This Node.js application is a simple API for managing tables in a PostgreSQL database. It allows users to create, view, modify, and delete tables and their columns.

### Installation and Startup Guide

#### Prerequisites

Node.js and npm (or yarn): Ensure you have Node.js and npm (or yarn) installed on your system. Download them from the official Node.js website: https://nodejs.org/en

1. Install Dependencies:

- Open your terminal or command prompt.
- Run the following command to navigate to Backend directory and install all the project's required dependencies listed in package.json:

```
cd Backend
npm install
```

2. Configure Environment Variables:

- Create a file named .env in your project's root directory.
- Add the following lines to your .env file, replacing the placeholder value:

```
PORT=8080
POSTGRES_URL="REPLACE_WITH_YOUR_SECRET"
```

- Replace REPLACE_WITH_YOUR_SECRET with your actual database connection URL.

3. Start the Server:

```
node index.js
```

### Technologies Used:

- Node.js: JavaScript runtime environment for server-side applications.
- Express.js: Web framework for building APIs in Node.js.
- pg: Node.js library for interacting with PostgreSQL databases.
- express-validator: Library for validating user input in Express applications.

### API Endpoints:

- GET /api/tables: Returns a list of all tables in the database.
- GET /api/tables/:table_name: Gets information about a specific table, including its columns and foreign keys.
- GET /api/tables/:table_name/columns: Gets a list of columns in a specific table.
- POST /api/tables: Creates a new table with the specified name and columns.
- POST /api/tables/:table_name/columns: Adds a new column to a specific table.
- PATCH /api/tables/:table_name/columns/:column_id: request to update the name of a specific column.
- PATCH /api/tables/:table_name: request to update the table name
- DELETE /api/tables/:table_name/columns/:column_name: Deletes a column from a specific table.
- DELETE /api/tables/:table_name: Deletes a specific table.

I hope this documentation is helpful!
