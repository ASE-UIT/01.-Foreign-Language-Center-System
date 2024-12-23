import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { RootDrawerParamList } from '../_layout';

const SalaryList = () => {
  const salaryData = [
    {
      month: "Tháng 10",
      dateReceived: "04/11/2024",
      amount: "15.000.000 VND",
      content: "Nội dung",
    },
    {
      month: "Tháng 10",
      dateReceived: "04/11/2024",
      amount: "15.000.000 VND",
      content: "Nội dung",
    },
    {
      month: "Tháng 10",
      dateReceived: "04/11/2024",
      amount: "15.000.000 VND",
      content: "Nội dung",
    },
    {
      month: "Tháng 10",
      dateReceived: "04/11/2024",
      amount: "15.000.000 VND",
      content: "Nội dung",
    },
  ];

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={{
          flexDirection: 'row', // Horizontal layout
          alignItems: 'center', // Vertical alignment
          justifyContent: 'space-between', // Space out items
          height: 92, // Custom header height
          backgroundColor: '#2A58BA', // Background color

        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: 20, // Kích thước chữ tiêu đề header
              color: 'white', // Màu chữ tiêu đề
              marginTop: 30,
              marginLeft: 15,
              fontWeight: 'bold'
            }}> Lương </Text>
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
      </View>
      <View style={{ padding: 20 }}>
        {salaryData.map((salary, index) => (
          <View key={index} style={styles.salaryItem}>
            <Text style={styles.salaryMonth}>{`Lương ${salary.month}`}</Text>
            <Text style={styles.salaryDate}>
              Ngày nhận: <Text style={styles.boldText}>{salary.dateReceived}</Text>
            </Text>
            <Text style={styles.salaryAmount}>
              Tiền lương: <Text style={styles.boldText}>{salary.amount}</Text>
            </Text>
            <Text style={styles.salaryContent}>
              Nội dung chuyển khoản: <Text style={styles.boldText}>{salary.content}</Text>
            </Text>
            <View style={styles.separator} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  salaryItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  salaryMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A58BA',
  },
  salaryDate: {
    fontSize: 14,
    marginVertical: 2,
  },
  salaryAmount: {
    fontSize: 14,
    marginVertical: 2,
  },
  salaryContent: {
    fontSize: 14,
    marginVertical: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold', // Đặt chữ in đậm
  },
});

export default SalaryList;