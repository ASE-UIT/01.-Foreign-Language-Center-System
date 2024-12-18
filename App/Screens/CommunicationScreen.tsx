import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RootStackParamList } from '../Navigation/AppNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import hambuger_icon from '../../assets/images/hamburger_icon.png'
import { DrawerNavigationProp } from '@react-navigation/drawer';

type Props = {
  navigation: DrawerNavigationProp<RootStackParamList>;
};

interface Message {
  id: number;
  user: string;
  text: string;
  avatar: string;
  isMyMessage: boolean; // Thêm cờ này để phân biệt tin nhắn của bạn
}

const CommunicationScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Mỹ Quế Lan', text: 'Chào mọi người!', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRgYNp-h_OpblgF3_otEhv3srb85cOJE-Ue60wTpD5iW-DBgai', isMyMessage: false },
    { id: 2, user: 'Mỹ Quế Lan', text: 'Hôm nay chúng ta sẽ học nhóm về chủ đề thiên nhiên', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRgYNp-h_OpblgF3_otEhv3srb85cOJE-Ue60wTpD5iW-DBgai', isMyMessage: false },
    { id: 3, user: 'You', text: 'Chào mọi người!', avatar: 'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/285784312_753896646025777_4701541195413699856_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbhCDXv0o-_rEJJf2qR5R7605isYPfh8DrTmKxg9-HwME51aYNu2LmSo4ax3JwjaZAukOl8IkI-z7B9kgdGXZ8&_nc_ohc=GIYJKpozh-EQ7kNvgF4zMMa&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&oh=00_AYBr_buNPZecIOXRn3GlPZtTjQHuP7WhTODO8fuzTdwbOw&oe=67012E51', isMyMessage: true },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newId = messages.length + 1;
      const newMsg = { 
        id: newId, 
        user: 'You', 
        text: newMessage, 
        avatar: 'https://scontent.fsgn5-1.fna.fbcdn.net/v/t39.30808-6/285784312_753896646025777_4701541195413699856_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbhCDXv0o-_rEJJf2qR5R7605isYPfh8DrTmKxg9-HwME51aYNu2LmSo4ax3JwjaZAukOl8IkI-z7B9kgdGXZ8&_nc_ohc=GIYJKpozh-EQ7kNvgF4zMMa&_nc_zt=23&_nc_ht=scontent.fsgn5-1.fna&oh=00_AYBr_buNPZecIOXRn3GlPZtTjQHuP7WhTODO8fuzTdwbOw&oe=67012E51',
        isMyMessage: true // Đánh dấu đây là tin nhắn của bạn
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      communicationStyles.messageContainer, 
      item.isMyMessage ? communicationStyles.myMessageContainer : communicationStyles.otherMessageContainer]}>
      <Image source={{ uri: item.avatar }} style={communicationStyles.avatar} />
      <View style={communicationStyles.messageContentContainer}>
      <Text style={communicationStyles.userName}>{item.user}</Text> 
      <View style={item.isMyMessage ? communicationStyles.myMessage : communicationStyles.otherMessage}>
        <Text style={item.isMyMessage ? communicationStyles.myText : communicationStyles.otherText}>
          {item.text}
        </Text>
      </View>
    </View>
    </View>
  );

  return (
    <View style={communicationStyles.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image source={hambuger_icon} style={{ marginTop: 40, marginLeft: 20}} />

      </TouchableOpacity>
      <View style={communicationStyles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={communicationStyles.title}>Tiếng Anh giao tiếp cơ bản - Mỹ Quế Lan</Text>
      </View>
      
      <View style={communicationStyles.bordercontainer}>
      {/* Khung chat với đường viền */}
      <View style={communicationStyles.chatBox}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={communicationStyles.messageList}
        />
      </View>

      {/* Ô chọn người nhận */}
      <View style={communicationStyles.receiverContainer}>
        <Text>To:</Text>
        <TouchableOpacity style={communicationStyles.receiverDropdown}>
          <Text style={communicationStyles.receiverText}>Everyone </Text>
          <Image source={require('../../assets/images/down-arrow.png')} style={{ width: 13, height: 13}} />
        </TouchableOpacity>
      </View>

      {/* Khung nhập liệu */}
      <View style={communicationStyles.inputContainer}>
        
          <TextInput
            style={communicationStyles.input}
            placeholder="Type message here..."
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
          />
          <TouchableOpacity style={communicationStyles.sendIcon} onPress={sendMessage}>
            <MaterialIcons name="send" size={24} color="#007BFF" />
          </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const communicationStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:5,
    marginTop: 5,
    marginBottom: 10,
  },
  title: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bordercontainer: {
    flex:1,
    borderWidth: 2,
    borderColor: '#444444',
    borderRadius: 10,
  },
  chatBox: {
    flex: 1,
    borderBottomWidth: 2, 
    borderBottomColor: '#444444',
    padding: 10,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContentContainer: {
    flex: 1,
    maxWidth: '85%',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  myMessageContainer: {
    alignSelf: 'flex-start',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  myMessage: {
    borderRadius: 8,
    paddingVertical:4,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
    backgroundColor: '#0000FF', 
  },
  otherMessage: {
    borderRadius: 8,
    paddingVertical:4,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
    backgroundColor: '#dddddd',
  },
  myText: {
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  otherText: {
    fontWeight: 'bold',
    color: '#000000', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    marginHorizontal: 5
  },
  input: {
    width: '100%',
    borderRadius: 20,
    padding: 5,
    paddingRight: 35,
    backgroundColor: '#F0F0F0',
  },
  sendIcon: {
    position: 'absolute',
    right: 5, // Vị trí icon nằm bên trong bên phải
    padding: 10,
  },
  receiverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  receiverDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000FF',
    marginLeft: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  receiverText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CommunicationScreen;
