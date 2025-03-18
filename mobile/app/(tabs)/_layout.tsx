import { Image, Platform, Text, View } from "react-native"
import React from "react"
import { Tabs, usePathname } from "expo-router"
import { icons } from "../../constants"

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      className="items-center justify-center gap-2"
      style={{
        shadowColor: focused ? color : "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.6 : 0,
        shadowRadius: focused ? 6 : 0,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused ? "#FFFFFF" : color}
        className="w-6 h-6"
      />
      {/* <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: focused ? "#FFFFFF" : color }}
      >
        {name}
      </Text> */}
    </View>
  )
}

const TabsLayout = () => {
  const pathname = usePathname()
  const navHeight = Platform.OS === "ios" ? 85 : 55

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#A0A0A0",
          tabBarStyle: {
            backgroundColor: "#1C1C1E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopWidth: 1,
            borderTopColor: "#333",
            height: navHeight,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.search}
                color={color}
                name="Search"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search/shop"
          options={{
            title: "Shop",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.store}
                color={color}
                name="Shop"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.cart}
                color={color}
                name="Cart"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            title: "Maps",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.maps}
                color={color}
                name="Maps"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
