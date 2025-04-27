# Task Management App

This project is a Task Management application where users can create, edit, and manage tasks with customizable status and descriptions.

## 🛠️ Setup Instructions

### 1. Clone the repository
First, clone the repository to your local machine.

```bash
git clone https://github.com/M2star/todo-assignment.git
cd todo-assignment

npm install
# or
yarn install


npm run dev
# or
yarn dev

Visit http://localhost:3000 in your browser to view the app.

```


Framework and Tools:
Next.js: The project is built using Next.js, providing features like server-side rendering (SSR) and API routes.

TypeScript: The application is built with TypeScript to ensure type safety and better developer experience.

shadcn/ui: A library used for UI components, ensuring an accessible and customizable user interface.


File Structure:
components/: Contains reusable components such as forms, buttons, modals, and task management UI.

features/: Contains Redux slices to manage the state of tasks, user data, and async operations (e.g., adding, editing tasks).

pages/: Contains page-level components that define the layout and routing for various views of the app.

utils/: Contains helper functions like API calls, validations, and other utilities.

service/: contains api functions 

Approach:
The application is designed to be responsive with a focus on user experience.

A dynamic Task Dialog for creating and editing tasks has been implemented, with clear status options.

Type-safe form event handlers using TypeScript ensure maintainability and clarity in managing form inputs.

Modular code makes it easy to scale the app with new features, like adding more fields or states.

