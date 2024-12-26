import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import { useGlobalSearchParams, useLocalSearchParams } from "expo-router/build/hooks";
import teacher from '../../../../assets/images/teacher.png'
import { router, useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../_layout";
import { FontAwesome6 } from "@expo/vector-icons";
import { http } from "@/http/http";



export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const [isTeacher, setTeacher] = useState(true)
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [expandedSections, setExpandedSections] = useState<number[]>([]); // Quản lý trạng thái mở/đóng
  const [sections, setSections] = useState({
    overview: false,
    objectives: false,
    schedule: false,
    additional: false,
  });

  const [course, setCourse] = useState<any>()
    const getCourseDetails = async() => {
      try{
        const response = await http().get(`/course-detail/${id}`)
      const courseData = {
        
        title: response.data.course.name,
        instructor: response.data.course.teachers[0][0],
        studentCount: response.data.course.currentStudent,
        studentLimit: response.data.course.studentLimit,
        overview: response.data.course.sumary,
        objectives: response.data.course.target,
        schedule: response.data.course.classes[0].schedule,
        rating:response.data.course.rating,
        vote:response.data.course.totalVote,
  
      }
      setCourse(courseData)
      console.log(response.data.course.classes[0].schedule)
      }catch(error){ 
  
        console.error("Error fetching role:", error);
      }
      }
      
            
        
  
    useEffect(()=>{getCourseDetails()},[])

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



  if (!course) {
    return <Text> Khóa học không tìm thấy </Text>;
  }
 
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
                <TouchableOpacity style={[styles.registerButton, { width: 100, alignItems: 'center', justifyContent: 'center', marginRight: 15 }]} onPress={() => router.push({pathname:'/(tabs)/(myCourseNav)/(myCourseDetails)/(scores)/[id]', params:{id:`${id}`}})}>
                  <Text style={styles.registerText}>Bảng điểm</Text>
                </TouchableOpacity>
                ) : (
                 
                  <Text style={[styles.registerText, {color:'black'}]}>Đã đăng ký</Text>
               
                )}

                
                <Text style={styles.studentCount}>Sĩ số: {course.studentCount}/{course.studentLimit}</Text>
              </View>
        </View>
       
        


        <View>
          {/* Section 1: Overview */}
                    <TouchableOpacity style={styles.section} onPress={() => toggleSection("overview")}>
                      <Text style={styles.sectionTitle}>1. Tổng quan khóa học</Text>
                      <FontAwesome6 style={{ marginRight: 30 }}
                        name={expandedSections.includes(0) ? "chevron-up" : "chevron-down"}
                        size={25}
                        color="black" />
                    </TouchableOpacity>
                    {sections.overview && (
                      course.overview.map((item : any, index:any) => (
                        <View key={index} style={styles.scheduleContainer}>
                          <Text style={styles.sectionContent}>- {item}</Text>
                       </View>))
                    )}
          
                    {/* Section 2: Objectives */}
                    <TouchableOpacity onPress={() => toggleSection("objectives")} style={styles.section}>
                      <Text style={styles.sectionTitle}>2. Mục tiêu khóa học:</Text>
                      <FontAwesome6 style={{ marginRight: 30 }}
                        name={expandedSections.includes(1) ? "chevron-up" : "chevron-down"}
                        size={25}
                        color="black" />
                    </TouchableOpacity>
                    {sections.objectives && (
                       course.objectives.map((item : any, index:any) => (
                        <View key={index} style={styles.scheduleContainer}>
                          <Text style={styles.sectionContent}>- {item}</Text>
                       </View>))
                    )}
          
                    {/* Section 3: Schedule */}
                    <TouchableOpacity onPress={() => toggleSection("schedule")} style={styles.section}>
                      <Text style={styles.sectionTitle}>3. Các lớp học và lịch học:</Text>
                      <FontAwesome6 style={{ marginRight: 30 }}
                        name={expandedSections.includes(2) ? "chevron-up" : "chevron-down"}
                        size={25}
                        color="black" />
                    </TouchableOpacity>
                       {sections.schedule &&
                                course.schedule.map((item : any, index:any) => (
                                  <View key={index} style={styles.scheduleContainer}>
                                    <Text style={styles.sectionContent}>- {item}</Text>
                                 </View>))}
          
                    {/* Section 4: Additional Info */}
                    <TouchableOpacity onPress={() => toggleSection("additional")} style={styles.section}>
                      <Text style={styles.sectionTitle}>4. Thông tin thêm:</Text>
                      <FontAwesome6 style={{ marginRight: 30 }}
                        name={expandedSections.includes(3) ? "chevron-up" : "chevron-down"}
                        size={25}
                        color="black" />
                    </TouchableOpacity>
                    {sections.additional && (
                      <Text style={[styles.sectionContent, {marginLeft:20}]}>Khóa học được đánh giá {course.rating}/5 với {course.vote} lượt đánh giá</Text>
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

  section:{flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,},
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


