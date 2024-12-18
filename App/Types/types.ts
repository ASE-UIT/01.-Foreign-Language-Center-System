// export type RootStackParamList = {
//   Welcome: undefined;
//   Login: undefined | userInfo; // set for passing param
//   Register: undefined; // add RegisterScreen
//   Role: undefined | userInfo; // add RoleScreen
//   Menu: undefined
//   Schedule:undefined,
//   Profile: undefined,
//   Notification: undefined,
//   Class:undefined,
//   Course:undefined,
// };

export type userInfo = {
    keyInfo?: string,
    fullName?: string,
    accName?: string,
    password?: string,
  } // set a type to handle register and log in

