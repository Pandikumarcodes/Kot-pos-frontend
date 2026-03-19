import { useNavigate } from "react-router-dom";
import { LoginPresenter } from "./LoginPresenter";

export default function LoginContainer() {
  const navigate = useNavigate();

  const handleNavigate = (to: "signin" | "signup") => {
    navigate(`/${to}`);
  };

  return <LoginPresenter onNavigate={handleNavigate} />;
}
