import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { studenthomeStyles, styles } from '../Styles/globaStyles';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // Import biểu tượng


interface Course {
    id: string;
    name: string;
    teacher: string;
    price: string;
    oldPrice: string;
    startDate: string;
    flag: string;
    image: string;
  }

const StudentHomeScreen: React.FC = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const languages = [
        { id: 1, name: 'Ngôn ngữ phổ biến', price: '399.000', oldPrice: '1.000.000', image: 'https://example.com/image1.jpg', instructor: 'Melina' },
        { id: 2, name: 'Ngôn ngữ phổ biến', price: '399.000', oldPrice: '1.000.000', image: 'https://example.com/image2.jpg', instructor: 'Melina' },
      ];
      const courses = [
        { id: 1, name: 'Tiếng Anh', startDate: '20/08/2024', price: '399.000', oldPrice: '1.000.000', flag: '🇬🇧' },
        { id: 2, name: 'Tiếng Nhật', startDate: '20/08/2024', price: '399.000', oldPrice: '1.000.000', flag: '🇯🇵' },
      ];
  
    return (
      <View style={studenthomeStyles.container}>
        
        <View style={studenthomeStyles.header}>
        <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)} style={{ marginBottom: 50 }}>
          <MaterialCommunityIcons name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
          <Text style={studenthomeStyles.welcomeText}>Xin chào, Trình Quang Hạo</Text>
          <Text style={studenthomeStyles.subText}>Bạn muốn học ngôn ngữ nào?</Text>
          <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
          <View style={{ flex: 1, position: 'relative' }}>
          <Image 
            source={require('../../assets/images/search-icon.png')}
            style={{ width: 28, height: 28, position: 'absolute', 
                top: '20%', 
                left: 10, 
                zIndex: 1,
                 }}
            />
          <TextInput 
            style={studenthomeStyles.searchInput}
            placeholder="Tìm kiếm khóa học của bạn"
            placeholderTextColor="#FFFFFF"
          />
          </View>
          
          <TouchableOpacity 
            style={studenthomeStyles.filter}
            onPress={() => console.log('Mở bộ lọc')}
          >
            <Image 
              source={require('../../assets/images/filter-icon.png')} 
              style={{ width: 25, height: 25, tintColor: '#FFFFFF' }} 
            />
          </TouchableOpacity>
        </View>
        </View>
  
        
        <ScrollView style={studenthomeStyles.container}>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
      <Text style={studenthomeStyles.sectionTitle}>Ngôn ngữ phổ biến</Text>
      <TouchableOpacity style={studenthomeStyles.seeAllButton}>
      <Text style={studenthomeStyles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
        </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {languages.map((language) => (
          <View key={language.id} style={studenthomeStyles.horizontalItem}>
            <Image source={{ uri: language.image }} style={studenthomeStyles.languageImage} />
            <Text style={studenthomeStyles.languageText}>{language.name}</Text>
            <View style={studenthomeStyles.bottomInfo}>
        
        <Text style={studenthomeStyles.instructorText}>{language.instructor}</Text>

        <Text style={studenthomeStyles.priceText}>
          {language.price} <Text style={studenthomeStyles.oldPriceText}>{language.oldPrice}</Text>
        </Text>
      </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
      <Text style={studenthomeStyles.sectionTitle}>Ngôn ngữ phổ biến</Text>
      <TouchableOpacity style={studenthomeStyles.seeAllButton}>
      <Text style={studenthomeStyles.seeAllText}>Xem tất cả</Text>
      </TouchableOpacity>
      </View>
      {courses.map((course) => (
        <View key={course.id} style={studenthomeStyles.verticalItem}>
          <Text style={studenthomeStyles.flagText}>{course.flag}</Text>
          <View>
            <Text style={studenthomeStyles.courseName}>{course.name}</Text>
            <Text style={studenthomeStyles.startDate}>Ngày bắt đầu: {course.startDate}</Text>
            <Text style={studenthomeStyles.priceText}>
              {course.price} <Text style={studenthomeStyles.oldPriceText}>{course.oldPrice}</Text>
            </Text>
          </View>
        </View>
      ))}

      </ScrollView>
      
        {isMenuVisible && (
        <View style={studenthomeStyles.menu}>
          <Text style={studenthomeStyles.menuItem}>Khóa học của tôi</Text>
          <Text style={studenthomeStyles.menuItem}>Thông tin cá nhân</Text>
          <Text style={studenthomeStyles.menuItem}>Đăng xuất</Text>
        </View>
      )}
       </View>
      
    );
  };
  
  export default StudentHomeScreen;