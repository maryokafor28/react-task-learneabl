import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import "../App.css"


const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="user-container">
      <h1>User List</h1>
      <button className="add-user-btn" onClick={() => navigate("/add-user")}>
        Add User
      </button>

      {loading && <p>Loading users...</p>}
      {error && <p>Error: {error}</p>}

      <ul className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <li className="user-card" key={user.id}>
              <p className="username">{user.name}</p>
              <div className="user-actions">
                <button className="edit-btn" onClick={() => navigate(`/edit-user/${user.id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default UserList;