import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";

const HeaderComponent = ({ }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.search}>
          <Icon name="search" style={styles.icon}></Icon>
        </TouchableOpacity>
        {/* <View style={styles.button2Row}>
          <TouchableOpacity style={styles.option1}>
            <Text style={styles.cevremde}>Çevremde</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option2} >
            <Text style={styles.dunyada}>Dünyada</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 280,
  },
  header: {
    marginTop: 70,
  },
  search: {
    width: 352,
    height: 40,
    backgroundColor: "#E6E6E6",
    borderRadius: 42,
    alignSelf: "center",
  },
  icon: {
    color: "black",
    fontSize: 33,
    height: 35,
    width: 33,
    marginTop: 6,
    marginLeft: 7,
  },
//   option1: {
//     width: 170,
//     height: 49,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cevremde: {
//     fontFamily: "ms-bold",
//     color: "rgba(255,255,255,1)",
//     fontSize: 16,
//   },
//   option2: {
//     width: 170,
//     height: 49,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     borderRadius: 25,
//     marginLeft: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dunyada: {
//     fontFamily: "ms-bold",
//     color: "rgba(255,255,255,1)",
//     fontSize: 16,
//   },
//   button2Row: {
//     height: 42,
//     flexDirection: "row",
//     marginTop: 15,
//     marginLeft: 23,
//     marginRight: 26,
//   },
});

export default HeaderComponent;
