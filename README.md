USER MANAGEMENT APP
A simple React + Redux Toolkit application to manage users.
Features include adding, editing, deleting, and viewing users with data persistence using both API (for demo data) and localStorage (to save your changes after refresh).

FEATURES
View Users: Fetches initial users from JSONPlaceholder API.

Add Users: Add new users via form. Saved in Redux and localStorage.

Edit Users: Update existing user details. Changes persist after refresh.

Delete Users: Remove users from the list.

Persistent Data: Uses localStorage to keep custom users even after refreshing.

Routing: Navigate between pages (/users, /add-user, /edit-user/:id).

TECH STACK
React – UI library

Redux Toolkit – State management

React Router – Navigation

TypeScript – Type safety

Axios – API calls

LocalStorage – Data persistence

API Used
We fetch demo users from:

https://jsonplaceholder.typicode.com/users


