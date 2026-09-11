import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Food } from '../../types';
import { useCart } from '../../context/CartContext';
import { theme } from '../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const demoFoods: Food[] = [
  {id:'demo-noodles',name:'Veg Noodles',description:'Hot wok-tossed noodles with fresh vegetables.',price:59,categoryId:'Snacks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600'},
  {id:'demo-pizza',name:'Margherita Pizza',description:'Classic cheese, tomato and herbs.',price:89,categoryId:'Meals',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600'},
  {id:'demo-sandwich',name:'Veg Sandwich',description:'Grilled sandwich with crisp vegetables.',price:49,categoryId:'Snacks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600'},
  {id:'demo-cold',name:'Cold Coffee',description:'Creamy chilled coffee.',price:45,categoryId:'Drinks',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600'},
  {id:'demo-pure',name:'Pure Veg Bowl',description:'Fresh organic greens, paneer and roasted veggies.',price:99,categoryId:'Pure Meals',isAvailable:true,imageUrl:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600'},
];

const placeholders = [
  "Create your own meal now...",
  "Hungry? Place your order..."
];

const categoryList = [
  { id: 'All', label: 'All', emoji: '🍽️' },
  { id: 'Meals', label: 'Meals', emoji: '🍲' },
  { id: 'Snacks', label: 'Snacks', emoji: '🍟' },
  { id: 'Drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'Pure Meals', label: 'Pure Meals', emoji: '🥗' },
];

interface AnimatedCategoryProps {
  id: string;
  label: string;
  emoji: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function AnimatedCategoryOption({ id, label, emoji, isSelected, onSelect }: AnimatedCategoryProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Selected item continuous breathing pulse
  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isSelected) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => loop?.stop();
  }, [isSelected, pulseAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1.25, friction: 3, tension: 40, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]),
    ]).start();

    onSelect(id);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-10deg'],
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.categoryOption}>
      <Animated.View
        style={[
          styles.catIconContainer,
          isSelected && styles.catIconSelected,
          {
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: spin },
            ],
          },
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </Animated.View>
      <Text style={[styles.catText, isSelected && styles.catTextActive]}>{label}</Text>
      {isSelected && <View style={styles.activeDotIndicator} />}
    </TouchableOpacity>
  );
}

