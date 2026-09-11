import React,{createContext,useContext,useEffect,useState}from'react';
import{onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,sendPasswordResetEmail,User}from'firebase/auth';
import{doc,getDoc,serverTimestamp,setDoc}from'firebase/firestore';import{auth,db}from'../firebase/config';
type Profile={name:string;email:string;studentId:string;role:'student'|'staff'|'admin';isActive:boolean};
type Ctx={user:User|null;profile:Profile|null;loading:boolean;login:(e:string,p:string)=>Promise<void>;register:(n:string,e:string,p:string,s:string)=>Promise<void>;logout:()=>Promise<void>;reset:(e:string)=>Promise<void>};
const AuthContext=createContext<Ctx>({} as Ctx);
export function AuthProvider({children}:{children:React.ReactNode}){
 const[user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<Profile|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u);try{if(u){const snap=await getDoc(doc(db,'users',u.uid));setProfile(snap.exists()?snap.data() as Profile:{name:u.displayName||'Student',email:u.email||'',studentId:'',role:'student',isActive:true});}else setProfile(null);}finally{setLoading(false);}},()=>setLoading(false)),[]);
 const login=async(e:string,p:string)=>{await signInWithEmailAndPassword(auth,e.trim(),p);};
 const register=async(n:string,e:string,p:string,s:string)=>{const cred=await createUserWithEmailAndPassword(auth,e.trim(),p);await setDoc(doc(db,'users',cred.user.uid),{name:n.trim(),email:e.trim(),studentId:s.trim(),role:'student',isActive:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()})};
 const logout=()=>signOut(auth);const reset=(e:string)=>sendPasswordResetEmail(auth,e.trim());
 return <AuthContext.Provider value={{user,profile,loading,login,register,logout,reset}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
