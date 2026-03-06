import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout, loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import { authService } from "../screens/users/services/authService";
import { handleApiError } from "../utils/errorHandler";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, currentUser, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      const response = await authService.login({
        username: email.trim(),
        password: password.trim(),
      });

      const { accessToken, user } = response;

      if (!accessToken) {
        throw new Error("Token manquant");
      }

      dispatch(loginSuccess({ token: accessToken, user }));
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated: !!token,
    user: currentUser,
    isLoading,
    error,
    login,
    logout: handleLogout,
  };
};