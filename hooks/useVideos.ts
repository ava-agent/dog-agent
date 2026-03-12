import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVideoFeed, toggleLike } from "@/lib/api/videos";
import { useAuthStore } from "@/stores/authStore";

export function useVideoFeed() {
  return useInfiniteQuery({
    queryKey: ["videos", "feed"],
    queryFn: ({ pageParam }) => fetchVideoFeed(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ videoId, isLiked }: { videoId: string; isLiked: boolean }) =>
      toggleLike(videoId, user!.id, isLiked),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
