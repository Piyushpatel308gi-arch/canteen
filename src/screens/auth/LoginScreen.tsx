import React,{useState} from "react";
import {Alert, Text, View} from "react-native";
import {useAuth} from "../../context/AuthContext";
import {Button,Field,styles} from "../../components/UI";
import {theme} from "../../theme";

export default function LoginScreen({navigation}:any){
 const {login}=useAuth(); const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [busy,setBusy]=useState(false);
 const submit=async()=>{try{setBusy(true);await login(email,pass)}catch(e:any){Alert.alert("Login failed",e?.message||"Please check your details.")}finally{setBusy(false)}};
 return <View style={{flex:1,padding:24,justifyContent:"center",backgroundColor:theme.colors.background}}>
  <Text style={{fontSize:42,fontWeight:"900",color:theme.colors.primary}}>CanteenQ</Text><Text style={styles.subtitle}>Order. Token. Collect.</Text>
  <View style={{height:30}}/><Text style={styles.title}>Welcome back</Text>
  <Field placeholder="College email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
  <Field placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry/>
  <Button title={busy?"Signing in…":"Login"} onPress={submit} disabled={busy}/>
  <Button title="Create Account" onPress={()=>navigation.navigate("Register")}/>
  <Text onPress={()=>navigation.navigate("Forgot")} style={{textAlign:"center",marginTop:12,color:theme.colors.primary,fontWeight:"700"}}>Forgot password?</Text>
 </View>
}