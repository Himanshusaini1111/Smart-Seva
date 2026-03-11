import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'helper') {
        return <Navigate to="/login" replace />;
    }

    return children;
};