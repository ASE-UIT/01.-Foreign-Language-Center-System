import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import teacher_image from '../../../assets/images/image-teacher.jpg'
import { router } from 'expo-router';




const Schedule: React.FC = () => {
    const [today, setToday] = useState(new Date());
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selectedDay, setSelectedDay] = useState(today.getDay()); // Thêm state để theo dõi ngày được chọn

    // Đối tượng mô tả thông tin khóa học
    const course = {
        title: "Tiếng Anh giao tiếp cơ bản",
        startDate: "20/08/2024",
        endDate: "20/12/2024",
        time: "15 giờ - 16 giờ 30",
        room: "P.A123",
        instructor: "Mỹ Quế Lan",
        image: teacher_image
    };

    // Mảng chứa các ví dụ khóa học
    const coursesArray = [
        { ...course },
        { ...course },
        { ...course },
        { ...course }
    ];

    const coursesArray2 = [
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
        { ...course },
    ];
    const [courseList, setCourseList] = useState(coursesArray);


    const handleChangeDate = (index: number) => {
        setSelectedDay(index);
        setCourseList(coursesArray2);
    }

    const handleNavToClassDetail = (course: any) => {
        // router.push({
        //     pathname: '/(tabs)/(scheduleNav)/classDetail',
        //     params: {
        //         course: JSON.stringify(course), // Convert course to a string
        //     }
        // });
    }

    // Hàm render cho từng item trong FlatList
    const renderCourseItem = ({ item }: any) => (
        <TouchableOpacity style={scheduleStyles.courseCard}
            onPress={() => handleNavToClassDetail(item)}>
            <View style={scheduleStyles.courseContent}>
                <Image source={item.image} style={scheduleStyles.image} />
                <View>
                    <Text style={scheduleStyles.courseTitle}>{item.title}</Text>
                    <View style={scheduleStyles.timeContainer}>
                        <Text style={scheduleStyles.courseText}>Giảng viên: </Text>
                        <Text style={scheduleStyles.teacherImageText}>{item.instructor}</Text>
                    </View>
                    <View style={scheduleStyles.timeLayout}>
                        <Text style={scheduleStyles.courseText}>Thời gian: </Text>
                        <Text style={scheduleStyles.timeText}>{item.time}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={scheduleStyles.container}>
            <View style={scheduleStyles.margin10}>
                <View style={scheduleStyles.weekLayout}>
                    {daysOfWeek.map((day, index) => {
                        const dayOffset = index - today.getDay(); // Tính toán độ lệch ngày
                        const displayDate = new Date(today);
                        displayDate.setDate(today.getDate() + dayOffset); // Cập nhật ngày hiển thị

                        return (
                            <TouchableOpacity key={index} onPress={() => handleChangeDate(index)} style={[scheduleStyles.dayContainer,
                            selectedDay === index && scheduleStyles.selectedDay]}>
                                <Text style={[scheduleStyles.dayText, selectedDay === index && scheduleStyles.selectedDayText]
                                }>
                                    {day}
                                </Text>
                                <Text style={[scheduleStyles.dayText, selectedDay === index && scheduleStyles.selectDateText]}>
                                    {displayDate.getDate()} {/* Hiển thị ngày tương ứng */}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={scheduleStyles.flatListContainer}>
                <FlatList
                    contentContainerStyle={scheduleStyles.flatListContent}
                    data={courseList}
                    renderItem={renderCourseItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={scheduleStyles.flatList}
                />
            </View>
        </View>
    )
}
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
    selectDateText: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
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
})

export default Schedule