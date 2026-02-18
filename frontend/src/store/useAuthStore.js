import {create} from "zustand";
export const useAuthStore = create((set)=>({
    authUser: {name: "Kali", _id: 123, age: 23},
    isLoading: false,
    login: ()=>{
        console.log("We just logged in");
    }
}))