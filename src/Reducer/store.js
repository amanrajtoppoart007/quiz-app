import {createStore} from 'redux';
  
import StoreReducer from './Reducer';
  
// Passing burgerReducer to createStore
const store=createStore(StoreReducer);
  
export default store;