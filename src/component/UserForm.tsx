import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserLocal, updateUserLocal } from "../slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import "../App.css";

// Define User type
interface Address {
  street: string;
  city: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
}

interface UserFormProps {
  onCancel?: () => void;
}

const UserForm = ({ onCancel }: UserFormProps) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get existing user from Redux
  const existingUser = useSelector((state: RootState) =>
    state.users.users.find((user) => user.id === Number(id))
  );

  // Local form state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: { street: "", city: "" },
  });

  // Load user data when editing
  useEffect(() => {
    if (existingUser) {
      setUserData({
        name: existingUser.name || "",
        email: existingUser.email || "",
        address:
          typeof existingUser.address === "string"
            ? { street: existingUser.address, city: "" }
            : existingUser.address || { street: "", city: "" },
      });
    }
  }, [existingUser]);

  // Load users from localStorage on first render (to prefill Redux if empty)
  useEffect(() => {
    const savedUsers: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    if (savedUsers.length && !existingUser) {
      const foundUser = savedUsers.find((u) => u.id === Number(id));
      if (foundUser) {
        setUserData({
          name: foundUser.name,
          email: foundUser.email,
          address:
            typeof foundUser.address === "string"
              ? { street: foundUser.address, city: "" }
              : foundUser.address,
        });
      }
    }
  }, [id, existingUser]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "street" || name === "city") {
      setUserData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Save updated users to localStorage
  const saveToLocalStorage = (updatedUser: User) => {
    const existingUsers: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // If user exists, update; else add new
    const newUsers = existingUsers.some((u) => u.id === updatedUser.id)
      ? existingUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      : [...existingUsers, updatedUser];

    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedUserData = {
      ...userData,
      address: {
        street: userData.address.street,
        city: userData.address.city,
      },
    };

    if (existingUser) {
      const updated: User = { id: Number(id), ...formattedUserData };
      dispatch(updateUserLocal(updated));
      saveToLocalStorage(updated);
    } else {
      const newUser: User = { id: Date.now(), ...formattedUserData };
      dispatch(addUserLocal(newUser));
      saveToLocalStorage(newUser);
    }

    navigate("/users");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{existingUser ? "Edit User" : "Add User"}</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>
      <div>
        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={userData.address.street}
          onChange={handleChange}
          placeholder="Street"
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={userData.address.city}
          onChange={handleChange}
          placeholder="City"
        />
      </div>

      <button className="add-btn" type="submit">
        {existingUser ? "Update" : "Add"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default UserForm;
