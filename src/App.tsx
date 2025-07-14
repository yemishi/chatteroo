import "./index.css";
import { useAuth } from "./context/AuthContext";
import { useAuthActions } from "./hooks/useAuthActions";

export default function App() {
  const { user, isLoading, error } = useAuth();
  const { guestRegister, guestLogin, signout } = useAuthActions();
  if (isLoading) return <div>loading....</div>;
  if (!user || error)
    return (
      <div>
        <button onClick={() => guestRegister.mutate()}>Register guest</button>
        <button onClick={() => guestLogin.mutate({ guestId: "952d3b5b-65ae-43da-a8dd-ba324f987b79" })}>
          Login guest
        </button>
      </div>
    );

  return (
    <div>
      <p onClick={() => console.log(user)}>Welcome {user.username}!</p>
      <button
        onClick={() => {
          signout.mutate();
        }}
      >
        signOut
      </button>
    </div>
  );
}
