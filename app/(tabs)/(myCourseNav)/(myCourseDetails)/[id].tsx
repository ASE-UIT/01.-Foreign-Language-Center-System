import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import { useGlobalSearchParams, useLocalSearchParams } from "expo-router/build/hooks";
import teacher from '../../../../assets/images/teacher.png'
import { router, useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../_layout";



export default function CourseDetail() {
  const { id } = useLocalSearchParams();

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

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return <Text> Khóa học không tìm thấy </Text>;
  }
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
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
        <View style={{flexDirection:'row', marginHorizontal:1}}>
        <View style={{flexDirection:'column', marginRight:15, marginTop: 17}}>
          <Text style={styles.header}>{course.title}</Text>
          <View style={[styles.topContainer, { flexDirection: 'row-reverse' }]}>
            
            <View style={styles.infoContainer}>
              <Text style={styles.instructor}>Giảng viên: {course.instructor}</Text>
              <View style={{ flexDirection: 'row', marginTop:15 }}>

                <TouchableOpacity style={[styles.registerButton, { width: 100, alignItems: 'center', justifyContent: 'center', marginRight: 15 }]} onPress={() => router.push('/(tabs)/(myCourseNav)/details/score/[id]')}>
                  <Text style={styles.registerText}>Bảng điểm</Text>
                </TouchableOpacity>
                <Text style={styles.studentCount}>Sĩ số: {course.studentCount}</Text>
              </View>

            </View>
          </View>

        </View>
        <Image source={course.imageUrl} style={styles.image} />
        </View>
        

        <View>
          {/* Section 1: Overview */}
          <TouchableOpacity onPress={() => toggleSection("overview")}>
            <Text style={styles.sectionTitle}>1. Tổng quan khóa học</Text>
          </TouchableOpacity>
          {sections.overview && (
            <Text style={styles.sectionContent}>{course.overview}</Text>
          )}

          {/* Section 2: Objectives */}
          <TouchableOpacity onPress={() => toggleSection("objectives")}>
            <Text style={styles.sectionTitle}>2. Mục tiêu khóa học:</Text>
          </TouchableOpacity>
          {sections.objectives && (
            <Text style={styles.sectionContent}>{course.objectives}</Text>
          )}

          {/* Section 3: Schedule */}
          <TouchableOpacity onPress={() => toggleSection("schedule")}>
            <Text style={styles.sectionTitle}>3. Các lớp học và lịch học:</Text>
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
          <TouchableOpacity onPress={() => toggleSection("additional")}>
            <Text style={styles.sectionTitle}>4. Thông tin thêm:</Text>
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
    paddingHorizontal: 16,
    
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a6cb1",
    
  },
  topContainer: {
    flexDirection: "row",
    marginBottom: 16,
    
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    marginTop:17
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  instructor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  studentCount: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
    marginLeft:5,
  },
  registerButton: {
    backgroundColor: "#3a6cb1",
    paddingVertical: 8,
    borderRadius: 4,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#3a6cb1",
  },
  sectionContent: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    marginBottom: 8,
  },
  scheduleContainer: {
    marginLeft: 8,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  scheduleDetail: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
});


