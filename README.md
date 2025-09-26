# Clarity

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ntai0404/generated-app-20250926-142611)

A visually stunning, minimalist To-Do application designed for focus and simplicity.

Clarity provides a clean, single-view interface where users can manage their tasks without distraction. The core philosophy is 'less is more,' achieved through generous white space, a limited and sophisticated color palette, and fluid micro-interactions. The application allows users to add, view, mark as complete, and delete tasks. All interactions are designed to be intuitive and immediate, with smooth animations providing delightful feedback. The backend is powered by Cloudflare Workers and Durable Objects to persist tasks, making it a robust and scalable solution.

## Key Features

-   **Minimalist Interface:** A clean, distraction-free design to help you focus.
-   **Task Management:** Add, complete, and delete tasks with ease.
-   **Smooth Animations:** Delightful micro-interactions and fluid animations provide satisfying user feedback.
-   **Task Filtering:** View all, active, or completed tasks.
-   **Persistent Storage:** Tasks are saved using Cloudflare Workers and Durable Objects.
-   **Responsive Design:** Flawless experience across all device sizes.

## Technology Stack

-   **Frontend:** React, Vite, TypeScript
-   **Backend:** Hono on Cloudflare Workers
-   **State Management:** Zustand
-   **Styling:** Tailwind CSS, shadcn/ui
-   **Animation:** Framer Motion
-   **Icons:** Lucide React
-   **Persistence:** Cloudflare Durable Objects

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation & Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/clarity_todo_app.git
    cd clarity_todo_app
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend development server and the `workerd` backend server.
    ```bash
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

-   **Add a task:** Type your task in the input field at the top and press `Enter` or click the "Add Task" button.
-   **Complete a task:** Click the checkbox next to a task to mark it as complete.
-   **Delete a task:** Hover over a task and click the delete icon that appears on the right.
-   **Filter tasks:** Use the filter buttons in the footer to switch between "All", "Active", and "Completed" views.

## Deployment

Deploying Clarity to Cloudflare is a simple, one-command process.

1.  **Build and Deploy:**
    This command will build the frontend application and deploy it along with the Worker to your Cloudflare account. You will be prompted to log in to your Cloudflare account if you haven't already.
    ```bash
    bun deploy
    ```

2.  **Deploy with one click:**
    Alternatively, you can deploy this project directly to Cloudflare Workers using the button below.

    [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ntai0404/generated-app-20250926-142611)

## Project Structure

-   `src/`: Contains the frontend React application code.
    -   `pages/`: Main application views.
    -   `components/`: Reusable UI components.
    -   `stores/`: Zustand state management stores.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the backend Hono application for Cloudflare Workers.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: TypeScript types shared between the frontend and backend.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.