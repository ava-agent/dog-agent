import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/auth";
import { getUserPets } from "@/lib/api/pets";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, session, profile, pets, setProfile, setPets } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  const { data: petsData } = useQuery({
    queryKey: ["pets", user?.id],
    queryFn: () => getUserPets(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profileData) setProfile(profileData);
  }, [profileData]);

  useEffect(() => {
    if (petsData) setPets(petsData);
  }, [petsData]);

  return {
    user,
    session,
    profile: profileData ?? profile,
    pets: petsData ?? pets,
    isAuthenticated: !!session,
  };
}
