import { COLORS } from "@/screens/dashboard/constants/color";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { HistoryItems, HistoryListProps } from "../types/history.types";
import { HistoryEmpty } from "./HistoryEmpty";
import { HistoryItem } from "./HistoryItem";

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  onItemPress,
  onRefresh,
  refreshing = false,
  onLoadMore,
  hasMore = false,
}) => {
  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary.main} />
      </View>
    );
  };

  const renderItem = ({ item }: { item: HistoryItems }) => (
    <HistoryItem item={item} onPress={onItemPress} />
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary.main}
          colors={[COLORS.primary.main]}
        />
      }
      ListEmptyComponent={<HistoryEmpty onRefresh={onRefresh} />}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    padding: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
