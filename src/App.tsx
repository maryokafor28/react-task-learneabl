import { Routes, Route, Navigate } from "react-router-dom";
import UserList from "./component/UserList";
import UserCard from "./component/UserCard";
import UserForm from "./component/UserForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserCard />} />
      <Route path="/add-user" element={<UserForm />} />
      <Route path="/edit-user/:id" element={<UserForm />} />
    </Routes>
  );
}

export default App;
