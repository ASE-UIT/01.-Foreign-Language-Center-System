// types.ts
interface Teacher {
    name: string;
}

interface Class {
    classID: string;
    className: string;
    schedule: string[];
    meeting: string;
    teacher: string[][];
}

interface CourseResponse {
    courses: {
        courseID: string;
        courseName: string;
        startDate: string;
        endDate: string;
        coverIMG: string;
        price: number;
        rating: number;
        isPaid: boolean;
        totalVote: number;
        classes: Class[];
    }[];
}

interface Course {
    courseID: string;
    title: string;
    instructor: string;
    progress: string;
    image: string;
}


export const fetchStudentCourses = async (clerkUserID: string) => {
    const instance = http();

    try {
        const response = await instance.get<CourseResponse>(
            `/student-information?clerkUserID=${clerkUserID}`
        );
        console.log(response);

        return response.data.courses.map(course => ({
            courseID: course.courseID,
            title: course.courseName,
            instructor: course.classes[0]?.teacher[0]?.join(", ") || "No instructor",
            progress: "0/0 buổi",
            image: course.coverIMG
        }));

    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

// CourseList.tsx
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { RootDrawerParamList } from '../_layout';
import { useUser } from '@clerk/clerk-expo';
import { http } from '@/http/http';

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const { user } = useUser();
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    useEffect(() => {
        const loadCourses = async () => {
            if (user?.id) {
                try {
                    const courses = await fetchStudentCourses(user.id);
                    setCourses(courses);
                } catch (error) {
                    console.error("Error loading courses:", error);
                }
            }
        };

        loadCourses();
    }, [user]);

    const handleNavToClassDetail = (course: Course) => {
        router.push({
            pathname: '/(tabs)/(classesNav)/classDetail',
            params: {
                courseID: JSON.stringify(course.courseID),
            },
        });
    };

    const renderCourseItem = ({ item }: { item: Course }) => (
        <View style={styles.courseCard}>
            <View style={styles.courseContent}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.courseText}>Giảng viên: </Text>
                        <Text style={styles.teacherImageText} numberOfLines={2}>
                            {item.instructor.length > 20 ? `${item.instructor.slice(0, 20)}...` : item.instructor}
                        </Text>
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 92,
                backgroundColor: '#2A58BA',
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
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

const { height } = Dimensions.get('window');
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
    flatListContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        flexGrow: 1,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2A58BA',
        fontFamily: 'Inter-Bold',
        marginVertical: 5,
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
        width: 82,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#BABABA',
        backgroundColor: '#E6E6E6',
        opacity: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    detailButtonText: {
        color: 'black',
    },
});

export default CourseList;