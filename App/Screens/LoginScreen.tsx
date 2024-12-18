import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomButton from '../Components/CustomButton';
import { styles } from '../Styles/globaStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { ApiResponse, LoginResponse } from '../../api/apiResponse';
import { userInfo } from '../Types/types';
import { LoginRequest } from '../../api/apiRequest';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [email, setEmail] = useState('');
    const [pwd, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    let loginReq: LoginRequest = { email: email, password: pwd }

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

    const handleLogin = async () => {
        try {
            // Gửi request đến endpoint /auth/login với phương thức POST
            const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', loginReq);
            const { token } = response.data.result; // Lấy token từ phản hồi của server

            // Lưu token vào AsyncStorage để sử dụng sau này
            await AsyncStorage.setItem('token', token);
            console.log('Token saved successfully:', token); // In thông báo lưu thành công

            if (response.data.result.child == null || response.data.result.child.length < 1) {
                navigation.navigate('Menu')

            }
            else {
                navigation.navigate('Role', { keyInfo: keyInfo, fullName: fullName, accName: accName, password: password })
            }

        } catch (error) {
            console.error('Login failed:', error); // In lỗi nếu đăng nhập thất bại
        }
    };

    const handlePress = (socialMedia: string) => {
        // Xử lý logic cho đăng nhập mạng xã hội
        Alert.alert(`Đăng nhập với ${socialMedia}`)
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
                    onPress={() => handleLogin()}
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



