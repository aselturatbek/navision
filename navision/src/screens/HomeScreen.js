import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Ellipse } from "react-native-svg";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIconsIcon from "react-native-vector-icons/EvilIcons";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Stories */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
          <TouchableOpacity style={styles.storyItem}>
            <Icon name="add-circle-outline" size={55} color="black" />
          </TouchableOpacity>
          <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
        </ScrollView>

        {/* Post Section 1 */}
        <View style={styles.postContainer}>
          <Image source={require('../assets/images/post.png')} style={styles.postImage} />
          <View style={styles.postInfo}>
            <View style={styles.icon2ColumnRow}>
              <View style={styles.locationRow}>
                <EvilIconsIcon name="location" style={styles.icon2}></EvilIconsIcon>
                <Text style={styles.location}>Mount Fuji, Tokyo</Text>
              </View>
              
              <View style={styles.authorRow}>
                <Image source={require('../assets/images/default_cat.jpg')} style={styles.authorImage} />
                <Text style={styles.postAuthor}>Kerem Baran TAN 4sa</Text>
              </View>

              <Text style={styles.postDescription}>
                14 saat yol gittim ama {"\n"}gercekten bu kadar mı {"\n"}guzel olur dayı...
              </Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.button}>
                <Icon name="heart-outline" size={25} style={styles.icons} />
                <Text style={styles.countText}>4.2k</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="chatbubble-outline" size={25} style={styles.icons}/>
                <Text style={styles.countText}>273</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="paper-plane-outline" size={25} style={styles.icons}/>
                <Text style={styles.countText}>48</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Post Section 2 */}
        <View style={styles.postContainer}>
          <Image source={require('../assets/images/post2.png')} style={styles.postImage} />
          <View style={styles.postInfo}>
            <View style={styles.icon2ColumnRow}>
              <View style={styles.locationRow}>
                <EvilIconsIcon name="location" style={styles.icon2}></EvilIconsIcon>
                <Text style={styles.location}>Tokyo Tower, Japan</Text>
              </View>
              
              <View style={styles.authorRow}>
                <Image source={require('../assets/images/default_cat.jpg')} style={styles.authorImage} />
                <Text style={styles.postAuthor}>Ahmet Demir 2sa</Text>
              </View>

              <Text style={styles.postDescription}>
                Bugün Tokyo Kulesi'ne {"\n"}çıktım ve manzara {"\n"}muhteşemdi! {"\n"}Kesinlikle görülmesi gereken bir yer...
              </Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.button}>
                <Icon name="heart-outline" size={25} style={styles.icons} />
                <Text style={styles.countText}>3.1k</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="chatbubble-outline" size={25} style={styles.icons}/>
                <Text style={styles.countText}>150</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="paper-plane-outline" size={25} style={styles.icons}/>
                <Text style={styles.countText}>22</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add more post containers here if needed */}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  storiesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  storyImage: {
    width: 65,
    height: 65,
    borderRadius: 33,
    marginHorizontal: 5,
  },
  postContainer: {
    marginVertical: 15,
    paddingHorizontal: 18,
  },
  postImage: {
    width: '100%',
    height: 370,
    borderRadius: 25,
    zIndex: 1, // Ensure it's on top
  },
  postInfo: {
    padding: 15,
    backgroundColor: '#33414f',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginTop: -30,
    height: 140,
    zIndex: 0,
  },
  icon2ColumnRow: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon2: {
    color: "#fff",
    fontSize: 20,
    height: 22,
    width: 20,
    marginTop: 24,
  },
  authorImage: {
    width: 25,
    height: 25,
    marginRight: 8,
    borderRadius: 25,
  },
  location: {
    fontFamily: 'ms-regular',
    fontSize: 13,
    color: '#fff',
    marginTop: 22,
    marginLeft: 13,
  },
  postAuthor: {
    fontFamily: 'ms-light',
    fontSize: 10,
    color: '#fff',
  },
  postDescription: {
    fontFamily: 'ms-bold',
    fontSize: 9,
    color: '#fff',
    marginTop: 2,
    marginLeft: 33,
    flexWrap: 'wrap'
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -60,
  },
  button: {
    width: 45,
    height: 55,
    backgroundColor: "#293440",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
    marginTop: -20,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icons: {
    color: '#fff',
  },
  countText: {
    color: '#fff',
    fontFamily: 'ms-light',
  },
});

export default HomeScreen;
