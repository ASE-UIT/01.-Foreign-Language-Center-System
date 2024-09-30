import { StyleSheet } from 'react-native';

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