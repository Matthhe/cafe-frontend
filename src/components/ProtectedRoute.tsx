import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && role && !allowedRoles.includes(role)) return <div>Доступ запрещён</div>;

  return <>{children}</>;
};

export default ProtectedRoute;