import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CustomTabIcon } from '../../components/ui/CustomTabIcon';
import { colors } from '../../styles/theme';

import { SafeAreaView } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/images/Icone Home.png';
import ListIcon from '../../assets/images/Icone Listagens.png';
import AddIcon from '../../assets/images/Icone transferir.png';

const BAR_HEIGHT = 60;
const PADDING_BOTTOM = 20;

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1}}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,

          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: BAR_HEIGHT + PADDING_BOTTOM,
          },

          tabBarItemStyle: {
            paddingTop: 10,
            paddingBottom: PADDING_BOTTOM,
            marginHorizontal: 5,
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
    bottom: PADDING_BOTTOM,
    left: '9%',
    right: '9%',
    height: BAR_HEIGHT,
    borderRadius: 19,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});