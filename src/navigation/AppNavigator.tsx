import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotScreen from '../screens/auth/ForgotScreen';
import HomeScreen from '../screens/student/HomeScreen';
import SearchScreen from '../screens/student/SearchScreen';
import CartScreen from '../screens/student/CartScreen';
import OrdersScreen from '../screens/student/OrdersScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import CheckoutScreen from '../screens/student/CheckoutScreen';
import ConfirmationScreen from '../screens/student/ConfirmationScreen';
import TrackingScreen from '../screens/student/TrackingScreen';
import StaffDashboard from '../screens/staff/StaffDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  const { items } = useCart();
  return (
    <Tab.Navigator
      id="StudentTabs"
      screenOptions={{
        headerShown:false,
        tabBarShowLabel:true,
        tabBarStyle:{ height:68, paddingTop:5, paddingBottom:8, backgroundColor:'#FFF', borderTopWidth:1, borderTopColor:'#EEE' },
        tabBarActiveTintColor:theme.colors.primary,
        tabBarInactiveTintColor:theme.colors.textMuted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon:({color})=><Feather name="home" size={21} color={color}/>}}/>
      <Tab.Screen name="Search" component={SearchScreen} options={{tabBarIcon:({color})=><Feather name="search" size={21} color={color}/>}}/>
      <Tab.Screen name="Cart" component={CartScreen} options={{
        tabBarIcon:({color})=><View style={styles.cartIcon}><Feather name="shopping-bag" size={21} color={color}/>{items.length>0&&<Text style={styles.badge}>{items.length}</Text>}</View>
      }}/>
      <Tab.Screen name="Orders" component={OrdersScreen} options={{tabBarIcon:({color})=><Feather name="file-text" size={21} color={color}/>}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarIcon:({color})=><Feather name="user" size={21} color={color}/>}}/>
    </Tab.Navigator>
  );
}

function StudentStack() {
  return <Stack.Navigator id="StudentStack" screenOptions={{headerShown:false}}>
    <Stack.Screen name="Tabs" component={Tabs}/>
    <Stack.Screen name="Checkout" component={CheckoutScreen}/>
    <Stack.Screen name="Confirmation" component={ConfirmationScreen}/>
    <Stack.Screen name="Tracking" component={TrackingScreen}/>
  </Stack.Navigator>;
}

function AuthStack() {
  return <Stack.Navigator id="AuthStack" screenOptions={{headerShown:false}}>
    <Stack.Screen name="Login" component={LoginScreen}/>
    <Stack.Screen name="Register" component={RegisterScreen}/>
    <Stack.Screen name="Forgot" component={ForgotScreen}/>
  </Stack.Navigator>;
}

function RoleStack() {
  const { profile } = useAuth();
  if (profile?.role === 'staff') return <Stack.Navigator id="StaffStack" screenOptions={{headerShown:false}}><Stack.Screen name="Staff" component={StaffDashboard}/></Stack.Navigator>;
  if (profile?.role === 'admin') return <Stack.Navigator id="AdminStack" screenOptions={{headerShown:false}}><Stack.Screen name="Admin" component={AdminDashboard}/></Stack.Navigator>;
  return <StudentStack />;
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.loading}><Text>Loading CanteenQ…</Text></View>;
  return <NavigationContainer>{user ? <RoleStack/> : <AuthStack/>}</NavigationContainer>;
}

const styles=StyleSheet.create({
  loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:theme.colors.background},
  cartIcon:{position:'relative'},
  badge:{position:'absolute',top:-8,right:-10,minWidth:17,height:17,borderRadius:9,backgroundColor:theme.colors.primary,color:'#FFF',fontSize:10,fontWeight:'900',textAlign:'center',paddingTop:2,paddingHorizontal:3}
});
