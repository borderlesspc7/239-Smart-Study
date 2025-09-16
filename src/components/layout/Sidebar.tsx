import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface SidebarItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route?: string;
  onPress?: () => void;
  badge?: string | number;
  subItems?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  isVisible: boolean;
  onClose: () => void;
  onItemPress?: (item: SidebarItem) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const SIDEBAR_WIDTH = screenWidth * 0.8;

export function Sidebar({
  items,
  isVisible,
  onClose,
  onItemPress,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [slideAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemPress = (item: SidebarItem) => {
    if (item.subItems) {
      toggleExpanded(item.id);
    } else {
      if (item.onPress) {
        item.onPress();
      } else if (onItemPress) {
        onItemPress(item);
      }
      onClose();
    }
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <View key={item.id}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { paddingLeft: 20 + level * 20 },
            level > 0 && styles.subMenuItem,
          ]}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={level > 0 ? "#6B7280" : "#374151"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  level > 0 && styles.subMenuItemText,
                ]}
              >
                {item.title}
              </Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              {hasSubItems && (
                <MaterialIcons
                  name={
                    isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                  }
                  size={20}
                  color="#9CA3AF"
                />
              )}
            </View>
          </View>
        </TouchableOpacity>

        {hasSubItems && isExpanded && (
          <View style={styles.subItemsContainer}>
            {item.subItems!.map((subItem) => renderItem(subItem, level + 1))}
          </View>
        )}
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.overlayBackground} />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
            width: SIDEBAR_WIDTH,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Smart Study</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {items.map((item) => renderItem(item))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versão 1.0.0</Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  subMenuItem: {
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  subMenuItemText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "400",
  },
  badge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  subItemsContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#E5E7EB",
    marginLeft: 32,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
