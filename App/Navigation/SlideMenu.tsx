import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerNavigationProp } from '@react-navigation/drawer';

import ProfileScreen from '../Screens/ProfileScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import ClassScreen from '../Screens/ClassScreen';
import CourseScreen from '../Screens/CourseScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';

import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';
import CommunicationScreen from '../Screens/CommunicationScreen';
import StudentHomeScreen from '../Screens/StudentHomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';



const Drawer = createDrawerNavigator();

const SlideMenu: React.FC = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>()

    let count = 20;
    let showCount = count < 1 ? '' : `(${count}+)` // sau này truyền biến môi trường đếm số lượng thông báo

    const Back_Btn = () => {
        

        const openMenu = () => {
            navigation.toggleDrawer();
        };
        return (
            <TouchableOpacity style={{ marginLeft: 20, marginRight: -5 }} onPress={openMenu}>
                <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>


        )
    }

    const CustomDrawerContent = (props: any) => {

        return (
            <DrawerContentScrollView {...props}>
                <View style={styles.container}>
                    <Text style={styles.logo}>LOGO</Text>

                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        );
    }

    const handleLogOut = async () => {
        

        try {
          
          await AsyncStorage.removeItem('token'); // Xóa token đăng nhập
          navigation.navigate('Login'); // Điều hướng đến màn hình Login sau khi đăng xuất
        } catch (error) {
          console.error('Error logging out: ', error);
        }
      };

    return (
        <Drawer.Navigator
            initialRouteName='StudentHome'
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    borderBottomRightRadius: 30,
                    borderTopRightRadius: 30
                },
            }} >
            <Drawer.Screen
                name="StudentHome"
                component={StudentHomeScreen}
                options={{
                    title: 'Trang chủ',
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black'
                    },
                    drawerItemStyle: {
                        marginBottom: 0,
                    },
                }} />

            <Drawer.Screen
                name="Communication"
                component={CommunicationScreen}
                options={{
                    title: 'Trò chuyện',
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black'
                    },
                    drawerItemStyle: {
                        marginBottom: 0,
                    },
                }} />

            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Hồ sơ',
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black'
                    },
                    drawerItemStyle: {
                        marginBottom: 0,
                    },
                }} />
            <Drawer.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    headerShown: true,
                    title: `Thông báo ${showCount}`,
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black'
                    },
                    drawerItemStyle: {
                        marginBottom: 0,
                    },
                    headerLeft: () => (<Back_Btn />)
                }} />
            <Drawer.Screen name="Class" component={ClassScreen} options={{
                title: 'Lớp học',
                drawerLabelStyle: {
                    fontSize: 20,
                    color: 'black'
                },
                drawerItemStyle: {
                    marginBottom: 0,
                }
            }} />
            <Drawer.Screen name="Course" component={CourseScreen}
                options={{
                    title: 'Khóa học',
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black'
                    },

                    drawerItemStyle: {
                        marginBottom: 0,
                    },

                }} />
            <Drawer.Screen name="Schedule" component={ScheduleScreen}
                options={{
                    title: 'Lịch học',
                    drawerLabelStyle: {
                        fontSize: 20,
                        color: 'black',
                    },
                    drawerItemStyle: {
                        marginBottom: 0,
                    }
                }} />
                  <Drawer.Screen name="LogOut" component={LoginScreen}
                options={{
                    drawerLabel: () => (
                        <TouchableOpacity onPress={handleLogOut}>
                          <Text style={{ fontSize: 20, color: 'red', fontWeight:'bold' }}>Đăng xuất</Text>
                        </TouchableOpacity>
                      ),
                    drawerItemStyle: {
                        marginBottom: 0,
                    },
                    
                    }} />

        </Drawer.Navigator>
    );
}

export default SlideMenu

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    logo: {
        color: '#153AD1',
        fontFamily: 'Inter-Bold',
        fontStyle: 'italic',
        fontWeight: '700',
        fontSize: 32,
    }
})