import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { Link, router } from 'expo-router'
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native'
import teacher from '../../../assets/images/teacher.png'
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { http } from '@/http/http';


export type Course = {
  courseID: string;
  name: string;
  teachers: string[];
  imageUrl: any;
};

export type RootStackParamList = {
  Course: any,
  CourseDetails: any,
}



export default function Index() {
  const { user } = useClerk()
  const req = { clerkUserID: user?.id }
  const enroll = async (id: any) => {
    const response = await http().put(`/enroll-course/${id}`, req)
    console.log(response)
  }
  const [courses, setCourses] = useState<Course[]>([]); // Biến để lưu dữ liệu
  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <View style={styles.courseCard}>
      <Image source={course.imageUrl} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.courseTitle}>{course.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.instructor}>Giảng viên: </Text>
          <Text style={[styles.instructor, { fontWeight: 'bold' }]}>{course.teachers[0][0]}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={() => enroll(course.courseID)}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailButton} onPress={() => router.push({
            pathname: '/(tabs)/(coursesNav)/(courseDetails)/[id]',
            params: { id: `${course.courseID}` },
          })}>
            <Text style={styles.detailText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const getCourses = async () => {
    try {
      const response = await axios.get<any>(
        `http://10.0.2.2:5000/api/courses`,
      );

      const courseData = response.data.map((course: any) => ({
        courseID: course.courseID,
        name: course.name,
        teachers: course.teachers,
        imageUrl: teacher

      }));

      setCourses(courseData);  // Lưu mảng khóa học vào state

    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []); // Dependency array ensures the effect runs only once
  // const courses: Course[] = [
  //   {
  //     id: "1",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher

  //   },
  //   {
  //     id: "2",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher
  //   },
  //   {
  //     id: "3",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher
  //   },
  //   {
  //     id: "4",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "5",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "6",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "7",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "8",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "9",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },
  //   {
  //     id: "10",
  //     title: "Tiếng Anh giao tiếp cơ bản",
  //     instructor: "Mỹ Quế Lan",
  //     imageUrl: teacher // Replace with actual image URL
  //   },

  // ];

  const renderCourse = ({ item }: { item: Course }) => <CourseCard course={item} />;
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <SignedIn>
        <View style={styles.headerNav}>
          <Text style={styles.headerTitle}>Danh sách khóa học</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../../../assets/images/menu.png')}
              style={styles.menu}
            />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.courseID}
            renderItem={renderCourse}
            contentContainerStyle={styles.listContainer}
          />
        </SafeAreaView>
      </SignedIn>
    </View>
  )
}

const styles = StyleSheet.create({

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
  container: {
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
    paddingBottom: 50,
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
    marginTop: 5,
    width: 100,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BABABA',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  detailButton: {
    marginTop: 5,
    width: 100,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BABABA',
    backgroundColor: '#E6E6E6',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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