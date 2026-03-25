import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const PROFILE_ID_KEY = "ana_profile_id";

export function getStoredProfileId(): number | null {
  const val = localStorage.getItem(PROFILE_ID_KEY);
  return val ? Number(val) : null;
}

export function setStoredProfileId(id: number) {
  localStorage.setItem(PROFILE_ID_KEY, String(id));
}

export function useProfile() {
  const profileId = getStoredProfileId();

  const profileQuery = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => api.getProfile(profileId!),
    enabled: profileId !== null,
  });

  const periodsQuery = useQuery({
    queryKey: ["periods", profileId],
    queryFn: () => api.getPeriods(profileId!),
    enabled: profileId !== null,
  });

  const cycleInfoQuery = useQuery({
    queryKey: ["cycleInfo", profileId],
    queryFn: () => api.getNextPeriod(profileId!),
    enabled: profileId !== null && !!profileQuery.data?.last_period_start,
  });

  return {
    profileId,
    profile: profileQuery.data ?? null,
    periods: periodsQuery.data ?? [],
    cycleInfo: cycleInfoQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    refetchAll: () => {
      profileQuery.refetch();
      periodsQuery.refetch();
      cycleInfoQuery.refetch();
    },
  };
}
