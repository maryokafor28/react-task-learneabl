import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface UserProps {
  user?: {
    id: number;
    name: string;
    email: string;
    address: string
}
}

const UserCard = ({ user }: UserProps) => {
  const { id } = useParams();
  const selectedUser = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === Number(id))
  );

  const displayUser = user || selectedUser;

  if (!displayUser) return <p>User not found.</p>;

  return (
    <div>
      <h3>{displayUser.name}</h3>
      <p>Email: {displayUser.email}</p>
      <p>Address: {displayUser.address },</p>

      {!user && (
        <button>
          <Link to={`/edit-user/${displayUser.id}`}>Edit</Link>
        </button>
      )}
    </div>
  );
};

export default UserCard;
