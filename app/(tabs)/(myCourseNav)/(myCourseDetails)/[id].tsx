import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import { useGlobalSearchParams, useLocalSearchParams } from "expo-router/build/hooks";
import teacher from '../../../../assets/images/teacher.png'
import { router, useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../_layout";
import { FontAwesome6 } from "@expo/vector-icons";



export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const [isTeacher, setTeacher] = useState(true)

  const [sections, setSections] = useState({
    overview: false,
    objectives: false,
    schedule: false,
    additional: false,
  });

  const courses = [{
    id: "1",
    title: "Từ vựng IELTS cho band 7.5+",
    instructor: "Mỹ Quế Lan",
    imageUrl: teacher, // Replace with actual image URL
    studentCount: "25/30 học sinh",
    overview: `- Khóa học gồm 51 bài học với thời lượng tương đương 32 giờ học xoay quanh chủ đề từ vựng cho các bạn thi IELTS với band mong muốn là 7.5+.
- 18 chủ đề từ vựng bao gồm: School, Traveling, Economic, và các chủ đề khác ...`,
    objectives: `- Các bạn học sinh tham gia khóa học nắm được các từ vựng cần thiết để thi IELTS và đạt được mục tiêu.
- Có kiến thức rõ ràng về việc sử dụng từ vựng theo ngữ cảnh phù hợp.`,
    schedule: [
      {
        name: "Lớp học từ vựng về chủ đề school và business",
        details: [
          "Thời khóa biểu: 7h30 tối thứ 2, thứ 4, thứ 6",
          "Thời gian bắt đầu: 15 - 12 - 2024",
          "Thời gian kết thúc: 22 - 01 - 2025",
          "Giảng viên: anh Khánh và chị Hạo",
        ],
      },
      {
        name: "Lớp học từ vựng về chủ đề traveling và daily",
        details: [
          "Thời khóa biểu: 7h30 tối thứ 3, thứ 4, thứ 4",
          "Thời gian bắt đầu: 15 - 02 - 2025",
          "Thời gian kết thúc: 22 - 03 - 2025",
          "Giảng viên: anh Khánh và chị Hạo",
        ],
      },
    ],
    additionalInfo:
      "Khóa học được đánh giá 4.3/5 với số lượng phiếu đánh giá là 50 phiếu",
  },
  {
    id: "2",
    title: "Từ vựng IELTS cho band 7.5+",
    instructor: "Mỹ Quế Lan",
    imageUrl: teacher, // Replace with actual image URL
    studentCount: "25/30 học sinh",
    overview: `- Khóa học gồm 51 bài học với thời lượng tương đương 32 giờ học xoay quanh chủ đề từ vựng cho các bạn thi IELTS với band mong muốn là 7.5+.
- 18 chủ đề từ vựng bao gồm: School, Traveling, Economic, và các chủ đề khác ...`,
    objectives: `- Các bạn học sinh tham gia khóa học nắm được các từ vựng cần thiết để thi IELTS và đạt được mục tiêu.
- Có kiến thức rõ ràng về việc sử dụng từ vựng theo ngữ cảnh phù hợp.`,
    schedule: [
      {
        name: "Lớp học từ vựng về chủ đề school và business",
        details: [
          "Thời khóa biểu: 7h30 tối thứ 2, thứ 4, thứ 6",
          "Thời gian bắt đầu: 15 - 12 - 2024",
          "Thời gian kết thúc: 22 - 01 - 2025",
          "Giảng viên: anh Khánh và chị Hạo",
        ],
      },
      {
        name: "Lớp học từ vựng về chủ đề traveling và daily",
        details: [
          "Thời khóa biểu: 7h30 tối thứ 3, thứ 4, thứ 4",
          "Thời gian bắt đầu: 15 - 02 - 2025",
          "Thời gian kết thúc: 22 - 03 - 2025",
          "Giảng viên: anh Khánh và chị Hạo",
        ],
      },
    ],
    additionalInfo:
      "Khóa học được đánh giá 4.3/5 với số lượng phiếu đánh giá là 50 phiếu",
  },
  ];

let index = 0
   const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
    switch (section) {
      case 'overview': index = 0
        
        break;
        case 'objectives': index = 1
        
        break;
        case 'schedule': index = 2
        
        break;
    
      default: index = 3
        break;
    }
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index)); // Đóng
  } else {
      setExpandedSections([...expandedSections, index]); // Mở
  }
  };


  const course = courses.find((c) => c.id === id);
  if (!course) {
    return <Text> Khóa học không tìm thấy </Text>;
  }
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [expandedSections, setExpandedSections] = useState<number[]>([]); // Quản lý trạng thái mở/đóng
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
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('../../../../assets/images/back.png')}
              style={{
                width: 25,
                height: 25,
                marginTop: 30,
                marginLeft: 10,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Text style={{
            fontSize: 20, // Kích thước chữ tiêu đề header
            color: 'white', // Màu chữ tiêu đề
            marginTop: 30,
            marginLeft: 15,
            fontWeight: 'bold'
          }}> Chi tiết khóa học </Text>
        </View>


        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../../../../assets/images/menu.png')}
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

      <ScrollView style={styles.container}>
        <View style={{ flex: 1, paddingHorizontal: 20}}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>{course.title}</Text>
            <Text style={styles.teacher}>Giảng viên: {course.instructor}</Text>
           
          </View>
          <View style={{ flex: 1, marginRight:20, marginTop:20 }}>
            <Image source={teacher} style={styles.image} />
          </View>
          
        </View>
        <View style={{ flexDirection: 'row', marginBottom:20 }}>
              {isTeacher ? (
                <TouchableOpacity style={[styles.registerButton, { width: 100, alignItems: 'center', justifyContent: 'center', marginRight: 15 }]} onPress={() => router.push('/(scores)/[id]')}>
                  <Text style={styles.registerText}>Bảng điểm</Text>
                </TouchableOpacity>
                ) : (
                 
                  <Text style={[styles.registerText, {color:'black'}]}>Đã đăng ký</Text>
               
                )}

                
                <Text style={styles.studentCount}>Sĩ số: {course.studentCount}</Text>
              </View>
        </View>
       
        


        <View>
          {/* Section 1: Overview */}


          <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5,
            paddingHorizontal: 20,
          }} onPress={() => toggleSection("overview")}>

            <Text style={[styles.sectionTitle, { marginRight: 100 }]}>1. Tổng quan khóa học</Text>
            <FontAwesome6 style={{ marginRight: 30 }}
              name={expandedSections.includes(0) ? "chevron-up" : "chevron-down"}
              size={25}
              color="black" />


          </TouchableOpacity>
          {sections.overview && (
            <Text style={styles.sectionContent}>{course.overview}</Text>
          )}



          {/* Section 2: Objectives */}
          <TouchableOpacity onPress={() => toggleSection("objectives")} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5,
            paddingHorizontal: 20,
          }}>
            <Text style={styles.sectionTitle}>2. Mục tiêu khóa học:</Text>
            <FontAwesome6 style={{ marginRight: 30 }}
              name={expandedSections.includes(1) ? "chevron-up" : "chevron-down"}
              size={25}
              color="black" />
          </TouchableOpacity>
          {sections.objectives && (
            <Text style={styles.sectionContent}>{course.objectives}</Text>
          )}

          {/* Section 3: Schedule */}
          <TouchableOpacity onPress={() => toggleSection("schedule")} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5,
            paddingHorizontal: 20,
          }}>
            <Text style={styles.sectionTitle}>3. Các lớp học và lịch học:</Text>
            <FontAwesome6 style={{ marginRight: 30 }}
              name={expandedSections.includes(2) ? "chevron-up" : "chevron-down"}
              size={25}
              color="black" />
          </TouchableOpacity>
          {sections.schedule &&
            course.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>- {item.name}:</Text>
                {item.details.map((detail, idx) => (
                  <Text key={idx} style={styles.scheduleDetail}>
                    • {detail}
                  </Text>
                ))}
              </View>
            ))}

          {/* Section 4: Additional Info */}
          <TouchableOpacity onPress={() => toggleSection("additional")} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 5,
            paddingHorizontal: 20,
          }}>
            <Text style={styles.sectionTitle}>4. Thông tin thêm:</Text>
            <FontAwesome6 style={{ marginRight: 30 }}
              name={expandedSections.includes(3) ? "chevron-up" : "chevron-down"}
              size={25}
              color="black" />
          </TouchableOpacity>
          {sections.additional && (
            <Text style={styles.sectionContent}>{course.additionalInfo}</Text>
          )}
        </View>
      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
   

  },
  header: {
    marginBottom: 20,
    minWidth: 200,
    
    flex: 1
},
  topContainer: {
    flexDirection: "row",
    marginBottom: 16,

  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,

    
    
   
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  subtitle: {
    fontSize: 18,
    color: '#2A58BA',
    fontFamily: 'Inter-Bold',
    marginVertical: 5,

},
  instructor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  teacher: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter-Bold',
},
  studentCount: {
    fontSize: 15,
    color: "#666",
    marginVertical: 8,
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: "#3a6cb1",
    marginTop: 5,
        width: 100, // Fixed width
        height: 30, // Fixed height
        borderRadius: 5, // Border radius
        borderWidth: 1, // Border width
        borderColor: '#BABABA', // Border color
       
        opacity: 1, // Opacity (set to 1 for visibility)
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10, // Gap (not directly applicable in React Native)
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    color: "black",
  },
  sectionContent: {
    fontSize: 17,
    color: "#333",
    marginLeft: 20,
    marginBottom: 8,
  },
  scheduleContainer: {
    marginLeft: 20,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  scheduleDetail: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
});


