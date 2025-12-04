import { SafeAreaView, View, Text, StyleSheet, ImageSourcePropType } from 'react-native';

interface HeaderProps {
  title?: string;
 }

export default function Header({ title = 'Fundstück'}: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
         <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
    height: '95%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 60,
    },
});
