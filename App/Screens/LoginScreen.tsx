import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import CustomButton from '../Components/CustomButton';
import { styles } from '../Styles/globaStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';



const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [email, setEmail] = useState('');
    const [pwd, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleLogin = () => {
        for (let i = 0; i < users.length; i++) {
            if (email == users[i].keyInfo && password == users[i].password
                && email.startsWith('ph')) {
                navigation.navigate('Role', { keyInfo: keyInfo, fullName: fullName, accName: accName, password: password })
            }
        } // check Parent Role


        const validEmail = "abc@gmail.com";
        const validPassword = "12345678";
        if (email !== validEmail) {
            return {
                code: 1001,
                message: "email wrong"
            };
        }
        if (password !== validPassword) {
            return {
                code: 1001,
                message: "password wrong"
            };
        }
        return {
            code: 1000,
            message: "login successful"
        };

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
                    onPress={handleLogin}
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



