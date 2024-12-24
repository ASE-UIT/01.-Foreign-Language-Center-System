import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../_layout';

const ClassDetail = () => {
    const classData = {
        title: "Từ vựng IELTS cho band 7.5+",
        teacher: "Mỹ Quế Lan",
        image: 'https://png.pngtree.com/png-vector/20240314/ourmid/pngtree-cartoon-of-thai-male-teacher-holding-a-stick-in-front-of-png-image_11960364.png',
        overview: {
            progress: "7/15 buổi",
            startDate: "15 - 12 - 2024",
            endDate: "22 - 01 - 2025",
        },
        details: [
            {
                session: "Buổi 1: Nói chuyện như người sư phạm",
                instructor: "Chị Huy",
                link: "Lớp thứ 2 khóa từ vựng",
                description: [
                    "Giới thiệu giảng viên",
                    "Kho tài liệu học tập",
                ],
            },
            {
                session: "Buổi 2: Học IPA cùng chị Huy",
                instructor: "Chị Huy",
                link: "Lớp thứ 2 khóa từ vựng",
                description: [
                    "Khái niệm về IPA",
                    "Unit 1 và bài tập về nhà",
                ],
            },
        ],
        resources: [
            "Tài liệu buổi 1",
            "Tài liệu buổi 2",
        ],
    };

    const [expandedSections, setExpandedSections] = useState<number[]>([]); // Quản lý trạng thái mở/đóng

    const toggleSection = (index: number) => {
        if (expandedSections.includes(index)) {
            setExpandedSections(expandedSections.filter(i => i !== index)); // Đóng
        } else {
            setExpandedSections([...expandedSections, index]); // Mở
        }
    };
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();


    return (
        <ScrollView style={styles.container}>
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
                        fontSize: 20, // Kích thước chữ tiêu đề header
                        color: 'white', // Màu chữ tiêu đề
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
                        <Text style={styles.subtitle}>{classData.title} asdf asdf sdf asdf asdf asdf asdf </Text>
                        <Text style={styles.teacher}>Giảng viên: {classData.teacher}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: classData.image }} style={styles.image} />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>1. Tổng quan lớp học</Text>
                        <TouchableOpacity style={{ flex: 1 }}
                            onPress={() => toggleSection(0)}>
                            <FontAwesome6 style={{ flex: 1 }}
                                name={expandedSections.includes(0) ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black" />
                        </TouchableOpacity>
                    </View>
                    {expandedSections.includes(0) && (
                        <>
                            <Text style={styles.text}>
                                - Tiến độ: <Text style={styles.boldText}>{classData.overview.progress}</Text>
                            </Text>
                            <Text style={styles.text}>
                                - Ngày mở lớp: <Text style={styles.boldText}>{classData.overview.startDate}</Text>
                            </Text>
                            <Text style={styles.text}>
                                - Ngày kết thúc lớp: <Text style={styles.boldText}>{classData.overview.endDate}</Text>
                            </Text>
                        </>
                    )}
                </View>

                {/* Dropdown cho Thông tin chi tiết */}
                <View style={styles.section}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>2. Thông tin chi tiết</Text>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleSection(1)}>
                            <FontAwesome6
                                name={expandedSections.includes(1) ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    {expandedSections.includes(1) && (
                        <View>
                            {classData.details.map((detail, index) => (
                                <View key={index}>
                                    <Text style={styles.subSectionTitle}>- {detail.session}</Text>
                                    <Text style={styles.text}>• Giảng viên: {detail.instructor}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.text}>• Link meeting:
                                        </Text>
                                        <TouchableOpacity>
                                            <Text style={styles.link}>{detail.link}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.text}>• Mô tả buổi học:</Text>
                                    {detail.description.map((desc, idx) => (
                                        <Text key={idx} style={styles.textMargin_40}>• {desc}</Text> // Dấu chấm đầu dòng
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Dropdown cho Kho tài liệu */}
                <View style={styles.section}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>3. Kho tài liệu</Text>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleSection(2)}>
                            <FontAwesome6
                                name={expandedSections.includes(2) ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                    {expandedSections.includes(2) && (
                        classData.resources.map((resource, index) => (
                            <TouchableOpacity key={index}>
                                <Text style={[styles.link, styles.text]}>• {resource}</Text>
                            </TouchableOpacity>
                        ))
                    )}
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