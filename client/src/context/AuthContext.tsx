/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext} from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { User } from "../reducers/loggedUserReducer";

type AuthContextType = {
  user: User
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const value: AuthContextType = {
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
