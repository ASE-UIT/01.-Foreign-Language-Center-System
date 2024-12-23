import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 20 }}>
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
    padding: 20,
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