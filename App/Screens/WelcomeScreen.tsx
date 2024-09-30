import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import CustomButton from '../Components/CustomButton';
import { styles, welcomeStyles } from '../Styles/globaStyles';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
    navigation: WelcomeScreenNavigationProp;
};



const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/welcomeImage.png')}
                style={styles.welcomeImage}
            />
            <Text style={styles.title}>Hãy đăng nhập để bắt đầu</Text>
            <Text style={styles.subtitle}>Cùng trải nghiệm những tính năng tuyệt vời của ứng dụng</Text>

            {/* covering CustomButton by View to design */}
            <View style={welcomeStyles.logginButton}>
                <CustomButton
                    title="Đăng nhập"
                    onPress={() => navigation.navigate('Login')}
                    primary
                />
            </View>
            <View style={welcomeStyles.registerButton}>
                <CustomButton
                    title="Đăng ký"
                    onPress={() => navigation.navigate('Register')}
                    secondary
                />
            </View>

        </View>
    );
};

export default WelcomeScreen;