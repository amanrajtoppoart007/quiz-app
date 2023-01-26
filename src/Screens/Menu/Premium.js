import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, Alert} from 'react-native'
const { height } = Dimensions.get('screen')
import { Colors } from '../../Constant'
import { Appbar, Title } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {baseUrl} from "../../Constant"
import IAP from "react-native-iap";
import { getData } from '../../AsyncStorage';
const items = Platform.select({
    ios: [],
    android: ["quiznoads012","quiznoads007","quiznoads006"],//change here product id from play console
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const Premium = ({ navigation }) => {
    const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
    const [products, setProducts] = useState({}); //used to store list of products
    const [subscriptionType,setSubscriptionType] = useState('');
    const [amount, setAmount] = useState('');
    const validate = async (receipt) => {
        try {
            let token = null;
            const getToken = await getData('token');
            if (getToken.status) {
                token = getToken.data;
            }
            // send receipt to backend
            const result =  await fetch(baseUrl+'paymentDone', {
                headers: { "Content-Type": "application/json", Authorization: 'Bearer ' + token},
                method: "POST",
                body: JSON.stringify({ amount:amount,transaction_Id: receipt, type: subscriptionType }),
            });
              const { Status=false} = result;
            if(Status===true)
            {
                //status after you update purchase status in you database
                setPurchased(true);
                Alert.alert("Success", "Subscription is successful");
            }
        } catch (error) {
            Alert.alert("Error!", error.message?.toString());
        }
    };

    useEffect(()=>{

        if(purchased)
        {
            console.log("process success");
            //your code here  after you update purchase status in you database
        }
    },[purchased])

    useEffect(() => {
        IAP.initConnection()
            .catch(() => {
                console.log("error connecting to store...");//connection to store has failed
            })
            .then(() => {
                IAP.getSubscriptions(items)
                    .catch(() => {
                        console.log("error finding items");//set your message for error if no subscription found
                    })
                    .then((res) => {
                        setProducts(res);
                    });

                IAP.getPurchaseHistory()
                    .catch(() => {})
                    .then((res) => {
                        try {
                            console.log(res);
                            const receipt = res[res.length - 1].transactionReceipt;
                            if (receipt) {
                                validate(receipt).then(() => {});
                            }
                        } catch (error) {}
                    });
            });

        purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
            if (!(error["responseCode"] === "2")) {
                Alert.alert(
                    "Error",
                    "There has been an error with your purchase, error code :" +
                    error["code"]
                );
            }
        });
        purchaseUpdateSubscription = IAP.purchaseUpdatedListener((purchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                validate(receipt).then(() => {});
                IAP.finishTransaction(purchase, false).then(() => {});
            }
        });

        return () => {
            try {
                purchaseUpdateSubscription.remove();
            } catch (error) {}
            try {
                purchaseErrorSubscription.remove();
            } catch (error) {}
            try {
                IAP.endConnection().then(() => {});
            } catch (error) {}
        };
    }, []);

    const truncate = (str)=>{
        return str?.replace("(Samyur)","");
    }
    const truncateAmount = (str)=>{
        return str?.replace("$","");
    }
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: Colors.primary }}>
                <Appbar.BackAction color="#fff" onPress={() => { navigation.goBack() }} />
                <Appbar.Content color="#fff" title="Get Premium" />
            </Appbar.Header>
            <View style={styles.header}>
                <FontAwesome5 name="crown" size={70} color="#fff" />
                <Title style={{ color: '#fff' }}>PREMIUM TODAY</Title>
                <Text style={{ color: '#fff' }}>Remove Ads</Text>
            </View>
            <View style={styles.card}>
                {products?.length>0 && products.map((item,index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.cardItem} onPress={async () => {
                            await IAP.requestSubscription(item?.productId);
                            setSubscriptionType(item?.productId);
                            setAmount(item?.localizedPrice)
                        }}>
                            <View style={{width:'70%'}}>
                                <Text style={{ fontSize: 14, color: 'black',width:"90%" }}>{truncate(item?.title)}</Text>
                                <Text style={{fontSize: 12, color: 'black' }}>Remove Ads</Text>
                            </View>
                            <View style={{width:'30%'}}>
                                <Text style={{ fontSize: 14, color: 'black' }}>{item?.localizedPrice}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        flex: 2,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    cardItem: {
        height: height / 9,
        borderRadius: 10,
        backgroundColor: Colors.tertiary,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 30
    }
});

export default Premium
