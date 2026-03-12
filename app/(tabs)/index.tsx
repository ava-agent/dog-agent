import { useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ViewToken,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchVideoFeed } from "@/lib/api/videos";
import { VideoCard } from "@/components/feed/VideoCard";
import { useFeedStore } from "@/stores/feedStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 85;
const VIDEO_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

export default function HomeScreen() {
  const { activeVideoIndex, setActiveVideoIndex } = useFeedStore();
  const flatListRef = useRef<FlatList>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["videos", "feed"],
    queryFn: ({ pageParam }) => fetchVideoFeed(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const videos = data?.pages.flatMap((page) => page.data) ?? [];

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveVideoIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 80,
  }).current;

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#FF2D55" />
      </View>
    );
  }

  if (isError || videos.length === 0) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Text className="text-gray-400 text-lg text-center mb-4">
          {isError ? "加载失败，请重试" : "还没有视频，快去上传第一个吧！"}
        </Text>
        <TouchableOpacity
          className="px-6 py-3 rounded-full"
          style={{ backgroundColor: "#FF2D55" }}
          onPress={() => refetch()}
        >
          <Text className="text-white font-bold">刷新</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VideoCard
            video={item}
            isActive={index === activeVideoIndex}
            height={VIDEO_HEIGHT}
          />
        )}
        pagingEnabled
        snapToInterval={VIDEO_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        windowSize={3}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: VIDEO_HEIGHT,
          offset: VIDEO_HEIGHT * index,
          index,
        })}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="h-20 items-center justify-center">
              <ActivityIndicator color="#FF2D55" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
