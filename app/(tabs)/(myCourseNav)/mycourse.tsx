import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Course } from '../(coursesNav)';
import { router, useNavigation } from 'expo-router';
import teacher from '../../../assets/images/teacher.png'
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <View style={styles.courseCard}>
    <Image source={course.imageUrl} style={styles.image} />
    <View style={styles.infoContainer}>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.instructor}>Giảng viên:  </Text>
        <Text style={[styles.instructor, { fontWeight: 'bold' }]}>{course.instructor}</Text>
      </View>

      <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.detailButton} onPress={()=> router.push({pathname: '../(myCourseDetails)/[id]',
          params: { id: '1' }})}>
          <Text style={styles.detailText}>Xem chi tiết</Text>
        
          

        </TouchableOpacity>



      </View>
    </View>
  </View>
);
export default function Mycourse() {
    const courses: Course[] = [
        {
          id: "1",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher
          , // Replace with actual image URL
        },
        {
          id: "2",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "3",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "12",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "4",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "5",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "6",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "7",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "8",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "9",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "10",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
        {
          id: "11",
          title: "Tiếng Anh giao tiếp cơ bản",
          instructor: "Mỹ Quế Lan",
          imageUrl: teacher // Replace with actual image URL
        },
    
        // Add more courses as needed
      ];
      const renderCourse = ({ item }: { item: Course }) => <CourseCard course={item} />;
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>(); 
    return (
        <View>
           <View >
                     <View style={{flexDirection: 'row', // Horizontal layout
               alignItems: 'center', // Vertical alignment
               justifyContent: 'space-between', // Space out items
               height: 92, // Custom header height
               backgroundColor: '#2A58BA', // Background color
               
                }}>
                       <Text style={{fontSize: 20, // Kích thước chữ tiêu đề header
                       color: 'white', // Màu chữ tiêu đề
                       marginTop: 30,
                       marginLeft: 15,
                       fontWeight:'bold'}}>Khóa học của bạn</Text>
                       
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
           
                     <FlatList
                       data={courses}
                       keyExtractor={(item) => item.id}
                       renderItem={renderCourse}
                       contentContainerStyle={styles.listContainer}
                     />
                   </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#3a6cb1",
  },
  listContainer: {
    paddingBottom: 16,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 117,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'contain',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a6cb1",
  },
  instructor: {
    fontSize: 14,
    color: "#333",
    marginTop: -10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",


  },
  registerButton: {
    backgroundColor: "#3a6cb1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  detailButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});