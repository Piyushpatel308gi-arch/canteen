import React,{createContext,useContext,useMemo,useState} from "react";
import { CartItem, Food } from "../types";

type Ctx={items:CartItem[];add:(f:Food)=>void;remove:(id:string)=>void;change:(id:string,d:number)=>void;clear:()=>void;total:number};
const CartContext=createContext<Ctx>({} as Ctx);

export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<CartItem[]>([]);
 const add=(f:Food)=>setItems(a=>{const x=a.find(i=>i.id===f.id);return x?a.map(i=>i.id===f.id?{...i,quantity:i.quantity+1}:i):[...a,{...f,quantity:1}]});
 const remove=(id:string)=>setItems(a=>a.filter(i=>i.id!==id));
 const change=(id:string,d:number)=>setItems(a=>a.map(i=>i.id===id?{...i,quantity:Math.max(1,i.quantity+d)}:i));
 const clear=()=>setItems([]);
 const total=useMemo(()=>items.reduce((s,i)=>s+i.price*i.quantity,0),[items]);
 return <CartContext.Provider value={{items,add,remove,change,clear,total}}>{children}</CartContext.Provider>
}
export const useCart=()=>useContext(CartContext);
