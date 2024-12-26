import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import teacher_image from '../../../assets/images/image-teacher.jpg';
import { router, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';
import { http } from '@/http/http';
import { useUser } from '@clerk/clerk-expo';
import moment from 'moment';


// Define interfaces
interface Class {
    classID: string;
    className: string;
    schedule: string[];
    meeting: string;
    teacher: string[][];
}

export interface Course {
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
}

interface CourseResponse {
    courses: Course[];
}

const Schedule = () => {
    const [today, setToday] = useState(new Date());
    const [schedule, setSchedule] = useState<CourseResponse | null>(null);
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [selectedDay, setSelectedDay] = useState(today.toLocaleDateString('en-US', { weekday: 'short' }));
    const { user } = useUser();

    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    const fetchSchedule = async () => {
        if (user?.id) {
            try {
                const response = await http().get<CourseResponse>(
                    `/student-information?clerkUserID=${user.id}`
                );
                const data: CourseResponse = response.data;
                return data;
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        }
    };

    const processSchedule = (data: CourseResponse) => {
        const schedule: any[] = [];
        data.courses.forEach((course) => {
            course.classes.forEach((classInfo) => {
                schedule.push({
                    courseID: course.courseID,
                    courseName: course.courseName,
                    className: classInfo.className,
                    schedule: classInfo.schedule,
                    meeting: classInfo.meeting,
                    teacher: classInfo.teacher[0][0],
                });
            });
        });
        return schedule;
    };

    useEffect(() => {
        const fetchAndProcessSchedule = async () => {
            const data = await fetchSchedule();
            if (data) {
                const processedSchedule = processSchedule(data);
                setSchedule(data);
            }
        };
        fetchAndProcessSchedule();
    }, []);

    const renderScheduleItem = ({ item }: any) => (
        <View style={scheduleStyles.courseCard}>
            <View style={scheduleStyles.courseContent}>
                <View style={{ marginLeft: 5 }}>
                    <Text style={scheduleStyles.courseTitle}>{item.courseName}</Text>
                    <Text style={scheduleStyles.courseText}>Lớp: <Text style={{ fontWeight: 'bold' }}>{item.className}</Text></Text>
                    {item.scheduleInfo.map((scheduleInfo: any, index: number) => (
                        <Text key={index} style={scheduleStyles.courseText}>
                            Thời gian: <Text style={{ fontWeight: 'bold' }}>{scheduleInfo.startTime}</Text> - <Text style={{ fontWeight: 'bold' }}>{scheduleInfo.endTime}</Text>
                        </Text>
                    ))}
                    <Text style={scheduleStyles.courseText}>Link meeting: <Text style={{ fontWeight: 'bold' }}>{item.meeting}</Text></Text>
                    <Text style={scheduleStyles.courseText}>Giảng viên: <Text style={{ fontWeight: 'bold' }}>{item.teacher}</Text></Text>
                </View>
            </View>
        </View>
    );


    const handleChangeDate = (day: string) => {
        setSelectedDay(day);
    };



    const getDayNumber = (day: string) => {
        const today = moment();
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const index = daysOfWeek.indexOf(day);
        const firstDayOfWeek = today.startOf('week');
        let diff = index - today.day();
        if (diff < 0) {
            diff += 7;
        }
        const date = moment(firstDayOfWeek).add(diff, 'days');
        if (date.isAfter(today.endOf('week'))) {
            date.subtract(7, 'days');
        }
        return date.date();
    };



    const filteredSchedule = schedule && schedule.courses.flatMap((course) =>
        course.classes.filter((classInfo) => {
            const scheduleDays = classInfo.schedule.map((scheduleText) => scheduleText.split(' ')[0]);
            return scheduleDays.includes(selectedDay);
        }).map((classInfo) => {
            const scheduleTexts = classInfo.schedule.filter((scheduleText) => scheduleText.split(' ')[0] === selectedDay);
            const scheduleInfo = scheduleTexts.map((scheduleText) => {
                const parts = scheduleText.split(' ');
                const day = parts[0];
                const startTime = parts[1];
                const endTime = parts[2];

                return {
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                };
            });

            return {
                courseID: course.courseID,
                courseName: course.courseName,
                className: classInfo.className,
                scheduleInfo: scheduleInfo,
                meeting: classInfo.meeting,
                teacher: classInfo.teacher[0][0],
            };
        })
    );

    return (
        <View style={{ flex: 1 }}>
            <View>
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
                        }}> Thời khóa biểu </Text>
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
            </View>
            <View style={scheduleStyles.container}>
                <View style={scheduleStyles.margin10}>
                    <View style={scheduleStyles.weekLayout}>
                        {daysOfWeek.map((day) => (
                            <TouchableOpacity key={day} onPress={() => handleChangeDate(day)} style={[scheduleStyles.dayContainer,
                            selectedDay === day && scheduleStyles.selectedDay]}>
                                <View>
                                    <Text style={[scheduleStyles.dayText, selectedDay === day && scheduleStyles.selectedDayText]}>{getDayNumber(day)}</Text>
                                    <Text style={[scheduleStyles.dayText, selectedDay === day && scheduleStyles.selectedDayText]}>{day}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={scheduleStyles.flatListContainer}>
                    {filteredSchedule && (
                        <FlatList
                            contentContainerStyle={scheduleStyles.flatListContent}
                            data={filteredSchedule}
                            renderItem={renderScheduleItem}
                            keyExtractor={(item, index) => index.toString()}
                            style={scheduleStyles.flatList}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const { height } = Dimensions.get('window'); // Lấy chiều dài thiết bị
const scheduleStyles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 10,
        flex: 1,
        height: height,
        backgroundColor: 'white'
    },
    hamburger_icon: {
        width: 31,
        height: 18,
    },
    header_text_layout: {
        marginVertical: 10
    },
    header_text: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        fontWeight: '700',
        textAlign: 'center',
    },
    month_year_text: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        fontWeight: '700',
        textAlign: 'left'
    },
    margin10: {
        marginHorizontal: 10,
    },
    weekLayout: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    noteLayout: {
        marginBottom: 20,
    },
    dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: 'black',
        borderWidth: 1,
        borderColor: 'black'
    },
    dayText: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
    },
    selectedDay: {
        backgroundColor: '#2A58BA',
        borderWidth: 0
    },
    selectedDayText: {
        fontWeight: '700',
        color: 'white'
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
        margin: 10,
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        width: 86,
        height: 86,
        borderRadius: 10,
        marginRight: 15,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    courseTitle: {
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
    instructorImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5
    },
    teacherImageLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    teacherImageText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#153AD1',
        borderRadius: 30,
        padding: 10,
        elevation: 4,
    },
    flatListContainer: {
        flex: 1,
    },
    flatListContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        flexGrow: 1,
    },
});

export default Schedule;
