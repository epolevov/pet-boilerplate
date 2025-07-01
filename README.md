# PET-Boilerplate

A starter repository for quickly scaffolding your pet projects.

## Table of Contents

- [Project Structure](#project-structure)
- [Releasing New Versions](#releasing-new-versions)
- [Commit Naming (Semantic Commits)](#commit-naming-semantic-commits)
- [How to Start the Project](#how-to-start-the-project)
- [Application Details](#application-details)

## Project Structure

The repository is organized into the following applications and end-to-end test suites:

```
apps/
├── backend
├── backend-e2e
├── app-frontend
└── app-frontend-e2e
```

- **apps/backend**: Core backend service.
- **apps/backend-e2e**: End-to-end tests for the backend.
- **apps/app-frontend**: Frontend application.
- **apps/app-frontend-e2e**: End-to-end tests for the frontend.

## Releasing New Versions

To release a new version of all packages or a specific application:

1. **Update Versions**: Create commits, tags, and update the changelog.

   ```sh
   nx release --skip-publish
   ```

   or for a specific project:

   ```sh
   NX_DAEMON=false nx release patch -p apps/APP_NAME --skip-publish
   ```

   or using `npx`:

   ```sh
   npx nx release --skip-publish -p APP_NAME -d
   ```

2. **Push Changes**: Push commits and tags to the remote repository.

   ```sh
   git push && git push --tags
   ```

3. **CI/CD Pipeline**: The CI/CD workflow will automatically publish packages and images to the registry.

## Commit Naming (Semantic Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to name our commits. Format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Common Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Example

```
feat(backend): add user authentication service
fix(app-frontend): correct button alignment on dashboard
```

## How to Start the Project

1. **Start with Docker Compose** (starts dependencies: PostgreSQL, Redis, etc.)

   ```sh
   docker compose up -d
   ```

2. **Run Backend**

   ```sh
   nx run backend:serve
   ```

3. **Run Frontend**

   ```sh
   nx run app-frontend:dev
   ```

## Application Details

### apps/app-frontend

- **Stack**: Vite, TypeScript, PostCSS
- **Description**: Single-page application built with Vite and TS, styled using PostCSS.

### apps/backend

- **Stack**: Moleculer microservices framework, PostgreSQL, Redis, MikroORM
- **Description**: Backend APIs and business logic, using Moleculer for service orchestration, PostgreSQL as the primary database, Redis for caching, and MikroORM as the ORM layer.

### apps/backend-e2e

- End-to-end tests for backend services.

### apps/app-frontend-e2e

- End-to-end tests for the frontend application.