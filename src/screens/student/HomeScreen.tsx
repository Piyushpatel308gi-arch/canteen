import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Food } from '../../types';
import { useCart } from '../../context/CartContext';
import { FoodCard } from '../../components/UI';
import { theme } from '../../theme';

const demoFoods: Food[] = [
  {id:'demo-noodles',name:'Veg Noodles',description:'Hot wok-tossed noodles with fresh vegetables.',price:59,categoryId:'Snacks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600'},
  {id:'demo-pizza',name:'Margherita Pizza',description:'Classic cheese, tomato and herbs.',price:89,categoryId:'Meals',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600'},
  {id:'demo-sandwich',name:'Veg Sandwich',description:'Grilled sandwich with crisp vegetables.',price:49,categoryId:'Snacks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600'},
  {id:'demo-cold',name:'Cold Coffee',description:'Creamy chilled coffee.',price:45,categoryId:'Drinks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600'},
];

export default function HomeScreen({navigation}:any) {
  const [foods,setFoods]=useState<Food[]>(demoFoods);
  const [category,setCategory]=useState('All');
  const [search,setSearch]=useState('');
  const {add,items}=useCart();

  useEffect(()=> {
    return onSnapshot(collection(db,'food_items'), snap=>{
      const remote=snap.docs.map(d=>({id:d.id,...d.data()} as Food));
      if(remote.length) setFoods(remote);
    }, ()=>{});
  },[]);

  const categories=['All','Meals','Snacks','Drinks','Healthy'];
  const filtered=useMemo(()=>foods.filter(f=>
    (category==='All'||f.categoryId===category) &&
    f.name.toLowerCase().includes(search.trim().toLowerCase())
  ),[foods,category,search]);

  const addFood=(f:Food)=>{ add(f); Alert.alert('Added to cart',`${f.name} was added.`); };

  return <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View><Text style={styles.brand}>CanteenQ</Text><Text style={styles.tagline}>Good Food, Better Days.</Text></View>
        <TouchableOpacity><Feather name="bell" size={22} color="#222"/></TouchableOpacity>
      </View>
      <View style={styles.location}><View style={styles.locationLeft}><Ionicons name="storefront-outline" size={17} color="#555"/><Text style={styles.locationText}>Main Campus Canteen</Text></View><View style={styles.open}><View style={styles.dot}/><Text style={styles.openText}>Open</Text></View></View>
      <Text style={styles.title}>Hungry?</Text><Text style={styles.subtitle}>Order from your canteen.</Text>
      <View style={styles.search}><Feather name="search" size={19} color="#999"/><TextInput value={search} onChangeText={setSearch} placeholder="Search food, drinks, snacks…" placeholderTextColor="#999" style={styles.searchInput}/>{search.length>0&&<TouchableOpacity onPress={()=>setSearch('')}><Feather name="x-circle" size={18} color="#999"/></TouchableOpacity>}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>{categories.map(c=><TouchableOpacity key={c} onPress={()=>setCategory(c)} style={styles.category}><View style={[styles.catIcon,category===c&&styles.catActive]}><Text style={styles.emoji}>{c==='All'?'🍽️':c==='Meals'?'🍲':c==='Snacks'?'🍟':c==='Drinks'?'🥤':'🥗'}</Text></View><Text style={[styles.catText,category===c&&styles.catTextActive]}>{c}</Text></TouchableOpacity>)}</ScrollView>
      <View style={styles.banner}><View style={{flex:1}}><Text style={styles.bannerTitle}>Student{'\n'}Favorites</Text><Text style={styles.bannerSub}>Tasty, affordable, always.</Text><TouchableOpacity onPress={()=>setCategory('All')} style={styles.orderBtn}><Text style={styles.orderBtnText}>Order Now →</Text></TouchableOpacity></View><Image source={{uri:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'}} style={styles.bannerImage}/></View>
      <View style={styles.section}><Text style={styles.sectionTitle}>{search||category!=='All'?'Food Menu':'Popular Today'}</Text><Text style={styles.count}>{items.length} in cart</Text></View>
      {filtered.length ? <View style={styles.grid}>{filtered.map(f=><FoodCard key={f.id} item={f} quantity={items.find(i=>i.id===f.id)?.quantity||0} onAdd={()=>addFood(f)}/>)}</View> : <Text style={styles.noResults}>No food found.</Text>}
    </ScrollView>
  </SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:theme.colors.background},content:{padding:20,paddingBottom:30},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},brand:{fontSize:22,fontWeight:'900',color:theme.colors.textPrimary},tagline:{fontSize:11,color:theme.colors.textSecondary,marginTop:2},location:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:17},locationLeft:{flexDirection:'row',alignItems:'center',gap:7},locationText:{fontSize:13,fontWeight:'700'},open:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:theme.colors.successBg,paddingHorizontal:9,paddingVertical:5,borderRadius:12},dot:{width:6,height:6,borderRadius:3,backgroundColor:theme.colors.successDot},openText:{fontSize:11,fontWeight:'700',color:theme.colors.successText},title:{fontSize:30,fontWeight:'900'},subtitle:{fontSize:15,color:theme.colors.textMuted,marginBottom:15},search:{height:46,borderRadius:13,backgroundColor:'#F2F2F2',flexDirection:'row',alignItems:'center',paddingHorizontal:13,gap:9},searchInput:{flex:1,fontSize:14,color:'#222'},categories:{marginVertical:18},category:{alignItems:'center',marginRight:18},catIcon:{width:52,height:52,borderRadius:26,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center',elevation:2},catActive:{backgroundColor:theme.colors.primaryLight},emoji:{fontSize:22},catText:{fontSize:11,color:theme.colors.textSecondary,marginTop:6},catTextActive:{color:theme.colors.primary,fontWeight:'800'},banner:{backgroundColor:theme.colors.primaryLight,borderRadius:20,padding:18,flexDirection:'row',alignItems:'center'},bannerTitle:{fontSize:22,fontWeight:'900',lineHeight:25},bannerSub:{fontSize:11,color:theme.colors.textSecondary,marginVertical:7},orderBtn:{alignSelf:'flex-start',backgroundColor:theme.colors.primary,paddingHorizontal:14,paddingVertical:8,borderRadius:18},orderBtnText:{color:'#FFF',fontSize:11,fontWeight:'800'},bannerImage:{width:105,height:105,borderRadius:53,marginLeft:10},section:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:23,marginBottom:12},sectionTitle:{fontSize:18,fontWeight:'900'},count:{fontSize:11,color:theme.colors.textMuted},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},noResults:{textAlign:'center',color:theme.colors.textSecondary,padding:30}
});
