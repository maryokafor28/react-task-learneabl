import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";

interface Address {
  city: string;
  street: string;
}

interface UserProps {
  user?: {
    id: number;
    name: string;
    email: string;
    address: Address | string;
  };
}

const UserCard = ({ user }: UserProps) => {
  const { id } = useParams();

  // Get user from Redux state
  const selectedUser = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === Number(id))
  );

  // Combine prop or Redux user
  const initialUser = user || selectedUser;

  // Local state to display user
  const [displayUser, setDisplayUser] = useState(initialUser);

  // Load from localStorage if available
  useEffect(() => {
    if (!initialUser && id) {
      const savedUsers: UserProps["user"][] = JSON.parse(
        localStorage.getItem("users") || "[]"
      );
      const foundUser = savedUsers.find((u) => u && u.id === Number(id));
      if (foundUser) setDisplayUser(foundUser);
    }
  }, [id, initialUser]);

  // Save to localStorage whenever displayUser changes
  useEffect(() => {
    if (displayUser) {
      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if user exists in storage
      const updatedUsers = savedUsers.some(
        (u: UserProps["user"]) => u && u.id === displayUser.id
      )
        ? savedUsers.map((u: UserProps["user"]) =>
            u && u.id === displayUser.id ? displayUser : u
          )
        : [...savedUsers, displayUser];

      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  }, [displayUser]);

  // If no user found at all
  if (!displayUser) return <p>User not found.</p>;

  return (
    <div>
      <h3>{displayUser.name}</h3>
      <p>
        Address:{" "}
        {typeof displayUser.address === "string"
          ? displayUser.address
          : `${displayUser.address?.street}, ${displayUser.address?.city}`}
      </p>

      {!user && (
        <button>
          <Link to={`/edit-user/${displayUser.id}`}>Edit</Link>
        </button>
      )}
    </div>
  );
};

export default UserCard;
