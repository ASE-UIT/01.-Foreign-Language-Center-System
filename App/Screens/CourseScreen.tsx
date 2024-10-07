import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../Types/types";
import hambuger_icon from '../../assets/images/hamburger_icon.png'

const note = {
  course: 'Tiếng anh giao tiếp',
  teacher: 'Ken',
  content: '',
  day: 'Thứ 7',
  shift: 'ca 4',
}
const data = [
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },
  { ...note }, { ...note },

]



const CourseScreen: React.FC = () => {

  const renderItem = ({ item }: any) => {
    return (
      <View style={{ marginBottom: 10, marginHorizontal: -40, marginTop: 10 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, }}>
          <Text style={{ fontSize: 14, fontWeight: '500', marginLeft: -5, color: '#153AD1' }}>{item.course}</Text>
          <Text style={{ fontSize: 14 }}>{item.day}, {item.shift}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 14, marginLeft: 72.5 }}>Giảng viên: </Text>
            <Text style={{ fontSize: 14, color: '#153AD1', fontWeight: '500' }}>{item.teacher}</Text>
          </View>

          <AntDesign name="right" size={24} color="black" style={{ marginRight: 72.5 }} />
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#AEAEAE', height: 1.5, width: '71%', marginTop: 10 }}>
          </View>
        </View>
      </View>

    )
  }

  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>()

  return (
    <View style={{ backgroundColor: 'white' }}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image source={hambuger_icon} style={{ marginTop: 40, marginLeft: 20 }} />

      </TouchableOpacity>

      <View style={{ marginVertical: 10, marginTop: 10 }}>
        <Text style={{
          fontSize: 20,
          fontFamily: 'Inter-Bold',
          fontWeight: '700',
          textAlign: 'center',
        }}>Danh sách khóa học đã đăng ký</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#AEAEAE', height: 1.5, width: '88%', marginBottom: 20 }}>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={(item) => renderItem(item)}
        style={{ marginBottom: 150 }}

      />

    </View>
  )
}

export default CourseScreen