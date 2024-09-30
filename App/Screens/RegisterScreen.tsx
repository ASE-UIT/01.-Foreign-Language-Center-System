import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../Styles/globaStyles';
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../Components/CustomButton';




const RegisterScreen: React.FC = () => {
  const navigation: StackNavigationProp<RootStackParamList> = useNavigation();
  const [keyInfo, setKey] = useState('');
  const [fullName, setFullName] = useState('');
  const [accName, setAccName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
 
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () =>{
    Keyboard.dismiss
    navigation.navigate('Login',{keyInfo: keyInfo,fullName: fullName,accName: accName,password:password})
    setKey('')
    setFullName('')
    setAccName('')
    setPassword('')
    setRePassword('')
  }

  const handlePress = (socialMedia: string) => {
    // Xử lý logic cho đăng nhập mạng xã hội
    alert(`Đăng nhập với ${socialMedia}`);

  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email hoặc tên tài khoản"
        value={keyInfo}
        onChangeText={setKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên tài khoản"
        value={accName}
        onChangeText={setAccName}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showPassword}
          value={rePassword}
          onChangeText={setRePassword}
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

      <View style={styles.loginButton}>
        <CustomButton
          title="Đăng ký"
          onPress={()=>handleRegister()}
          primary
        />
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
  )
}

export default RegisterScreen
