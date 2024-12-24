import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Course } from '../(coursesNav)';
import { router, useNavigation } from 'expo-router';
import teacher from '../../../assets/images/teacher.png'
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <TouchableOpacity style={styles.detailButton} onPress={() => router.push({
          pathname: '../(myCourseDetails)/[id]',
          params: { id: '1' }
        })}>
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
    },
    {
      id: "2",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "3",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "4",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher
    },
    {
      id: "5",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "6",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher
    },
    {
      id: "7",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher
    },
    {
      id: "8",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "9",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "10",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "11",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
    {
      id: "12",
      title: "Tiếng Anh giao tiếp cơ bản",
      instructor: "Mỹ Quế Lan",
      imageUrl: teacher 
    },
  ];

  const renderCourse = ({ item }: { item: Course }) => <CourseCard course={item} />;
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <View style={{flex:1}}>
      
        <View style={styles.headerNav}>
                  <Text style={styles.headerTitle}>Khóa học của bạn</Text>
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                      source={require('../../../assets/images/menu.png')}
                      style={styles.menu}
                    />
                  </TouchableOpacity>
                </View>
        <SafeAreaView style={{flex:2}}>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={renderCourse}
            contentContainerStyle={{flexGrow: 1, paddingBottom:20}}

          />
        </SafeAreaView>

    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: "#f9f9f9",
  },
  headerNav: {
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Vertical alignment
    justifyContent: 'space-between', // Space out items
    height: 92, // Custom header height
    backgroundColor: '#2A58BA', // Background color
  },
  headerTitle: {
    fontSize: 20, // Kích thước chữ tiêu đề header
    color: 'white', // Màu chữ tiêu đề
    marginTop: 30,
    marginLeft: 15,
    fontWeight: 'bold'
  },
  menu: {
    width: 30,
    height: 20,
    marginRight: 20,
    marginTop: 30,
    resizeMode: 'contain',
  },
  listContainer: {
    paddingBottom: 0,
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
    fontSize: 16,
    color: "#333",
    marginTop: -10,

  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailButton: {
    marginTop: 5,
    width: 100, // Fixed width
    height: 30, // Fixed height
    borderRadius: 5, // Border radius
    borderWidth: 1, // Border width
    borderColor: '#BABABA', // Border color
    backgroundColor: '#E6E6E6', // Background color
    opacity: 1, // Opacity (set to 1 for visibility)
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Gap (not directly applicable in React Native)
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
});