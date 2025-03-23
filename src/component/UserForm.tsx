import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser } from "../slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import "../App.css"

interface UserFormProps {
  onCancel?: () => void;
}

const UserForm = ({ onCancel }: UserFormProps) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const existingUser = useSelector((state: RootState) =>
    state.users.users.find((user) => user.id === Number(id))
  );

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: { street: "", city: "" },
  });

  useEffect(() => {
    if (existingUser) {
      setUserData({
        name: existingUser.name || "",
        email: existingUser.email || "",
        address: typeof existingUser.address === "string"
          ? { street: existingUser.address, city: "" }
          : existingUser.address || { street: "", city: "" },
      });
    }
  }, [existingUser]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedUserData = {
      ...userData,
      address: { 
        street: userData.address.street, 
        city: userData.address.city 
      }, 
    };

    if (existingUser) {
      dispatch(updateUser({ id: Number(id), ...formattedUserData }));
    } else {
      dispatch(addUser({ id: Date.now(), ...formattedUserData }));
    }

    navigate("/users");
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>{existingUser ? "Edit User" : "Add User"}</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
      </div>
      <div>
        <label>Street:</label>
        <input type="text" name="street" value={userData.address.street} onChange={handleChange} placeholder="Street" />
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" value={userData.address.city} onChange={handleChange} placeholder="City" />
      </div>
      <p>Address: {userData.address.street}, {userData.address.city}</p>

      <button className="add-btn" type="submit">{existingUser ? "Update" : "Add"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;
