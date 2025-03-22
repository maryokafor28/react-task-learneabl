import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../slices/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';


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
      dispatch(addUser({id: Date.now(),...userData}));
    }
    navigate('/users');
  };

  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <h2>{existingUser ? 'Edit User' : 'Add User'}</h2>
    <div><label> Name:</label>  <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        placeholder="Name"
    
      />
      </div>
      <div><label> Email:</label>  <input

        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
        
      />
      </div>
         <div><label> Address:</label>  <input

        type="address"
        name="address"
        value={userData.address}
        onChange={handleChange}
        placeholder="address"
        
      />
     </div>
      <button className='add-btn' type="submit">{existingUser ? 'Update' : 'Add'}</button>
      
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;
