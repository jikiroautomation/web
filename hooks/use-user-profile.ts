import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  
  const userProfile = useQuery(
    api.users.getUserByEmail,
    user?.primaryEmailAddress?.emailAddress 
      ? { email: user.primaryEmailAddress.emailAddress }
      : "skip"
  );

  const isProfileComplete = !!(userProfile && userProfile.name && userProfile.phone);
  const needsProfileSetup = isLoaded && user && !userProfile;
  
  return {
    userProfile,
    isProfileComplete,
    needsProfileSetup,
    isLoading: !isLoaded || (user && userProfile === undefined),
    user
  };
};