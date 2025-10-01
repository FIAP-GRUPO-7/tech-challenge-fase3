import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
// Ajuste o caminho de importação se necessário
import { colors, radius } from '../../styles/theme';

const ICON_SIZE = 22;

export function CustomTabIcon({ source, focused }) {
    return (
        <View
            style={[
                styles.iconWrapper,
                focused && {
                    backgroundColor: colors.tabBar.activeIconBackground,
                    borderRadius: radius.sm * 2,
                },
            ]}
        >
            <Image
                source={source}
                style={{
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    tintColor: focused ? colors.tabBar.activeIcon : colors.tabBar.inactiveIcon,
                }}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});