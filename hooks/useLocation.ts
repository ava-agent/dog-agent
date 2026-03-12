import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export function useLocation() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });

        if (user) {
          await supabase
            .from("profiles")
            .update({ latitude, longitude })
            .eq("id", user.id);
        }
      } catch (err) {
        setError("Failed to get location");
      }
    })();
  }, [user]);

  return { coords, error };
}
