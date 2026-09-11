import React,{useState} from "react";
import {Alert,Text,View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {Button,Field,styles} from "../../components/UI";
import {theme} from "../../theme";

export default function RegisterScreen({navigation}:any){
 const {register}=useAuth(); const [name,setName]=useState(""),[email,setEmail]=useState(""),[pass,setPass]=useState(""),[confirm,setConfirm]=useState(""),[sid,setSid]=useState(""),[busy,setBusy]=useState(false);
 const submit=async()=>{if(!name||!email||!pass||!confirm||!sid)return Alert.alert("Missing fields","Please complete every field.");if(pass!==confirm)return Alert.alert("Password mismatch","Passwords do not match.");if(pass.length<6)return Alert.alert("Weak password","Use at least 6 characters.");try{setBusy(true);await register(name,email,pass,sid)}catch(e:any){Alert.alert("Registration failed",e?.message||"Please try again.")}finally{setBusy(false)}};
 return <View style={{flex:1,padding:22,backgroundColor:theme.colors.background,justifyContent:"center"}}><Text style={styles.title}>Create your account</Text><Text style={styles.subtitle}>Use your college details.</Text><View style={{height:20}}/>
 <Field placeholder="Full name" value={name} onChangeText={setName}/><Field placeholder="College email" value={email} onChangeText={setEmail} autoCapitalize="none"/><Field placeholder="Student ID / Roll number" value={sid} onChangeText={setSid}/><Field placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry/><Field placeholder="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry/><Button title={busy?"Creating…":"Create Account"} onPress={submit} disabled={busy}/></View>
}