// Zepto-Style Animated Product Card Component
function ZeptoFoodCard({ item, quantity, onAdd, onRemove, onChange, index }: any) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacityAnim, scaleAnim]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const triggerBtnPulse = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 1.18, duration: 110, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const originalPrice = Math.round(Number(item.price) * 1.25);

  return (
    <Animated.View
      style={[
        styles.zeptoCardWrap,
        {
          opacity: opacityAnim,
          transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.zeptoCard}
      >
        {/* Product Image & Badges */}
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.imageUrl || item.image }} style={styles.cardImage} />

          {/* ETA Badge */}
          <View style={styles.etaBadge}>
            <Text style={styles.etaBadgeText}>⏱️ 10 MINS</Text>
          </View>

          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>20% OFF</Text>
          </View>

          {!item.isAvailable && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.cardContent}>
          <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>

          {/* Pricing & Add / Stepper Button */}
          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.finalPrice}>₹{Number(item.price).toFixed(0)}</Text>
              <Text style={styles.strikePrice}>₹{originalPrice}</Text>
            </View>

            {/* Zepto Style ADD Button / Stepper */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              {quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addBtnOutline}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerBtnPulse();
                    onAdd(item);
                  }}
                  disabled={!item.isAvailable}
                >
                  <Text style={styles.addBtnText}>ADD</Text>
                  <Feather name="plus" size={13} color={theme.colors.primary} style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              ) : (
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => {
                      triggerBtnPulse();
                      if (quantity === 1) onRemove(item.id);
                      else onChange(item.id, -1);
                    }}
                  >
                    <Feather name="minus" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.stepperCount}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => {
                      triggerBtnPulse();
                      onAdd(item);
                    }}
                  >
                    <Feather name="plus" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [foods, setFoods] = useState<Food[]>(demoFoods);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { add, remove, change, items } = useCart();
  const scrollViewRef = useRef<ScrollView>(null);

  // Search placeholder animation state
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const placeholderFade = useRef(new Animated.Value(1)).current;
  const placeholderY = useRef(new Animated.Value(0)).current;

  // Realistic floating burger animation
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return onSnapshot(collection(db, 'food_items'), snap => {
      const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Food));
      if (remote.length) setFoods(remote);
    }, () => {});
  }, []);

  // Search placeholder cycling timer
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(placeholderFade, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(placeholderY, { toValue: -10, duration: 350, useNativeDriver: true }),
      ]).start(() => {
        setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
        placeholderY.setValue(10);
        Animated.parallel([
          Animated.timing(placeholderFade, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(placeholderY, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]).start();
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholderFade, placeholderY]);

  // Floating & pulse animation loop for banner image
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnim, { toValue: -6, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [floatAnim, pulseAnim]);

  const filtered = useMemo(() => foods.filter(f =>
    (category === 'All' ||
     f.categoryId === category ||
     (category === 'Pure Meals' && (f.categoryId === 'Healthy' || f.categoryId === 'Pure Meals'))) &&
    f.name.toLowerCase().includes(search.trim().toLowerCase())
  ), [foods, category, search]);

  const handleCategorySelect = (cId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategory(cId);
    scrollViewRef.current?.scrollTo({ y: 340, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Zepto Header: Location & Delivery Time Pill */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandLetter}>B</Text>
            </View>
            <View>
              <View style={styles.locationTitleRow}>
                <Text style={styles.brandName}>Bounty</Text>
                <View style={styles.deliveryPill}>
                  <Text style={styles.deliveryPillText}>⚡ 10 MINS</Text>
                </View>
              </View>
              <Text style={styles.locationSub}>Main Campus Canteen • Open</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Feather name="bell" size={19} color="#1F2937" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Subtitle under "Hungry?" */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Hungry?</Text>
          <Text style={styles.mainSub}>make your own meal</Text>
        </View>

        {/* Search Bar with animated placeholders */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <View style={styles.searchInputWrapper}>
            {search.length === 0 && (
              <Animated.Text
                style={[
                  styles.placeholderText,
                  { opacity: placeholderFade, transform: [{ translateY: placeholderY }] }
                ]}
              >
                {placeholders[placeholderIdx]}
              </Animated.Text>
            )}
            <TextInput value={search} onChangeText={setSearch} style={styles.searchInput} />
          </View>
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x-circle" size={17} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categoryList.map(cat => (
            <AnimatedCategoryOption
              key={cat.id}
              id={cat.id}
              label={cat.label}
              emoji={cat.emoji}
              isSelected={category === cat.id}
              onSelect={handleCategorySelect}
            />
          ))}
        </ScrollView>

        {/* Single Zepto Hero Promo Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>⚡ CANTEEN SPECIAL</Text>
            </View>
            <Text style={styles.heroTitle}>Wanna Eat?</Text>
            <Text style={styles.heroSub}>Up to 40% OFF on Student Meals</Text>
            <TouchableOpacity onPress={() => handleCategorySelect('All')} style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Order Now →</Text>
            </TouchableOpacity>
          </View>
          <Animated.Image
            source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' }}
            style={[
              styles.heroImage,
              { transform: [{ translateY: floatAnim }, { scale: pulseAnim }] }
            ]}
          />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {search || category !== 'All' ? 'Food Menu' : "Today's Menu"}
            </Text>
            <Text style={styles.sectionSub}>Freshly prepared for you</Text>
          </View>
          <View style={styles.cartBadge}>
            <Feather name="shopping-bag" size={13} color={theme.colors.primary} />
            <Text style={styles.cartBadgeText}>{items.reduce((s, i) => s + i.quantity, 0)} items</Text>
          </View>
        </View>

        {/* Animated Zepto Product Cards Grid */}
        {filtered.length ? (
          <View style={styles.gridContainer}>
            {filtered.map((f, idx) => {
              const cartItem = items.find(i => i.id === f.id);
              const qty = cartItem ? cartItem.quantity : 0;
              return (
                <ZeptoFoodCard
                  key={f.id}
                  item={f}
                  quantity={qty}
                  onAdd={add}
                  onRemove={remove}
                  onChange={change}
                  index={idx}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.noResultsWrap}>
            <Feather name="coffee" size={32} color="#9CA3AF" />
            <Text style={styles.noResultsText}>No food items found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Clean off-white canvas
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 18, paddingBottom: 35 },

  // Zepto Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  brandLetter: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.4 },
  deliveryPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  deliveryPillText: { color: '#2E7D32', fontSize: 10, fontWeight: '900' },
  locationSub: { fontSize: 11, color: '#6B7280', marginTop: 1, fontWeight: '500' },
  bellBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB', position: 'relative' },
  bellDot: { position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 3.5, backgroundColor: theme.colors.primary },

  // Main Titles
  titleSection: { marginBottom: 14 },
  mainTitle: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  mainSub: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 },

  // Search Bar
  searchBar: { height: 48, borderRadius: 14, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: '#E5E7EB', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  searchInputWrapper: { flex: 1, justifyContent: 'center' },
  placeholderText: { position: 'absolute', fontSize: 14, color: '#9CA3AF' },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },

  // Categories
  categoriesScroll: { marginVertical: 18 },
  categoryOption: { alignItems: 'center', marginRight: 16 },
  catIconContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', elevation: 1 },
  catIconSelected: { backgroundColor: '#FFEBE5', borderColor: theme.colors.primary, elevation: 4 },
  emojiText: { fontSize: 22 },
  catText: { fontSize: 11, color: '#6B7280', marginTop: 6, fontWeight: '600' },
  catTextActive: { color: theme.colors.primary, fontWeight: '900' },
  activeDotIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.primary, marginTop: 3 },

  // Hero Banner
  heroBanner: { backgroundColor: '#1E1E24', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 24, elevation: 4 },
  heroContent: { flex: 1 },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  heroBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  heroSub: { fontSize: 11, color: '#9CA3AF', marginVertical: 6 },
  heroBtn: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginTop: 4 },
  heroBtnText: { color: '#1E1E24', fontSize: 11, fontWeight: '900' },
  heroImage: { width: 100, height: 100, borderRadius: 50, marginLeft: 10 },

  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111827' },
  sectionSub: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  cartBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFEBE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  cartBadgeText: { fontSize: 11, fontWeight: '800', color: theme.colors.primary },

  // Zepto Product Card Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  zeptoCardWrap: { width: '48%', marginBottom: 16 },
  zeptoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  cardImageContainer: { position: 'relative', width: '100%', height: 125, backgroundColor: '#F3F4F6' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  etaBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  etaBadgeText: { fontSize: 9, fontWeight: '900', color: '#111827' },
  discountBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  discountBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF' },
  soldOutOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' },
  soldOutText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  cardContent: { padding: 10 },
  productTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  productDesc: { fontSize: 11, color: '#6B7280', marginTop: 3, minHeight: 28, lineHeight: 14 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  priceContainer: { flexDirection: 'column' },
  finalPrice: { fontSize: 15, fontWeight: '900', color: '#111827' },
  strikePrice: { fontSize: 11, color: '#9CA3AF', textDecorationLine: 'line-through' },
  
  // Zepto ADD Button & Stepper
  addBtnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, backgroundColor: '#FFF' },
  addBtnText: { color: theme.colors.primary, fontSize: 12, fontWeight: '900' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, gap: 8 },
  stepperBtn: { padding: 2 },
  stepperCount: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },

  noResultsWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  noResultsText: { color: '#6B7280', fontSize: 14, marginTop: 10, fontWeight: '600' }
});
