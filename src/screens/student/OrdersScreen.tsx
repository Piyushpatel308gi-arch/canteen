import React,{useEffect,useState}from'react';
import{ActivityIndicator,FlatList,SafeAreaView,StyleSheet,Text,TouchableOpacity,View}from'react-native';
import{collection,onSnapshot,orderBy,query,where}from'firebase/firestore';
import{db}from'../../firebase/config';
import{useAuth}from'../../context/AuthContext';
import{EmptyState,ScreenHeader}from'../../components/UI';
import{Order}from'../../types';
import{theme}from'../../theme';

export default function OrdersScreen({navigation}:any){
 const{user}=useAuth();const[data,setData]=useState<Order[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{if(!user){setLoading(false);return} return onSnapshot(query(collection(db,'orders'),where('userId','==',user.uid),orderBy('createdAt','desc')),s=>{setData(s.docs.map(d=>({id:d.id,...d.data()} as Order)));setLoading(false)},()=>setLoading(false));},[user]);
 if(loading)return <View style={styles.center}><ActivityIndicator color={theme.colors.primary}/><Text>Loading orders…</Text></View>;
 return <SafeAreaView style={styles.container}><ScreenHeader title="My Orders"/>{!data.length?<EmptyState icon="file-text" title="No orders yet" message="Your completed and active orders will appear here."/>:<FlatList contentContainerStyle={styles.list} data={data} keyExtractor={x=>x.id} renderItem={({item})=><TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('Tracking',{orderId:item.id})}><View style={styles.row}><Text style={styles.token}>#{item.tokenNumber}</Text><View style={[styles.badge,{backgroundColor:item.status==='READY'?theme.colors.successBg:theme.colors.primaryLight}]}><Text style={styles.badgeText}>{item.status}</Text></View></View><Text style={styles.items} numberOfLines={2}>{item.items?.map(i=>`${i.name} × ${i.quantity}`).join(' • ')}</Text><View style={styles.row}><Text style={styles.date}>Pay at counter</Text><Text style={styles.total}>₹{item.totalAmount}</Text></View></TouchableOpacity>} />}</SafeAreaView>
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:theme.colors.background},list:{padding:20},card:{backgroundColor:'#FFF',borderRadius:16,padding:16,marginBottom:12,elevation:2},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},token:{fontSize:20,fontWeight:'900',color:theme.colors.primary},badge:{paddingHorizontal:9,paddingVertical:5,borderRadius:10},badgeText:{fontSize:10,fontWeight:'800',color:theme.colors.textPrimary},items:{fontSize:12,color:theme.colors.textSecondary,marginVertical:12},date:{fontSize:11,color:theme.colors.textMuted},total:{fontSize:17,fontWeight:'900'},center:{flex:1,justifyContent:'center',alignItems:'center',gap:10,backgroundColor:theme.colors.background}});
