// app/(tabs)/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(coursesNav)" // Tên thư mục chứa các màn hình
          options={{ headerShown: false }} // Ẩn header
        />
        <Drawer.Screen
          name="(myCourseNav)" // Tên thư mục chứa các màn hình
          options={{ headerShown: false }} // Ẩn header
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}