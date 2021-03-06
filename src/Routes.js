import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

{/* Bottom-Tabs */ }
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  Foundation,
  MaterialCommunityIcons
} from "@expo/vector-icons";

{/* TabBar && TopBar */ }
import CustomTabBar from "./Routes/CustomTabBar";
import CustomTopBar from "./Routes/CustomTopBar";

{/* Screens */ }
import Home from "./screens/Home";
import Search from "./screens/Search";
import Premium from "./screens/Premium";
import { StyleSheet, ImageBackground } from "react-native";
import { BG_IMAGE } from "./services/backgroundImage";
import ProfileScreen from "./screens/ProfileScreen";


const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#141412",
    background: "#121212",
    card: "#141412",
    text: "#FFF",
    border: "#000"
  }
};

const Tab = createBottomTabNavigator();

function MyTabs(){
  return (
    
      <Tab.Navigator
        
        tabBar={props => <CustomTabBar {...props} />}
        backBehavior="initialRoute"
        initialRouteName="Home"
        
        tabBarOptions={{
          activeTintColor: "#f3f3f3",
          inactiveTintColor: "#acacac",
          style: {
          backgroundColor: 'black',
          //borderTopWidth: 0,
          position: 'absolute',
          opacity: 0.7,
          
          
          
         
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Foundation name="home" color={color} size={28} />
            )
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color }) => (
              <Ionicons name="ios-search" color={color} size={28} />
            )
          }}
        />
        <Tab.Screen
          name="Libary"
          component={CustomTopBar}
          options={{
            tabBarLabel: "Your Libary",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="view-parallel"
                color={color}
                size={28}
              />
            )
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='face-man' color={color} size={28} />
            )
          }}
        />
      </Tab.Navigator>
     
  );
}

const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center"
  },
 
});

export default MyTabs;
