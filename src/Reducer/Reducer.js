import {STORE_DATA,CHANGE_THEME} from '../Constant'

const initialState={
    darkTheme:false,
    UserData:null
}
const StoreReducer=(state=initialState,action)=>{
    switch(action.type){
        case STORE_DATA:return{
            ...state,
            UserData:action.payload
        }
        case CHANGE_THEME:return{
            ...state,
            darkTheme:action.payload
        }
        default:return state
    }
}

export default StoreReducer;