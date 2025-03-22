import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../store/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';

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
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (existingUser) {
      setUserData(existingUser);
    }
  }, [existingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingUser) {
      dispatch(updateUser({ id: Number(id), ...userData }));
    } else {
      dispatch(addUser(userData));
    }
    navigate('/users');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{existingUser ? 'Edit User' : 'Add User'}</h2>
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="address.street"
        value={userData.address}
        onChange={handleChange}
        placeholder="Street"
        required
      />
      <input
        type="text"
        name="address.city"
        value={userData.address}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <button type="submit">{existingUser ? 'Update' : 'Add'}</button>
      
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;
