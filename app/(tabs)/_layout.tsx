// app/(tabs)/_layout.tsx
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Mycourse from './(myCourseNav)/mycourse';
import Index from './(coursesNav)';
import { useClerk } from '@clerk/clerk-expo';
import {Drawer} from 'expo-router/drawer'


// Định nghĩa kiểu cho các màn hình trong Drawer

export type RootDrawerParamList = {
  Courses: any;
  MyCourses: any;
  Classes: any;
  ScheduleOrSalary: any;
  Salary: any;
};

export const Menu = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();  // Khai báo kiểu navigation cho Drawer
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Image
        source={require('../../assets/images/menu.png')}
        style={{
          width: 30,
          height: 20,
          marginRight: 20,
          marginTop: 30,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};
// Tùy chỉnh nội dung của Drawer
const CustomDrawerContent = (props: any) => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut(); // Đăng xuất
  };

  return (
    <DrawerContentScrollView {...props}>
      <View>
        {/* Nút logout */}
        <TouchableOpacity
          onPress={handleSignOut}
        >
          <Image
            source={require('../../assets/images/logout.png')}
            style={{
              width: 18,
              height: 20,
              resizeMode: 'contain',
              marginTop: 72,
              marginLeft: 10,
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        {/* Logo ở Drawer */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 300,
            height: 28,
            resizeMode: 'contain',
            marginTop: 40,
            marginRight: 20,
            marginBottom: 30,
          }}
        />
      </View>
      {/* Liệt kê các mục trong Drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

// Component Menu để mở Drawer


export default function TabLayout() {
  const [role, setRole] = useState(false) // true là học sinh, false là giáo vi
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: 'right', // Đặt Drawer bên phải
          drawerStyle: {
            width: 300, // Độ rộng của Drawer
          },
          drawerLabelStyle: {
            fontSize: 20, // Kích thước chữ trong Drawer
          },
          drawerActiveBackgroundColor: '', // Màu nền khi mục được chọn (có thể thêm màu nếu cần)
          headerStyle: {
            backgroundColor: '#2A58BA', // Màu nền header
            height: 92, // Chiều cao header
          },
          headerTitleStyle: {
            fontSize: 20, // Kích thước chữ tiêu đề header
            color: 'white', // Màu chữ tiêu đề
            marginTop: 30,
            marginLeft: 15,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />} // Sử dụng nội dung Drawer tùy chỉnh
      >
        {/* Màn hình "Courses" */}
        <Drawer.Screen
          name="(coursesNav)"
          
          options={{
            headerShown: false,
            title: 'Danh sách khóa học', // Tiêu đề màn hình
          
            headerLeft: () => <></>, // Ẩn headerLeft (nút quay lại)
            headerRight: () => <Menu />, // Thêm Menu vào headerRight
          }}
        />

        {/* Màn hình "MyCourses" */}
        <Drawer.Screen
           name="(myCourseNav)"
          options={{
            headerShown: false,
            title: 'Khóa học của bạn',
            headerLeft: () => <></>, // Ẩn headerLeft
            headerRight: () => <Menu />, // Thêm Menu vào headerRight
          }}
        />

        {/* Các màn hình khác với cách tương tự
        <Drawer.Screen
          name="(coursesNav)"
          options={{
            headerShown: true,
            title: 'Danh sách lớp học',
            headerLeft: () => <></>,
            headerRight: () => <Menu />,
          }}
        />
        
        <Drawer.Screen
          name="(coursesNav)"
          
          options={{
            headerShown: true,
            title:'Thời khóa biểu' ,
            drawerLabel: undefined,
            headerLeft: () => <></>,
            headerRight: () => <Menu />,
          }}
        />
        <Drawer.Screen
         name="(coursesNav)"
          
          options={{
            
            headerShown: true,
            title: 'Lương',
            headerLeft: () => <></>,
            headerRight: () => <Menu />,
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
function useSate(): [any, any] {
  throw new Error('Function not implemented.');
}

