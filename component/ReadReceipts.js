import { StyleSheet, Text, Image, View, Pressable } from 'react-native'
import React from 'react'

export default function ReadReceipts({
    setReceiptsModalVisible,
    seen,
    delivered
}) {
    const SeenDate = new Date(seen).getDate() < 10 ?
        `0${new Date(seen).getDate()}`
        : `${new Date(seen).getDate()}`;

    const SeenMonth = new Date(seen).getMonth() < 10 ?
        `0${new Date(seen).getMonth()}`
        : `${new Date(seen).getMonth()}`;

    const SeenHour = new Date(seen).getHours() < 10 ?
        `0${new Date(seen).getHours()}`
        : `${new Date(seen).getHours()}`;

    const SeenMin = new Date(seen).getMinutes() < 10 ?
        `0${new Date(seen).getMinutes()}`
        : `${new Date(seen).getMinutes()}`;

    const deliveredDate = new Date(delivered).getDate() < 10 ?
        `0${new Date(delivered).getDate()}`
        : `${new Date(delivered).getDate()}`;

    const deliveredMonth = new Date(delivered).getMonth() < 10 ?
        `0${new Date(delivered).getMonth()}`
        : `${new Date(delivered).getMonth()}`;

    const deliveredHour = new Date(delivered).getHours() < 10 ?
        `0${new Date(delivered).getHours()}`
        : `${new Date(delivered).getHours()}`;

    const deliveredMin = new Date(delivered).getMinutes() < 10 ?
        `0${new Date(delivered).getMinutes()}`
        : `${new Date(delivered).getMinutes()}`;

    const isSeenToday = (new Date().getDate() == SeenDate && new Date().getMonth() == SeenMonth)
    const isDeliveredToday = (new Date().getDate() == deliveredDate && new Date().getMonth() == deliveredMonth)
    const closeModal = () => { setReceiptsModalVisible(false) };
    return (
        <View
            style={{
                width: '100%',
                borderColor: '#ddd',
                borderWidth: 5,
                elevation: 1,
                height: 175,
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 10,
                zIndex: 10,
                paddingVertical: 50,
                paddingHorizontal: 20,
            }}>
            <Pressable
                style={{
                    // backgroundColor: '#E14D2A',
                    // width: '40%',
                    position: 'absolute',
                    right: 15,
                    top: 15,
                    // height: 45,
                    // backgroundColor: '#ddd',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
                onPress={closeModal}>
                <Image
                    resizeMode="contain"
                    style={{ width: 20, height: 20 }}
                    source={require('../images/close.png')}
                />
            </Pressable>
            <View style={styles.lineStyle} />
            <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Image source={require("../images/seen_large.png")} />
                    <Text>Read</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Text>{isSeenToday ? 'Today' : { SeenDate } / { SeenMonth }}</Text>
                    <Text>{SeenHour}:{SeenMin}</Text>
                </View>
            </View>
            <View style={styles.lineStyle} />
            <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Image source={require("../images/seen_large.png")} />
                    <Text>Delivered</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Text>{isDeliveredToday ? 'Today' : { deliveredDate } / { deliveredMonth }}</Text>
                    <Text>{deliveredHour}:{deliveredMin}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    lineStyle: {
        borderWidth: 0.2,
        borderColor: 'grey',
        margin: 5,
    }
})