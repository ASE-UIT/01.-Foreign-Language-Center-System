import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, SectionList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import hambuger_icon from '../../assets/images/hamburger_icon.png'
import teacher_image from '../../assets/images/teacher_image.jpg'
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../Navigation/AppNavigator';




const ScheduleScreen: React.FC = () => {
  const [today, setToday] = useState(new Date());
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDay, setSelectedDay] = useState(today.getDay()); // Thêm state để theo dõi ngày được chọn

  const [loaded, error] = useFonts({
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'GowunBatang': require('../../assets/fonts/GowunBatang.ttf'),
    'MS-Yahei': require('../../assets/fonts/MS-Yahei.ttf'),
  });

  // Đối tượng mô tả thông tin khóa học
  const course = {
    title: "Tiếng Anh giao tiếp cơ bản",
    startDate: "20/08/2024",
    endDate: "20/12/2024",
    time: "15h - 16h30",
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


  // Hàm render cho từng item trong FlatList
  const renderCourseItem = ({ item }: any) => (
    <View style={scheduleStyles.courseCard}>
      <Text style={scheduleStyles.courseTitle}>{item.title}</Text>
      <View style={scheduleStyles.detailLayout}>
        <Text style={scheduleStyles.courseText}>{item.startDate} - {item.endDate}</Text>
        <View style={scheduleStyles.timeLayout}>
          <Text style={scheduleStyles.courseText}>Thời gian: </Text>
          <Text style={scheduleStyles.timeText}>{item.time}</Text>
        </View>
        <View style={scheduleStyles.classLayout}>
          <Text style={scheduleStyles.courseText}>Phòng học: </Text>
          <Text style={scheduleStyles.classText}>{item.room}</Text>
        </View>
      </View>
      <View style={scheduleStyles.teacherImageLayout}>
        <Image source={item.image} style={scheduleStyles.instructorImage} />
        <Text style={scheduleStyles.teacherImageText}>{item.instructor}</Text>
      </View>
    </View>
  );

  const handleChangeDate = (index: number) => {
    setSelectedDay(index);
    setCourseList(coursesArray2);
  }

  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>()
  return (
    // <ScrollView > sửa lỗi nested virturalize list
    <View style={scheduleStyles.container}>
      <TouchableOpacity onPress={()=>navigation.openDrawer()}>
        <Image source={hambuger_icon} style={{marginTop:20}}/>
        
      </TouchableOpacity>

      <View style={scheduleStyles.header_text_layout}>
        <Text style={scheduleStyles.header_text}>Lịch Học</Text>
      </View>
      <View>
        <Text style={scheduleStyles.month_year_text}>Tháng {today.getMonth() + 1} năm {today.getFullYear()}</Text>
      </View>
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
      <View style={scheduleStyles.noteLayout}>
        <Text style={scheduleStyles.month_year_text}>Ghi chú trong ngày</Text>
      </View>

      <FlatList
        data={courseList}
        renderItem={renderCourseItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Hiển thị 2 cột
      />
      <TouchableOpacity style={scheduleStyles.addButton} onPress={() => {/* Thêm hành động ở đây */ }}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
    // </ScrollView >
  )
}
const { height } = Dimensions.get('window'); // Lấy chiều dài thiết bị
const scheduleStyles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flex: 1,
    height: height
  },
  hamburger_icon: {
    width: 31,
    height: 18,
  },
  header_text_layout: {
    marginVertical: 20
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
  weekLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  noteLayout: {
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 42,
    backgroundColor: 'white', // Thêm màu nền
    borderRadius: 10, // Thêm bo góc nếu cần
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4, // Thêm elevation cho Android
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  selectedDay: {
    backgroundColor: '#153AD1'
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
    flex: 1,
    marginRight: 20,
    marginBottom: 20,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    width: 164,
    height: 136,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
  }, addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#153AD1',
    borderRadius: 30,
    padding: 10,
    elevation: 4,
  },
})

export default ScheduleScreen