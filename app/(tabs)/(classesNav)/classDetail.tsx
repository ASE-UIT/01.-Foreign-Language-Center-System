import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';
import { Course } from './classes';

interface ClassDetailProps {
    course: Course;
    onBack: () => void;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ course, onBack }) => {
    const [expandedSections, setExpandedSections] = useState<number[]>([]);
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    const toggleSection = (index: number) => {
        setExpandedSections(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 92,
                backgroundColor: '#2A58BA',
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={onBack}>
                        <Image
                            source={require('../../../assets/images/back.png')}
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
                        fontSize: 20,
                        color: 'white',
                        marginTop: 30,
                        marginLeft: 15,
                        fontWeight: 'bold'
                    }}> Chi tiết lớp học </Text>
                </View>

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

            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>{course.courseName}</Text>
                        <Text style={styles.teacher}>
                            Giảng viên: {course.classes[0]?.teacher[0]?.join(", ") || "No instructor"}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: course.coverIMG }} style={styles.image} />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>1. Tổng quan lớp học</Text>
                        <TouchableOpacity onPress={() => toggleSection(0)}>
                            <FontAwesome6
                                name={expandedSections.includes(0) ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {expandedSections.includes(0) && (
                        <>
                            <Text style={styles.text}>
                                - Ngày mở lớp: <Text style={styles.boldText}>{course.startDate}</Text>
                            </Text>
                            <Text style={styles.text}>
                                - Ngày kết thúc: <Text style={styles.boldText}>{course.endDate}</Text>
                            </Text>
                        </>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>2. Thông tin chi tiết</Text>
                        <TouchableOpacity onPress={() => toggleSection(1)}>
                            <FontAwesome6
                                name={expandedSections.includes(1) ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {expandedSections.includes(1) && course.classes.map((classItem, index) => (
                        <View key={index}>
                            <Text style={styles.subSectionTitle}>- {classItem.className}</Text>
                            <Text style={styles.text}>• Giảng viên: {classItem.teacher[0]?.join(", ")}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.text}>• Link meeting: </Text>
                                <TouchableOpacity>
                                    <Text style={styles.link}>{classItem.meeting}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.text}>• Lịch học:</Text>
                            {classItem.schedule.map((scheduleItem, idx) => (
                                <Text key={idx} style={styles.textMargin_40}>• {scheduleItem}</Text>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginBottom: 20,
        minWidth: 200,
        flex: 1
    },
    subtitle: {
        fontSize: 18,
        color: '#2A58BA',
        fontFamily: 'Inter-Bold',
        marginVertical: 5,

    },
    teacher: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Inter-Bold',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        flex: 1,
        minWidth: 300,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        marginVertical: 2,
        marginLeft: 20,
    },
    textMargin_40: {
        fontSize: 14,
        marginVertical: 2,
        marginLeft: 40,
    },
    link: {
        color: '#2A58BA',
        fontFamily: 'Inter-Bold',
    },
    image: {
        width: 84,
        height: 84,
        borderRadius: 10,
    },
    boldText: {
        fontWeight: 'bold', // Đặt chữ in đậm
    },
});

export default ClassDetail;