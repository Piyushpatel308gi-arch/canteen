import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const Button = ({ title, onPress, disabled=false, style, textStyle, loading=false }: any) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.button, disabled && styles.buttonDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
  </TouchableOpacity>
);

export const Field = ({ label, error, ...props }: any) => (
  <View style={styles.fieldWrap}>
    {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
    <TextInput
      {...props}
      style={[styles.field, props.multiline && styles.fieldMultiline, error && styles.fieldError]}
      placeholderTextColor={theme.colors.textMuted}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export const ScreenHeader = ({ title, onBack, right }: any) => (
  <View style={styles.screenHeader}>
    {onBack ? (
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    ) : <View style={styles.headerSpacer} />}
    <Text style={styles.screenTitle}>{title}</Text>
    <View style={styles.headerRight}>{right || null}</View>
  </View>
);

export const FoodCard = ({ item, onAdd, quantity=0 }: any) => (
  <View style={styles.foodCard}>
    <View style={styles.foodImageWrap}>
      <Image source={{ uri: item.imageUrl || item.image }} style={styles.foodImage} />
      {!item.isAvailable && (
        <View style={styles.soldOut}><Text style={styles.soldOutText}>Unavailable</Text></View>
      )}
    </View>
    <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
    {!!item.description && <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>}
    <View style={styles.foodFooter}>
      <Text style={styles.foodPrice}>₹{Number(item.price).toFixed(0)}</Text>
      <TouchableOpacity
        style={[styles.addBtn, !item.isAvailable && styles.buttonDisabled]}
        onPress={onAdd}
        disabled={!item.isAvailable}
      >
        <Feather name={quantity ? "check" : "plus"} size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  </View>
);

export const ProfileMenuItem = ({ iconName, label, extraText, onPress, danger=false }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <Feather name={iconName} size={20} color={danger ? theme.colors.danger : '#424242'} />
      <Text style={[styles.menuLabel, danger && { color: theme.colors.danger }]}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {extraText ? <Text style={styles.menuExtraText}>{extraText}</Text> : null}
      <Feather name="chevron-right" size={18} color="#BDBDBD" />
    </View>
  </TouchableOpacity>
);

export const EmptyState = ({ icon='coffee', title, message, actionTitle, onAction }: any) => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}><Feather name={icon} size={30} color={theme.colors.primary} /></View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
    {actionTitle ? <Button title={actionTitle} onPress={onAction} style={{ marginTop: 16, paddingHorizontal: 22 }} /> : null}
  </View>
);

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  button: { backgroundColor: theme.colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginVertical: 5 },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary },
  text: { fontSize: 16, color: theme.colors.textPrimary },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 6 },
  field: { backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: theme.colors.textPrimary },
  fieldMultiline: { minHeight: 90, textAlignVertical: 'top' },
  fieldError: { borderColor: theme.colors.danger },
  errorText: { color: theme.colors.danger, fontSize: 11, marginTop: 4 },
  screenHeader: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  headerSpacer: { width: 36 },
  headerRight: { width: 36, alignItems: 'flex-end' },
  screenTitle: { fontSize: 19, fontWeight: '900', color: theme.colors.textPrimary },
  foodCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity:0.05, shadowRadius:4 },
  foodImageWrap: { position: 'relative' },
  foodImage: { width: '100%', height: 105, borderRadius: 12, backgroundColor: '#F3F3F3' },
  soldOut: { position:'absolute', left:8, bottom:8, backgroundColor:'rgba(0,0,0,.7)', paddingHorizontal:7, paddingVertical:3, borderRadius:8 },
  soldOutText: { color:'#FFF', fontSize:10, fontWeight:'700' },
  foodName: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary, marginTop: 8 },
  foodDescription: { fontSize: 10, color: theme.colors.textMuted, marginTop: 3, minHeight: 25 },
  foodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  foodPrice: { fontSize: 16, fontWeight: '900', color: theme.colors.textPrimary },
  addBtn: { backgroundColor: theme.colors.primary, width: 30, height: 30, borderRadius: 15, justifyContent:'center', alignItems:'center' },
  menuItem: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:16, borderBottomWidth:1, borderBottomColor:'#F5F5F5' },
  menuLeft: { flexDirection:'row', alignItems:'center', gap:14, flex:1 },
  menuLabel: { fontSize:14, color:'#212121', fontWeight:'600' },
  menuRight: { flexDirection:'row', alignItems:'center', gap:6 },
  menuExtraText: { fontSize:12, color:theme.colors.textMuted },
  empty: { flex:1, alignItems:'center', justifyContent:'center', padding:30 },
  emptyIcon: { width:70, height:70, borderRadius:35, backgroundColor:theme.colors.primaryLight, alignItems:'center', justifyContent:'center', marginBottom:14 },
  emptyTitle: { fontSize:19, fontWeight:'900', color:theme.colors.textPrimary },
  emptyMessage: { textAlign:'center', color:theme.colors.textSecondary, marginTop:6, lineHeight:20 },
});
