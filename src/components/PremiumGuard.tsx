import React from "react";
import { User } from "../types";

interface Props {
  user: User | null;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export const PremiumGuard: React.FC<Props> = ({
  user,
  onUpgrade,
  children,
}) => {
  if (!user?.isPremium) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
        <p className="text-slate-500 mb-4">
          Upgrade to unlock this template and export options.
        </p>
        <button
          onClick={onUpgrade}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
