import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import ProfileScreen from '../Screens/ProfileScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import ClassScreen from '../Screens/ClassScreen';
import CourseScreen from '../Screens/CourseScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';

import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import hambuger_icon from '../../assets/images/hamburger_icon.png'


const Drawer = createDrawerNavigator();

const SlideMenu: React.FC = () => {

    let count = 20;
    let showCount = count < 1 ? '' : `(${count}+)` // sau này truyền biến môi trường đếm số lượng thông báo

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
    return (
        <Drawer.Navigator
            initialRouteName='Schedule'
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    borderBottomRightRadius: 30,
                    borderTopRightRadius: 30
                },
            }} >

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
                    headerLeft: () => (
                        <View>
                            <TouchableOpacity style={{ marginLeft: 20, marginRight: -5 }}>
                                <AntDesign name="left" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                    )
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