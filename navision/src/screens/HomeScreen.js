import React,  { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Ellipse } from "react-native-svg";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIconsIcon from "react-native-vector-icons/EvilIcons";
import SaveIcon from '../assets/icons/SaveIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import SendIcon from '../assets/icons/SendIcon';
import HeartIcon from '../assets/icons/HeartIcon';
import AddIcon from '../assets/icons/AddIcon';
import CommentsModal from '../components/CommentsModal';
import ShareModal from '../components/ShareModal';

const HomeScreen = () => {
  const handlePress = () => {
    console.log('Image pressed');
  };
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const handleCommentPress = () => {
    setIsCommentsModalVisible(true);
  };

  const handleSharePress = () => {
    setIsShareModalVisible(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalVisible(false);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Stories */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
          <TouchableOpacity style={styles.storyItem}>
            <AddIcon/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image source={require('../assets/images/default_cat.jpg')} style={styles.storyImage} />
          </TouchableOpacity>
        </ScrollView>

        {/* Post Section 1 */}
        <View style={styles.postContainer}>
          <Image source={require('../assets/images/post.png')} style={styles.postImage} />
          <TouchableOpacity style={styles.saveIconContainer}>
              <SaveIcon />
          </TouchableOpacity>
          <View style={styles.postInfo}>
            <View style={styles.icon2ColumnRow}>
              <View style={styles.locationRow}>
                <LocationIcon style={styles.icon2}/>
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
                <HeartIcon style={styles.icons} />
                <Text style={styles.countText}>4.2k</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCommentPress}>
                <CommentIcon style={styles.icons}/>
                <Text style={styles.countText}>273</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSharePress}>
                <SendIcon style={styles.icons}/>
                <Text style={styles.countText}>48</Text>
              </TouchableOpacity>
            </View>
          </View>
          
      <CommentsModal visible={isCommentsModalVisible} onClose={closeCommentsModal} />
      <ShareModal visible={isShareModalVisible} onClose={closeShareModal} />
        </View>

        {/* Post Section 1 */}
        <View style={styles.postContainer}>
          <Image source={require('../assets/images/post2.png')} style={styles.postImage} />
          <TouchableOpacity style={styles.saveIconContainer}>
              <SaveIcon />
          </TouchableOpacity>
          <View style={styles.postInfo}>
            <View style={styles.icon2ColumnRow}>
              <View style={styles.locationRow}>
                <LocationIcon style={styles.icon2}/>
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
                <HeartIcon style={styles.icons} />
                <Text style={styles.countText}>4.2k</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <CommentIcon style={styles.icons}/>
                <Text style={styles.countText}>273</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <SendIcon style={styles.icons}/>
                <Text style={styles.countText}>48</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 33,
    marginHorizontal: 5,
  },
  postContainer: {
    marginVertical: 15,
    paddingHorizontal: 18,
  },
  saveIconContainer: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', // Optional: Adds a semi-transparent background
    borderRadius: 20,
    padding: 12,
    zIndex: 1,
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },
  postImage: {
    width: '100%',
    height: 370,
    borderRadius: 30,
    zIndex: 1, // Ensure it's on top
  },
  postInfo: {
    padding: 15,
    backgroundColor: '#33414f',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: -30,
    height: 150,
    zIndex: 0,
  },
  icon2ColumnRow: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft:4,
    marginTop:10

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
    marginLeft:1,
    marginTop:12
  },
  location: {
    fontFamily: 'ms-bold',
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
    marginTop: -5,
    marginLeft: 34,
    flexWrap: 'wrap'
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -70,
    marginRight:-10
  },
  button: {
    width: 47,
    height: 61,
    backgroundColor: "#293440",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
    marginTop: -20,
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
  },
  icons: {
    color: 'pink',
  },
  countText: {
    color: '#fff',
    fontFamily: 'ms-light',
    fontSize:12,
    marginTop:6
  },
});

export default HomeScreen;
