import React from "react";
import { FlatList, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const note = {
    teacher: 'Mỹ Quế Lan',
    title: 'Thông báo sáng mai nghỉ học',
    content: '',
    time: '22:00',
    date: '12/08/2024',
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



const NotificationScreen: React.FC = () => {

    const renderItem = ({ item }: any) => {
        return (
            <View style={{ marginBottom: 10, marginHorizontal: -40, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', marginLeft: -5 }}>{item.teacher}</Text>
                    <Text style={{ fontSize: 14 }}>{item.time} {item.date}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ fontSize: 14 }}>{item.title}</Text>
                    <AntDesign name="right" size={24} color="black" />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#AEAEAE', height: 1.5, width: '71%', marginTop: 10 }}>
                    </View>
                </View>
            </View>

        )
    }

    return (
        <View style={{ backgroundColor: 'white' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#AEAEAE', height: 1.5, width: '88%', marginBottom: 20 }}>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={(item) => renderItem(item)}
                style={{ marginBottom: 50 }}
            />

        </View>
    )
}

export default NotificationScreen