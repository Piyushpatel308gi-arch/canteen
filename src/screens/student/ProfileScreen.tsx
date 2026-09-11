import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ProfileMenuItem } from '../../components/UI';
import { theme } from '../../theme';

export default function ProfileScreen({navigation}:any){
 const{profile,logout}=useAuth();
 const name=profile?.name||'Student'; const email=profile?.email||'';
 return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
  <View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text></View><View style={{flex:1}}><Text style={styles.name}>{name}</Text><Text style={styles.email}>{email}</Text>{profile?.studentId?<Text style={styles.id}>Student ID: {profile.studentId}</Text>:null}</View></View>
  <View style={styles.stats}><View><Text style={styles.statValue}>CanteenQ</Text><Text style={styles.statLabel}>Student Account</Text></View><Feather name="check-circle" size={24} color={theme.colors.successDot}/></View>
  <View style={styles.menu}><ProfileMenuItem iconName="shopping-bag" label="My Orders" onPress={()=>navigation.navigate('Orders')}/><ProfileMenuItem iconName="user" label="Personal Information" onPress={()=>Alert.alert('Profile',`${name}\n${email}`)}/><ProfileMenuItem iconName="coffee" label="My Canteen" extraText="Main Campus" onPress={()=>{}}/><ProfileMenuItem iconName="help-circle" label="Help & Support" onPress={()=>Alert.alert('Help','For support, contact your canteen administrator.')}/><ProfileMenuItem iconName="log-out" label="Logout" danger onPress={()=>Alert.alert('Logout','Are you sure?', [{text:'Cancel',style:'cancel'},{text:'Logout',style:'destructive',onPress:logout}])}/></View>
 </ScrollView></SafeAreaView>
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:theme.colors.background},content:{padding:20},profile:{flexDirection:'row',alignItems:'center',gap:15,marginTop:10},avatar:{width:72,height:72,borderRadius:36,backgroundColor:theme.colors.primaryLight,alignItems:'center',justifyContent:'center'},avatarText:{fontSize:30,fontWeight:'900',color:theme.colors.primary},name:{fontSize:20,fontWeight:'900'},email:{fontSize:12,color:theme.colors.textSecondary,marginTop:3},id:{fontSize:11,color:theme.colors.textMuted,marginTop:5},stats:{backgroundColor:'#FFF',borderRadius:16,padding:18,marginTop:22,flexDirection:'row',justifyContent:'space-between',alignItems:'center',elevation:2},statValue:{fontSize:16,fontWeight:'900'},statLabel:{fontSize:11,color:theme.colors.textMuted,marginTop:2},menu:{backgroundColor:'#FFF',borderRadius:16,paddingHorizontal:16,marginTop:18,elevation:2}});
