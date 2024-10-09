import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { studenthomeStyles, styles } from '../Styles/globaStyles';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; 


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
    const [fullName, setFullName] = useState('Trình Quang Hạo');
    const languages = [
        { id: 1, name: 'Ngôn ngữ phổ biến', price: '399.000', oldPrice: '1.000.000', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6RpSHLfu83M0-EADKNqhomB764m0BtOUSFMGVFVPglmieYakz', instructor: 'Melina' },
        { id: 2, name: 'Ngôn ngữ phổ biến', price: '399.000', oldPrice: '1.000.000', image: 'https://stjosephenglish.edu.vn/wp-content/uploads/2022/08/bi-quyet-day-tieng-anh-giao-tiep-cho-be.jpg', instructor: 'Melina' },
      ];
      const courses = [
        { id: 1, name: 'Tiếng Anh', startDate: '20/08/2024', price: '399.000', oldPrice: '1.000.000', image: 'https://vuongquocanh.com/wp-content/uploads/2018/04/la-co-vuong-quoc-anh.jpg'},
        { id: 2, name: 'Tiếng Nhật', startDate: '20/08/2024', price: '399.000', oldPrice: '1.000.000', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/225px-Flag_of_Japan.svg.png' },
      ];
  
    return (
      <View style={studenthomeStyles.container}>     
        <View style={studenthomeStyles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)} style={{ marginBottom: 50, marginTop: 20 }}>
          <MaterialCommunityIcons name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
          <Image 
            source={{ uri: 'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/285784312_753896646025777_4701541195413699856_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbhCDXv0o-_rEJJf2qR5R7605isYPfh8DrTmKxg9-HwME51aYNu2LmSo4ax3JwjaZAukOl8IkI-z7B9kgdGXZ8&_nc_ohc=GIYJKpozh-EQ7kNvgF4zMMa&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&oh=00_AYBr_buNPZecIOXRn3GlPZtTjQHuP7WhTODO8fuzTdwbOw&oe=67012E51' }} 
            style={studenthomeStyles.avatar} 
          />
        </View>
          <Text style={studenthomeStyles.welcomeText}>Xin chào, {fullName}</Text>
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
          <TouchableOpacity 
          key={language.id} 
          style={studenthomeStyles.horizontalItem}
          onPress={() => console.log(`Bạn đã chọn ngôn ngữ: ${language.name}`)}
          >
            <Image source={{ uri: language.image }} style={studenthomeStyles.languageImage} />
            <Text style={studenthomeStyles.languageText}>{language.name}</Text>
            <View style={studenthomeStyles.bottomInfo}>
        
        <Text style={studenthomeStyles.instructorText}>{language.instructor}</Text>

        <Text style={studenthomeStyles.priceText}>
          {language.price} <Text style={studenthomeStyles.oldPriceText}>{language.oldPrice}</Text>
        </Text>
      </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
      <Text style={studenthomeStyles.sectionTitle}>Ngôn ngữ phổ biến</Text>
      <TouchableOpacity style={studenthomeStyles.seeAllButton}>
      <Text style={studenthomeStyles.seeAllText}>Xem tất cả</Text>
      </TouchableOpacity>
      </View>
      {courses.map((course) => (
        <TouchableOpacity key={course.id} 
          style={studenthomeStyles.verticalItem}
          onPress={() => console.log(`Bạn đã chọn khóa học: ${course.name}`)}
          >
          <Image source={{ uri: course.image }} style={studenthomeStyles.coureImage} />
          <View>
            <Text style={studenthomeStyles.courseName}>{course.name}</Text>
            <Text style={studenthomeStyles.startDate}>Ngày bắt đầu: {course.startDate}</Text>
            <Text style={studenthomeStyles.priceText}>
              {course.price} <Text style={studenthomeStyles.oldPriceText}>{course.oldPrice}</Text>
            </Text>
          </View>
        </TouchableOpacity>
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