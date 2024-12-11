import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Types/types';
import CustomButton from '../Components/CustomButton';
import { styles } from '../Styles/globaStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { userInfo } from '../Types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

interface LoginResponse{
    code: number,
    message: string,
    result:{
        token: string,
        authenticated: boolean,
        role: string
    }
}

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [email, setEmail] = useState('');
    const [pwd, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    let indexUser = -1

    const route = useRoute<RouteProp<RootStackParamList>>(); // Passing parameters to routes

    const keyInfo = route.params?.keyInfo
    const fullName = route.params?.fullName
    const accName = route.params?.accName
    const password = route.params?.password

    const [users, setUsers] = useState<userInfo[]>([
        {
            keyInfo: 'abc@gmail.com',
            fullName: 'ABC',
            accName: 'abc',
            password: '12345678',
        }
    ]); // set list of account with a default value

    useEffect(() => {
        if (route.params?.keyInfo) { // check if keyInfo updated -> having a registration

            setUsers([...users, {
                keyInfo: keyInfo,
                fullName: fullName,
                accName: accName,
                password: password,
            }]) // replace list with new account 
        }
    }, [route.params?.keyInfo]); // value from component used inside of the function.

    const handleLogin = async (email: string, password: string) => {
        try {
          // Gửi request đến endpoint /auth/login với phương thức POST
          const response = await api.post<LoginResponse>('/auth/login', { email, password });
          const { token } = response.data.result; // Lấy token từ phản hồi của server
      
          // Lưu token vào AsyncStorage để sử dụng sau này
          await AsyncStorage.setItem('token', token);
          console.log('Token saved successfully:', token); // In thông báo lưu thành công
          navigation.navigate('Menu')
         
        } catch (error) {
          console.error('Login failed:', error); // In lỗi nếu đăng nhập thất bại
          ; // Trả về null để báo hiệu lỗi
        }

        
        //    for (let i = 0; i < users.length; i++) {
        //         if (email == users[i].keyInfo) {
        //             indexUser = i;
        //         }
        //     } // find index of account


        //      //handle Login
        //      if (email == '' || pwd == '') {
        //         Alert.alert('Bạn cần nhập tài khoản và mật khẩu')
        //     }
        //     else if (-1 == indexUser) {
        //         console.log({
        //             code: 1001,
        //             message: "email wrong"
        //         })
        //         Alert.alert('Tài khoản không tồn tại')
        //     }
        //     else if (pwd !== users[indexUser].password) {
        //         console.log({
        //             code: 1001,
        //             message: "password wrong"
        //         })
        //         Alert.alert('Bạn đã nhập sai mật khẩu')
        //     }
        //     else {
        //         console.log({
        //             code: 1000,
        //             message: "login successful"
        //         })
        //         if (email.startsWith('ph', 0)) {
        //             navigation.navigate('Role', { keyInfo: keyInfo, fullName: fullName, accName: accName, password: password })
        //         }
        //         else {
        //             navigation.navigate('Schedule')
        //         }

        //         setEmail('')
        //         setPassword('')
        //     }

       
       




        // const validEmail = "abc@gmail.com";
        // const validPassword = "12345678";
        // if (email !== validEmail) {
        //     return {
        //         code: 1001,
        //         message: "email wrong"
        //     };
        // }
        // if (password !== validPassword) {
        //     return {
        //         code: 1001,
        //         message: "password wrong"
        //     };
        // }
        // return {
        //     code: 1000,
        //     message: "login successful"
        // };

    };

    const handlePress = (socialMedia: string) => {
        // Xử lý logic cho đăng nhập mạng xã hội
        Alert.alert(`Đăng nhập với ${socialMedia}`);

    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email hoặc tên tài khoản"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                    value={pwd}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.checkbox}>
                <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                    <View style={styles.checkboxBackground}></View>
                    <MaterialIcons
                        name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
                <Text style={[styles.checkboxLabel, { color: 'white' }]}>Nhớ mật khẩu</Text>
            </View>
            <View style={styles.loginButton}>
                <CustomButton
                    title="Đăng nhập"
                    onPress={()=>handleLogin(email,pwd)}
                    primary
                />
            </View>
            <View style={styles.registerContainer}>
                <Text style={{ color: 'white' }}>Không có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.socialButtons}>
                {/* Thêm nút đăng nhập mạng xã hội ở đây */}
                <TouchableOpacity onPress={() => handlePress('gmail')}>
                    <Image
                        source={require('../../assets/images/gmail.png')}
                        style={{ width: 40, height: 40 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('facebook')}>
                    <Image
                        source={require('../../assets/images/facebook.png')}
                        style={{ width: 40, height: 40 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('google')}>
                    <Image
                        source={require('../../assets/images/google.png')}
                        style={{ width: 40, height: 40 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;



