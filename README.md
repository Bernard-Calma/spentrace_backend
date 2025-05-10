# Spentrace Backend

## Overview

Spentrace Backend is a JavaScript-based backend application designed to manage and process financial data. It serves as the server-side component for the Spentrace application, handling data storage, business logic, and communication with the frontend.

## Project Structure

The repository contains the following key directories and files:

- `config/`: Configuration files for the application.
- `controllers/`: Logic for handling incoming requests and interacting with models.
- `models/`: Database models representing the application's data structure.
- `routes/`: Definitions of the application's API endpoints.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `package.json`: Contains metadata about the project and its dependencies.
- `package-lock.json`: Locks the versions of the project's dependencies.
- `server.js`: The main entry point for the application.

## Technologies Used

- JavaScript (Node.js)
- Express.js (for building the web server)
- MongoDB (for database management)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   git clone https://github.com/Bernard-Calma/spentrace_backend.git

2. Navigate into the project directory:
   cd spentrace_backend

3. Install the required dependencies:
   npm install

4. Set up your environment variables. Create a `.env` file in the root directory and define:
   MONGO_URI=your_mongodb_connection_string
   PORT=3000

5. Start the application:
   npm start

## Usage

Once the server is running, you can interact with the API through the defined routes.

- GET /api/data: Retrieves data from the database.
- POST /api/data: Adds new data to the database.

Check the `routes/` directory for the full list of endpoints.

## Contributing

1. Fork the repository.
2. Create a new branch: git checkout -b feature-name
3. Make changes and commit: git commit -am "Add new feature"
4. Push the branch: git push origin feature-name
5. Open a Pull Request.
