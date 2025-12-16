import React from "react";
import { User } from "../types";
import { Auth } from "./Auth";

interface Props {
  user: User | null;
  onLogin: (user: User) => void;
  onGuestAccess: () => void;
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({
  user,
  onLogin,
  onGuestAccess,
  children,
}) => {
  if (!user) {
    return (
      <Auth
        onLogin={onLogin}
        onGuestAccess={onGuestAccess}
      />
    );
  }

  return <>{children}</>;
};
