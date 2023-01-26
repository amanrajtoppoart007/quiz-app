import React, {useRef} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from '@react-native-admob/admob';

export default function AdMobExample() {
    const bannerRef = useRef(null);
    return (
        <View>
            <BannerAd ref={bannerRef} size={BannerAdSize.BANNER} unitId={TestIds.BANNER} />
        </View>
    );
}
