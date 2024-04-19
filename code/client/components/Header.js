import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Header = () => {
    return (
        <Text style={style.header}>TOPBIDS</Text>
    );
};

const style = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default Header;
