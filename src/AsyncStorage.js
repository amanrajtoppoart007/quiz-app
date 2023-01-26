import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (name,value) => {
  
    try {
      await AsyncStorage.setItem(name, value)
      console.log(value)
      return {status:true, msg : "Data entered"}
    } catch (e) {
        // saving error
        return {status:false,data:"Something went wrong"}
    }
    
}

export const getData = async (name) => {
  try {
    const value = await AsyncStorage.getItem(name)
   
    if(value !== null) {
     
      return {status:true, data:value}
    }
  } catch(e) {
    // error reading value
    return {status:false, data:"Not working"}
  }
}
