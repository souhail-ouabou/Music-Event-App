import { createContext,useState,useEffect } from "react";
import {useRouter} from 'next/router'
import { API_URL } from "@/config/index";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState()
    const [error,setError] = useState(null)

    //Register User 

    const register = async(user) =>{
        console.log(user);
    }

    //Login User
    
    const login = async({email:identifier,password}) =>{
        console.log({identifier, password});
    }

    //Logout User
    const logout = async() =>{
        console.log("Logout");
    }
    //Check if user is logged in
    const checkUserLoggedIn = async(user) =>{
        console.log("Check");
    }

    return (
        <AuthContext.Provider value={{user,error,register,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext
