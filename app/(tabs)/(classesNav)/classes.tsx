import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import { RootDrawerParamList } from '../_layout';

// Định nghĩa kiểu cho Course
interface Course {
    courseID: string;
    title: string;
    instructor: string;
    progress: string;
    image: string;
}

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]); // Khai báo kiểu cho state courses

    // Đối tượng mẫu
    const sampleCourses: Course[] = [
        {
            courseID: "1",
            title: "Tiếng Anh giao tiếp cơ bản",
            instructor: "Mỹ Quế Lan",
            progress: "7/15 buổi",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
        },
        {
            courseID: "2",
            title: "Tiếng Anh nâng cao",
            instructor: "Nguyễn Văn A",
            progress: "5/10 buổi",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
        },
        {
            courseID: "3",
            title: "Tiếng Anh cho người đi làm",
            instructor: "Trần Thị B",
            progress: "10/20 buổi",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
        },
        {
            courseID: "4",
            title: "Tiếng Anh cho người đi làm",
            instructor: "Trần Thị B",
            progress: "10/20 buổi",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
        },
        {
            courseID: "5",
            title: "Tiếng Anh cho người đi làm",
            instructor: "Trần Thị B",
            progress: "10/20 buổi",
            image: "https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png",
        },
    ];

    const fetchCourses = async () => {
        try {
            // const response = await fetch('https://api.example.com/courses'); // Thay đổi URL cho API thực tế
            // const data: Course[] = await response.json(); // Khai báo kiểu cho dữ liệu trả về
            setCourses(sampleCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();


    const handleNavToClassDetail = (course: Course) => {
        router.push({
            pathname: '/(tabs)/(classesNav)/classDetail', // Đảm bảo đường dẫn này đúng
            params: {
                courseID: JSON.stringify(course.courseID), // Convert course to a string
            },

        });
    };

    // Hàm render cho từng item trong FlatList
    const renderCourseItem = ({ item }: { item: Course }) => (
        <View style={styles.courseCard}>
            <View style={styles.courseContent}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.courseText}>Giảng viên: </Text>
                        <Text style={styles.teacherImageText}>{item.instructor}</Text>
                    </View>
                    <View style={styles.timeLayout}>
                        <Text style={styles.courseText}>Tiến độ: </Text>
                        <Text style={styles.timeText}>{item.progress}</Text>
                    </View>
                    <TouchableOpacity style={styles.detailButton} onPress={() => handleNavToClassDetail(item)}>
                        <Text style={styles.detailButtonText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row', // Horizontal layout
                alignItems: 'center', // Vertical alignment
                justifyContent: 'space-between', // Space out items
                height: 92, // Custom header height
                backgroundColor: '#2A58BA', // Background color

            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 20, // Kích thước chữ tiêu đề header
                        color: 'white', // Màu chữ tiêu đề
                        marginTop: 30,
                        marginLeft: 15,
                        fontWeight: 'bold'
                    }}> Danh sách lớp học </Text>
                </View>

                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={require('../../../assets/images/menu.png')}
                        style={{
                            width: 30,
                            height: 20,
                            marginRight: 20,
                            marginTop: 30,
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.flatListContent}
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.courseID}
                    style={styles.flatList}
                />
            </View>
        </View>
    );
};

const { height } = Dimensions.get('window'); // Lấy chiều dài thiết bị
const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingHorizontal: 10,
        flex: 1,
        height: height,
        backgroundColor: 'white',
    },
    courseCard: {
        width: 350,
        height: 120,
        marginBottom: 20,
        borderRadius: 15,
        borderWidth: 1,
        opacity: 50,
        borderColor: '#BABABA',
    },
    courseContent: {
        margin: 15,
        flex: 1,
        flexDirection: 'row',
    },
    image: {
        width: 86,
        height: 86,
        borderRadius: 10,
        marginRight: 15,
    },
    instructor: {
        fontSize: 14,
        color: 'gray',
    },
    progress: {
        fontSize: 14,
    },
    flatListContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        flexGrow: 1,
    }, courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2A58BA',
        fontFamily: 'Inter-Bold',
        marginVertical: 5,
    },
    detailLayout: {
        marginTop: 5,
    },
    courseText: {
        fontSize: 12,
    },
    timeLayout: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    classLayout: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    classText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    teacherImageText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailButton: {
        marginTop: 5,
        width: 82, // Fixed width
        height: 20, // Fixed height
        borderRadius: 5, // Border radius
        borderWidth: 1, // Border width
        borderColor: '#BABABA', // Border color
        backgroundColor: '#E6E6E6', // Background color
        opacity: 1, // Opacity (set to 1 for visibility)
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10, // Gap (not directly applicable in React Native)
    },
    detailButtonText: {
        color: 'black', // Màu chữ (có thể thay đổi nếu cần)
    },
});

export default CourseList;
