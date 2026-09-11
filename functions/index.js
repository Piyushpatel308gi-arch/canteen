const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getFirestore,FieldValue}=require("firebase-admin/firestore");
initializeApp();
const db=getFirestore();

exports.createOrder=onCall(async request=>{
  if(!request.auth) throw new HttpsError("unauthenticated","Login required.");
  const uid=request.auth.uid;
  const items=request.data?.items;
  if(!Array.isArray(items)||!items.length) throw new HttpsError("invalid-argument","Cart is empty.");
  if(items.some(x=>!x.foodId||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>50))
    throw new HttpsError("invalid-argument","Invalid cart.");

  const dateKey=new Date().toISOString().slice(0,10);
  const counterRef=db.doc(`tokenCounters/${dateKey}`);
  const orderRef=db.collection("orders").doc();

  const result=await db.runTransaction(async tx=>{
    const counterSnap=await tx.get(counterRef);
    const next=(counterSnap.exists?(counterSnap.data().lastNumber||0):0)+1;
    const foods=[];
    let total=0;

    for(const item of items){
      const foodRef=db.doc(`food_items/${item.foodId}`);
      const snap=await tx.get(foodRef);
      if(!snap.exists) throw new HttpsError("not-found","Food item not found.");
      const f=snap.data();
      if(!f.isAvailable) throw new HttpsError("failed-precondition",`${f.name} is unavailable.`);
      const subtotal=Number(f.price)*item.quantity;
      foods.push({foodId:item.foodId,name:f.name,quantity:item.quantity,unitPrice:Number(f.price),subtotal});
      total+=subtotal;
    }

    const token=`CQ${String(next).padStart(3,"0")}`;
    const order={
      userId:uid,tokenNumber:token,items:foods,totalAmount:total,
      status:"PLACED",paymentMethod:"PAY_AT_COUNTER",
      createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()
    };
    tx.set(counterRef,{lastNumber:next,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    tx.create(orderRef,order);
    return {orderId:orderRef.id,tokenNumber:token,totalAmount:total};
  });

  return result;
});