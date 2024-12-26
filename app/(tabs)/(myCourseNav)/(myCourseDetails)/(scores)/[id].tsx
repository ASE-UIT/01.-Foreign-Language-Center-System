import { RootDrawerParamList } from "@/app/(tabs)/_layout";
import { http } from "@/http/http";
import { useClerk } from "@clerk/clerk-expo";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function ScoreBoard() {
   const { id } = useLocalSearchParams();
   const {user} = useClerk()
   const [tableData,setTableData] = useState<any>()
   const getScores = async() =>{
    
    const response = await http().get(`/scores/${id}`,  {params:{clerkUserID: user?.id}} )
    const score = response.data.scores?.map((score: any,index:any) => ({
           session:index,
           testName: score.description,
           score: score.score,
           
          }));
    
    console.log(score)
    setTableData(score)
   }

   useEffect(()=>{
    getScores()
   },[])
  // const tableData = [
  //   { session: "1", testName: "", score: "" },
  //   { session: "2", testName: "", score: "" },
  //   { session: "3", testName: "", score: "" },
  //   { session: "4", testName: "", score: "" },
  //   { session: "5", testName: "", score: "" },
  //   { session: "6", testName: "", score: "" },
  // ];
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>(); 

  return (
    <View style={styles.container}>
      {/* Header */}
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
                    source={require('../../../../../assets/images/back.png')}
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
                }}> Bảng điểm </Text>
              </View>
      
      
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={require('../../../../../assets/images/menu.png')}
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
     
                          

     

      {/* Score Table */}
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Buổi</Text>
            <Text style={styles.tableHeaderText}>Tên bài kiểm tra</Text>
            <Text style={styles.tableHeaderText}>Điểm</Text>
          </View>
          {tableData && tableData.map((row:any, index:any) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{row.session}</Text>
              <Text style={styles.tableCell}>{row.testName}</Text>
              <Text style={styles.tableCell}>{row.score}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A58BA",
    height: 92,
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 25,
    height: 25,
    marginTop: 30,
    resizeMode: "contain",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  menuIcon: {
    width: 30,
    height: 20,
    marginTop: 30,
    resizeMode: "contain",
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  instructor: {
    fontSize: 16,
    color: "#333333",
  },
  boldText: {
    fontWeight: "bold",
    color: "#3A6CB1",
  },
  table: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
    padding: 8,
  },
  tableCell: {
    flex: 1,
    color: "#333333",
    textAlign: "center",
  },
});
