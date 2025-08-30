
import axios from 'axios';
import { apiBaseUrl } from "../constants";
import type { LoginData } from '../types/login';

const login = async(credentials: LoginData) => {
    const response = await axios.post(`${apiBaseUrl}/login`,credentials)
    //console.log(response.data)
    return response.data //it returns user info such as email, name and token
    
}

export default {login}