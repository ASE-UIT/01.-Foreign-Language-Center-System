import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const ClassDetail = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chi tiết lớp học</Text>
                <Text style={styles.subtitle}>Từ vựng IELTS cho band 7.5+</Text>
                <Text style={styles.teacher}>Giảng viên: Mỹ Quế Lan</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Tổng quan lớp học</Text>
                <Text style={styles.text}>Tiến độ: 7/15 buổi</Text>
                <Text style={styles.text}>Ngày mở lớp: 15 - 12 - 2024</Text>
                <Text style={styles.text}>Ngày kết thúc lớp: 22 - 01 - 2025</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Thông tin chi tiết</Text>
                <Text style={styles.subSectionTitle}>- Buổi 1: Nói chuyện như người sư phạm</Text>
                <Text style={styles.text}>Giảng viên: Chị Huy</Text>
                <Text style={styles.text}>Link meeting: <TouchableOpacity><Text style={styles.link}>Lớp thứ 2 khóa từ vựng</Text></TouchableOpacity></Text>
                <Text style={styles.text}>Mô tả buổi học:</Text>
                <Text style={styles.text}>Giới thiệu giảng viên</Text>
                <Text style={styles.text}>Kho tài liệu học tập</Text>

                <Text style={styles.subSectionTitle}>- Buổi 2: Học IPA cùng chị Huy</Text>
                <Text style={styles.text}>Giảng viên: Chị Huy</Text>
                <Text style={styles.text}>Link meeting: <TouchableOpacity><Text style={styles.link}>Lớp thứ 2 khóa từ vựng</Text></TouchableOpacity></Text>
                <Text style={styles.text}>Mô tả buổi học:</Text>
                <Text style={styles.text}>Khái niệm về IPA</Text>
                <Text style={styles.text}>Unit 1 và bài tập về nhà</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Kho tài liệu</Text>
                <TouchableOpacity><Text style={styles.link}>Tài liệu buổi 1</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.link}>Tài liệu buổi 2</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 5,
    },
    teacher: {
        fontSize: 16,
        color: 'gray',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
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
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default ClassDetail;