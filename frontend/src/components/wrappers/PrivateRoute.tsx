import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@components/ui/use-toast";
import useUser from "@hooks/user/useUser";
import LoadingSpinner from "@components/LoadingSpinner";
import { useEffect } from "react";

const PrivateRoute = () => {
    const userQuery = useUser();
    const { toast } = useToast();
    const navigate = useNavigate();

    // useEffect to handle navigation on error
    useEffect(() => {
        if (userQuery.isError) {
            toast({ variant: "destructive", title: "An error occurred." });
            navigate('/login');
        }
    }, [userQuery.isError, navigate, toast]);

    if (userQuery.isLoading) {
        return <LoadingSpinner />;
    }

    const user = userQuery.data;

    if (user) {
        return <Outlet />;
    } else {
        //navigate('/login', { replace: true });
        return <Navigate to="/login" replace={true} />;
    }
}

export default PrivateRoute;
