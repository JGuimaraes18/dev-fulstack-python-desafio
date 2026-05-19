import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/authService";

interface Props {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const token = getToken();
  const user = getUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user?.groups?.some((group: string) =>
      allowedRoles.includes(group)
    );

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}