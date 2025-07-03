import {View, StyleSheet, Dimensions } from 'react-native';

function Card({children}) {
    return <View style={styles.card}>{children}</View>
}

export default Card

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginTop: windowWidth < 500 ? 12: 24,
        marginHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: 'darkgray',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        shadowOpacity: .33,
        justifyContent: 'center',
        alignItems: 'center'
    }
})