import "./index.css";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>loading....</div>;
  if (!user) return <div>no user</div>;

  return <p>Welcome {user.username}!</p>;
}
