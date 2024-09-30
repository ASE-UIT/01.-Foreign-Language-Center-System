import React, { useState } from "react"
import { Text, View } from "react-native"
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from "../Styles/globaStyles";
import CustomButton from "../Components/CustomButton";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../Navigation/AppNavigator";


const data = [
    { student: 'Nguyen Van A', keyParent: 'Nguyen' },
    { student: 'Nguyen Van B', keyParent: 'Nguyen' },
    { student: 'Nguyen Van C', keyParent: 'Nguyen' },
    { student: 'Dang Van A', keyParent: 'Dang' },
    { student: 'Dang Van B', keyParent: 'Dang' },


]; // example data


const RoleScreen: React.FC = () => {
    const [value, setValue] = useState<string>();
    const route = useRoute<RouteProp<RootStackParamList>>(); // Passing parameters to routes


    const fullName = route.params?.fullName

    const getStudents = (item: {
        student: string;
        keyParent: string;
    }) => {
        if (fullName?.startsWith(item.keyParent)) {
            return true
        }
        return false
    } // citeria to filter students with keyParent

    const renderItem = (item: {
        student: string;
        keyParent: string;
    }) => {
        return (
            <View style={{
                marginLeft: 10,
                marginVertical: 10,
            }}>
                <Text style={{ fontSize: 15 }}>{item.student}</Text>
            </View>
        );
    };

    return (

        <View style={styles.container}>
            <Dropdown
                style={[styles.input, {}]}
                data={data.filter(getStudents)}
                labelField="student"
                valueField="keyParent"
                placeholder="Chọn học viên"
                containerStyle={{ borderRadius: 10 }}
                itemContainerStyle={{ borderRadius: 10 }}
                onChange={item => {
                    setValue(item.keyParent);
                }}
                renderItem={renderItem}

            />

            <View style={styles.loginButton}>
                <CustomButton
                    title="Tiếp tục"
                    onPress={() => alert('chon hoc vien thanh cong')}
                    primary
                />
            </View>



        </View>
    )
}

export default RoleScreen