# Momentum Task Manager - Project Workflow

This document provides a comprehensive overview of the Momentum task manager application's workflow, architecture, and file structure.

## 1. High-Level Overview

Momentum is a personal task management application built with Next.js and React. It allows users to create, manage, update, and delete tasks. Key features include:

- **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Local Storage Persistence**: Tasks are saved in the browser's local storage, ensuring they persist across sessions.
- **Reminders & Notifications**: Users can set reminders for tasks and receive browser notifications when a task is due.
- **Theming**: A switchable light and dark mode with smooth, animated transitions.
- **Responsive Design**: A responsive interface that works on both desktop and mobile devices, featuring a collapsible sidebar.

## 2. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`, etc.)

## 3. Project Structure & File Details

The project is organized into several key directories within the `src` folder.

### `src/app/`

This directory contains the core routing, layout, and global styles for the application, following the Next.js App Router conventions.

- **`layout.tsx`**: The root layout for the entire application. It sets up the HTML structure, includes the `ThemeProvider` for theming, the `Toaster` for notifications, and imports the PT Sans font.
- **`page.tsx`**: The main entry point and home page of the application. It renders the `TaskManager` component, which is the core of the app. It also wraps the main content in a `SidebarProvider` to enable the collapsible sidebar functionality.
- **`globals.css`**: The global stylesheet. It defines:
  - Tailwind CSS base, components, and utilities.
  - CSS variables for the light and dark themes (colors, radius, etc.).
  - Color theme variants (zinc, green, etc.).
  - The circular reveal animation (`enter-reveal`, `exit-reveal`) for theme transitions.

### `src/components/`

This is the heart of the application, containing all the React components.

#### Core Application Components:

- **`task-manager.tsx`**: The main stateful component that manages the entire application logic. It handles:
  - The `tasks` state.
  - Loading tasks from and saving them to `localStorage`.
  - CRUD operations (adding, updating, toggling, deleting tasks).
  - Search/filter functionality.
  - Notification logic for task reminders.
  - Renders the main layout, including the `Sidebar` and the main content `Card`.
- **`task-list.tsx`**: Renders the lists of pending and completed tasks. It receives task arrays as props and maps over them to render `TaskItem` components. It also includes the "All tasks completed!" view and the accordion for completed tasks.
- **`task-item.tsx`**: Represents a single task in the list. It handles:
  - Displaying task title, description, creation date, and reminder.
  - The checkbox to toggle task completion.
  - An "editing mode" to update task details inline.
  - The "pop-off" animation when a task is completed.
- **`add-task-form.tsx`**: The form in the sidebar for creating new tasks. It uses `react-hook-form` for form state management and validation.
- **`all-tasks-completed.tsx`**: A celebratory component shown when there are no pending tasks, featuring a confetti animation.
- **`theme-provider.tsx`**: A wrapper around `next-themes` that is configured to use the View Transitions API for smooth theme changes. It provides the `useTheme` hook used by the switcher.
- **`theme-switcher.tsx`**: The component in the sidebar that allows users to switch between light/dark mode and select a primary color theme.

#### UI Components (`src/components/ui/`):

This directory contains the reusable, low-level UI components from **ShadCN/UI**. They are the building blocks of the application's interface. Key components used include:
- `Button`, `Card`, `Input`, `Checkbox`, `Textarea`, `Dialog`, `Popover`, `Calendar`, `Accordion`, `Sidebar`, `Toast`, `Toaster`.

### `src/hooks/`

Contains custom React hooks used throughout the application.

- **`use-toast.ts`**: A custom hook for triggering toast notifications. It manages a global state of toasts, allowing them to be dispatched from anywhere in the app.
- **`use-mobile.tsx`**: A hook that detects if the application is being viewed on a mobile-sized screen, used for adapting the UI (like the sidebar).

### `src/lib/`

Utility functions and libraries.

- **`utils.ts`**: Contains the `cn` utility function, which merges Tailwind CSS classes and handles conditional class names gracefully.

### `src/types/`

Home to TypeScript type definitions.

- **`index.ts`**: Defines the `Task` interface, which provides a consistent data structure for task objects used across the application.

## 4. Data Flow & Workflow

1.  **App Load**:
    - `layout.tsx` sets up the basic page structure.
    - `page.tsx` renders `<TaskManager />` inside the `<SidebarProvider>`.
    - In `TaskManager`, a `useEffect` hook runs to load tasks from `localStorage`. If tasks exist, they populate the `tasks` state. `isLoaded` is set to `true`.

2.  **Displaying Tasks**:
    - The `tasks` array in `TaskManager` is filtered by the current `searchTerm`.
    - The filtered array is then sorted by creation date.
    - It's split into `pendingTasks` and `completedTasks` arrays.
    - These arrays are passed as props to `<TaskList />`.
    - `<TaskList />` maps these arrays to render `<TaskItem />` components.

3.  **Adding a Task**:
    - The user fills out the form in `<AddTaskForm />` (in the sidebar).
    - On submit, the `onAddTask` callback (passed from `TaskManager`) is called.
    - `TaskManager` creates a new task object with a unique ID and the current timestamp.
    - The new task is added to the top of the `tasks` state array.
    - A "Task Added" toast notification is displayed.
    - A `useEffect` in `TaskManager` triggers, saving the updated `tasks` array to `localStorage`.

4.  **Completing a Task**:
    - The user clicks the checkbox on a `<TaskItem />`.
    - The `onToggle` callback is triggered.
    - In `TaskItem`, a "pop-off" animation class (`animate-task-pop-off`) is applied.
    - After a short delay, `TaskManager`'s `handleToggleTask` function is called.
    - This function finds the task by its ID and flips its `completed` property.
    - The component re-renders, and the task now appears in the "Completed" list.
    - The updated `tasks` array is saved to `localStorage`.

5.  **Setting a Reminder & Getting Notified**:
    - When adding or editing a task, the user can select a date from a `<Calendar />` in a `<Popover />`.
    - This date is saved as an ISO string in the `task.reminder` property.
    - `TaskManager` contains a `useEffect` hook that sets up an interval.
    - Every minute, this interval checks all pending tasks.
    - If a task's reminder date is in the past and a notification hasn't already been sent for it, the browser's `Notification` API is used to show a message to the user.

6.  **Changing the Theme**:
    - The user interacts with the `<ThemeSwitcher />`.
    - The `useTheme` hook from our custom `theme-provider.tsx` is used to call `setTheme('dark')` or `setTheme('light')`.
    - This `setTheme` function uses the browser's View Transitions API (`document.startViewTransition`).
    - During the transition, `next-themes` adds or removes the `dark` class to the root `<html>` element.
    - The CSS in `globals.css` contains `:root` (light) and `.dark` (dark) style blocks. The browser applies the new styles based on the class change.
    - A CSS animation (`enter-reveal` / `exit-reveal`) is applied to a pseudo-element on the `::view-transition-new/old(root)` to create the circular reveal effect during the theme change.