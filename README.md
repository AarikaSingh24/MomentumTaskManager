# Momentum Task Manager

Momentum is a modern and feature-rich personal task management application designed to help you organize your daily activities with ease and style. Built with a cutting-edge tech stack, it offers a seamless and responsive user experience.

## ✨ Key Features

- **Full CRUD Functionality**: Create, read, update, and delete tasks effortlessly.
- **Persistent Storage**: Your tasks are automatically saved to your browser's local storage, so they're always there when you come back.
- **Task Reminders**: Set due dates for your tasks and receive timely browser notifications to stay on track.
- **Elegant Theming**: Switch between a beautiful light and dark mode with a smooth, circular reveal animation.
- **Customizable Appearance**: Personalize your workspace by choosing from a variety of color themes.
- **Responsive Design**: Enjoy a seamless experience on any device, thanks to a fully responsive layout and a collapsible sidebar.
- **Inline Editing**: Quickly update task titles and descriptions without leaving the main view.
- **Celebratory Animations**: Get a burst of confetti when you complete all your tasks for a little motivational boost.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation & Running

1.  Clone the repository:
    ```sh
    git clone https://your-repository-url.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd momentum-task-manager
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📂 Project Structure

The application follows the standard Next.js App Router structure.

-   `src/app/`: Contains the main pages, layouts, and global styles.
-   `src/components/`: Home to all React components, including UI elements from ShadCN and the core application logic components (`task-manager.tsx`, `task-list.tsx`, etc.).
-   `src/hooks/`: Custom React hooks for shared logic, like `use-toast.ts`.
-   `src/lib/`: Utility functions.
-   `src/types/`: TypeScript type definitions, like the `Task` interface.
-   `Workflow.md`: A detailed document explaining the project's architecture and data flow.
