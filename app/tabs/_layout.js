import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles/theme'; // Importação consolidada
import { CustomTabIcon } from '../../components/ui/CustomTabIcon'; // Importação consolidada
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação consolidada
import HomeIcon from '../../assets/images/Icone Home.png';
import ListIcon from '../../assets/images/Icone Listagens.png';
import AddIcon from '../../assets/images/Icone transferir.png';
const BAR_HEIGHT = 60; 
const PADDING_BOTTOM = 20; 
const FIXED_WIDTH_CONTAINER = 400;

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}> 
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: BAR_HEIGHT, 
            paddingBottom: PADDING_BOTTOM,
          },

          tabBarItemStyle: {
            flex: 1,
            paddingTop: 0,
            paddingBottom: 0, 
            marginHorizontal: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },

          tabBarBackground: () => (
            <View style={styles.floatingContainer} />
          ),
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: 'Início',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon source={HomeIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'Transações',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon source={ListIcon} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Adicionar',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon source={AddIcon} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  floatingContainer: {
    backgroundColor: colors.tabBar.container,
    position: 'absolute',
    bottom: PADDING_BOTTOM / 2, 
    width: '80%',
    alignSelf: 'center',
    height: BAR_HEIGHT,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 9,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});