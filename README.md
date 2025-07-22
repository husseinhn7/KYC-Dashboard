# Fullstack Project: Backend & Frontend

This repository contains two projects:

- **backend**: Node.js/TypeScript API server
- **frontend**: Vite/React web application

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

## Getting Started

### 1. Clone the repository

```sh
git clone <repo-url>
cd project
```

### 2. Build and run with Docker Compose

```sh
docker-compose up --build
```

- The backend will be available at http://localhost:5000
- The frontend will be available at http://localhost:5173
- MongoDB will run on port 27017

### 3. Stopping the services

Press `Ctrl+C` in the terminal, then run:

```sh
docker-compose down
```

## Project Structure

```
backend/    # Node.js API server
frontend/   # React frontend app
```

## Development

- For local development, you can run each project separately using `npm install` and `npm run dev` or `npm start` in their respective folders.

---

For any issues, please open an issue or contact the maintainer.
