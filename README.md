

![Ops4Team Logo](./public/logo/Ops4TeamLogo.png)

Ops4Team is an advanced task and performance management tool designed to track and evaluate team members' daily activities across multiple platforms, including Jira, Trello, and GitHub. It provides insights into individual contributions by monitoring completed tasks and GitHub activity, offering a calculated performance analysis for both the previous and current months. This enables teams to measure productivity, identify areas for improvement, and ensure optimal performance across all members.

## Features

- **Multi-Platform Task Tracking:** Automatically retrieves task data from Jira, Trello, and other supported platforms.
- **GitHub Contribution Monitoring:** Tracks code contributions, commits, and repository activities.
- **Performance Evaluation:** Provides last month's and current month's calculated performance metrics.
- **Productivity Insights:** Identifies members who may need performance improvements.
- **Data-Driven Decision Making:** Offers a clear overview of team efficiency and individual productivity trends.

## Branching Strategy

- **Test Branch:** Used for internal testing.
- **Beta Branch:** Used for client testing.
- **Development Branch:** Uses the naming convention `ops4team-client-vX.00.00X`, where X changes based on iteration.

## Configuration

- The backend URL is stored inside globalConstants.
- Important keys and tokens are stored in the .env file.
- After modifying the .env file, export values from config.ts for proper integration.
- An `.env.example` file is provided to illustrate the `.env` file structure.

## Technologies Used

- **Framework:** Next.js
- **Forms & Validation:** React Hook Form, Zod
- **UI Components:** Shadcn
- **Networking:** Axios
- **State Management:** TanStack Query
- **Icons:** Lucide Icons
- **Authentication:** Auth.js
- **Testing:** Jest, Playwright
- **Code Quality Monitoring:** Codecy

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

The recommended deployment platform is **Vercel**. Refer to the [Next.js Deployment Guide](https://nextjs.org/docs/deployment) for more details.

### Deploying with Vercel CLI

1. Install Vercel CLI if you haven’t already:
   
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   
   ```bash
   vercel login
   ```

   Follow the prompts to authenticate with your Vercel account.

3. Navigate to your project directory and deploy:
   
   ```bash
   vercel
   ```

   This will initialize the deployment process and prompt you with options.

4. For deploying updates, use:
   
   ```bash
   vercel --prod
   ```

### Deploying to Development and Preview Environments

- **Development Environment:**
  
  ```bash
  vercel --env development
  ```
  
  This helps in testing changes before pushing them to production.

- **Preview Deployment:**
  
  ```bash
  vercel --pre
  ```
  
  This will deploy the branch as a preview, which can be shared and tested before going live.

### Assigning a Custom Domain

- **Add your domain to Vercel:**
  
  ```bash
  vercel domains add yourdomain.com
  ```

- **Update your DNS settings** by following the instructions provided by Vercel.

- **Set the domain for production:**
  
  ```bash
  vercel alias yourdeploymenturl yourdomain.com
  ```

- **Verify the domain:**
  
  ```bash
  vercel domains inspect yourdomain.com
  ```

### Logging Out

To log out of the Vercel CLI:

```bash
vercel logout
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Auth.js Documentation](https://authjs.com/docs) - Authentication setup.
- [TanStack Query](https://tanstack.com/docs) - Data fetching and state management.
- [Vercel Documentation](https://vercel.com/docs) - Deployment and configuration guidance.

Depshield aims to provide seamless security and dependency management for modern development workflows.