import { SafeAreaView, View, Text } from 'react-native';
import { styles } from './styled';  
interface HeaderProps {
  title?: string;
 }

const Header = ({ title = 'Fundstück'}: HeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
         <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

export default Header;