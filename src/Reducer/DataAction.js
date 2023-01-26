import {STORE_DATA,CHANGE_THEME} from '../Constant';

export const increaseBurgerAction=(parameter)=>{
    return{
        type:STORE_DATA,
        payload:parameter
    }
}

export const changeTheme=(parameter)=>{
    return{
        type:CHANGE_THEME,
        payload:parameter
    }
}