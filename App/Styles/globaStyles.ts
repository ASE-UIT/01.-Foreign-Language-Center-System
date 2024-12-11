import { StyleSheet } from 'react-native';
import { ReloadInstructions } from 'react-native/Libraries/NewAppScreen';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeImage: {
    marginTop:30,
    width: 290,
    height: 290,
    borderRadius: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#Ffc000',
    marginBottom: 10,
    textAlign: 'left',
    width: 314,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'left',
    width: 314,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 13,
    borderRadius: 13,
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  orText: {
    marginHorizontal: 10,
    color: '#FFFFFF',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  registerLink: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  //LoginScreen
  checkboxLabel: {
    marginLeft: 8,         
    color: '#FFFFFF',        
    fontSize: 16,         
  },
  checkboxBackground: {
    backgroundColor: 'white',  
    borderRadius: 4,           
  },
  loginButton: {
    backgroundColor: '#ffc000',
    width: '100%',
    height: 60,
    borderRadius: 60,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerContainer: {
    flexDirection: 'row',       
    justifyContent: 'center',   
    alignItems: 'center',     
    marginTop: 10,              
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 3,
    height: 2,
    backgroundColor: '#FFF',
    opacity: 1,
  },
  passwordContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: 10, 
    padding: 10,
},
});

// styles for button in WelcomeScreen
export const welcomeStyles = StyleSheet.create({
  logginButton: {
    width: 318,
    height: 60,
    borderRadius: 60,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 30,

  },
  registerButton: {
    backgroundColor: '#ffc000',
    width: 318,
    height: 60,
    borderRadius: 60,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  }

  
})

export const studenthomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '##fcfbfe',
  },
  header: {   
    backgroundColor: '#0000FF',
    padding: 20,
    paddingTop: 30,
    width: '100%',
    borderRadius: 11,
  },
  avatar: {
    width: 40,        
    height: 40,       
    borderRadius: 20, 
    marginTop: -20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#5874e4',
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
    fontSize: 16,
    paddingLeft: 40,
  },
  filter: {
    backgroundColor: '#5874e4', 
    padding: 10, 
    marginLeft: 10, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: 49,
    height: 49,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    paddingLeft: 20,
  },
  horizontalItem: {
    marginRight: 5,
    width: 230,
    marginLeft:20,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  languageImage: {
    width: '100%',
    height: 120,
  },
  languageText: {
    fontSize: 16,
    marginVertical: 8,
    marginLeft: 10,
    marginBottom: 60,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 2,       
    left: 10,
    right: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  instructorText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 14,
  },
  verticalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingLeft: 20,
  },
  coureImage: {
    width: 65,
    height: 65,
    marginRight: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  startDate: {
    fontSize: 14,
    color: '#666',
  },
  seeAllButton: {
    backgroundColor: '#d4dae3',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    height: 33,
  },
  seeAllText: {
    color: '#0000FF',
    fontSize: 13,
  },
  menu: {
    position: 'absolute',
    top: 90, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    padding: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
});