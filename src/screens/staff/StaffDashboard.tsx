import React,{useEffect,useState}from'react';
import{Alert,FlatList,SafeAreaView,StyleSheet,Text,View}from'react-native';
import{collection,onSnapshot,doc,query,where,orderBy,updateDoc,serverTimestamp}from'firebase/firestore';
import{db}from'../../firebase/config';import{Button,ScreenHeader,EmptyState}from'../../components/UI';import{theme}from'../../theme';
const next:any={PLACED:'ACCEPTED',ACCEPTED:'PREPARING',PREPARING:'READY',READY:'COLLECTED'};
export default function StaffDashboard(){
 const[data,setData]=useState<any[]>([]);
 useEffect(()=>onSnapshot(query(collection(db,'orders'),where('status','in',['PLACED','ACCEPTED','PREPARING','READY']),orderBy('createdAt','asc')),s=>setData(s.docs.map(d=>({id:d.id,...d.data()}))),()=>{}),[]);
 const move=async(o:any)=>{const n=next[o.status];if(n)await updateDoc(doc(db,'orders',o.id),{status:n,updatedAt:serverTimestamp()})};
 const reject=async(o:any)=>{await updateDoc(doc(db,'orders',o.id),{status:'REJECTED',rejectionReason:'Rejected by canteen staff',updatedAt:serverTimestamp()});Alert.alert('Order rejected',o.tokenNumber)};
 return <SafeAreaView style={styles.container}><ScreenHeader title="Staff Queue"/>{!data.length?<EmptyState icon="check-circle" title="Queue is clear" message="New orders will appear here automatically."/>:<FlatList contentContainerStyle={styles.list} data={data} keyExtractor={x=>x.id} renderItem={({item})=><View style={styles.card}><View style={styles.row}><Text style={styles.token}>{item.tokenNumber}</Text><Text style={styles.status}>{item.status}</Text></View><Text style={styles.items}>{item.items?.map((i:any)=>`${i.name} × ${i.quantity}`).join(' • ')}</Text><Button title={next[item.status]||'Done'} onPress={()=>move(item)}/>{item.status==='PLACED'&&<Button title="Reject" onPress={()=>reject(item)} style={styles.reject}/>}</View>}/>}</SafeAreaView>
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:theme.colors.background},list:{padding:18},card:{backgroundColor:'#FFF',borderRadius:16,padding:16,marginBottom:12,elevation:2},row:{flexDirection:'row',justifyContent:'space-between'},token:{fontSize:22,fontWeight:'900',color:theme.colors.primary},status:{fontSize:11,fontWeight:'800',color:theme.colors.textSecondary},items:{fontSize:12,color:theme.colors.textSecondary,marginVertical:12},reject:{backgroundColor:'#FFEBEE'},});
