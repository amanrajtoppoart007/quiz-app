import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    Alert,
    Button,
    Platform,
    View,
} from "react-native";

import IAP from "react-native-iap";

// Platform select will allow you to use a different array of product ids based on the platform
const items = Platform.select({
    ios: [],
    android: ["testsubscription","quiznoads012","quiznoads007","quiznoads006"],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default function InAppPurchaseScreen() {
    const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
    const [products, setProducts] = useState({}); //used to store list of products

    const validate = async (receipt) => {
        try {
            // send receipt to backend
           const result =  await fetch("add your backend link here", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ userId:4532423, receipt: receipt,status:'success' }),
            });

           if(result.response==="success")
           {
               setPurchased(true);
           }
        } catch (error) {
            Alert.alert("Error!", error.message);
        }
    };

    useEffect(() => {
        IAP.initConnection()
            .catch(() => {
                console.log("error connecting to store...");
            })
            .then(() => {
                IAP.getSubscriptions(items)
                    .catch(() => {
                        console.log("error finding items");
                    })
                    .then((res) => {
                        setProducts(res);
                    });

                IAP.getPurchaseHistory()
                    .catch(() => {})
                    .then((res) => {
                        try {
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
                    "There has been an error with your purchase, error code" +
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

    if (purchased) {
        return (
            <View>
                <Text style={styles.title}>WELCOME TO THE APP!</Text>
            </View>
        );
    }

    if (products.length > 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Product List</Text>


                {products.map((item,index) => (
                    <View key={index} style={{marginVertical:10}}>
                    <Button
                        key={item["productId"]}
                        title={`Purchase ${item["title"]}`}
                        onPress={() => {
                            IAP.requestSubscription(item["productId"]).then(r => {
                                console.log(r);
                            });
                        }}
                    />
                    </View>
                ))}
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>Fetching products please wait...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        color: "red",
    },
});
