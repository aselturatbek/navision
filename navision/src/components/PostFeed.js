// components/PostFeed.js
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SaveIcon from '../assets/icons/SaveIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import SendIcon from '../assets/icons/SendIcon';
import HeartIcon from '../assets/icons/HeartIcon';

const PostFeed = ({ user, handleCommentPress, handleSharePress }) => {
  const posts = [
    {
      image: require('../assets/images/post.png'),
      location: 'Mount Fuji, Tokyo',
      description: '14 saat yol gittim ama gerçekten bu kadar mı güzel olur dayı...',
    },
    {
      image: require('../assets/images/post2.png'),
      location: 'Tokyo',
      description: 'Unutulmaz bir geziydi!',
    },
  ];

  return (
    <>
      {posts.map((post, index) => (
        <View key={index} style={styles.postContainer}>
          <Image source={post.image} style={styles.postImage} />
          <TouchableOpacity style={styles.saveIconContainer}>
            <SaveIcon />
          </TouchableOpacity>
          <View style={styles.postInfo}>
            <View style={styles.icon2ColumnRow}>
              <View style={styles.locationRow}>
                <LocationIcon />
                <Text style={styles.location}>{post.location}</Text>
              </View>
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }}
                  style={styles.authorImage}
                />
                <Text style={styles.postAuthor}>
                  {user ? `${user.name} ${user.surname}` : 'Name Surname'} 4sa
                </Text>
              </View>
              <Text style={styles.postDescription}>{post.description}</Text>
            </View>
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.button}>
                <HeartIcon />
                <Text style={styles.countText}>4.2k</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCommentPress}>
                <CommentIcon />
                <Text style={styles.countText}>273</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSharePress}>
                <SendIcon />
                <Text style={styles.countText}>48</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 15,
    paddingHorizontal: 18,
  },
  saveIconContainer: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 12,
    zIndex: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },
  postImage: {
    width: '100%',
    height: 370,
    borderRadius: 30,
    zIndex: 1,
  },
  postInfo: {
    padding: 15,
    backgroundColor: '#33414f',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: -30,
    height: 150,
  },
  icon2ColumnRow: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 4,
    marginTop: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  authorImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 8,
  },
  location: {
    fontSize: 13,
    color: '#fff',
    marginTop: 22,
    marginLeft: 13,
    fontFamily:'ms-bold'
  },
  postAuthor: {
    fontSize: 11,
    color: '#fff',
    fontFamily:'ms-regular'
  },
  postDescription: {
    fontSize: 9,
    color: '#fff',
    marginTop: -5,
    marginLeft: 34,
    fontFamily:'ms-light'
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -70,
    marginRight: -10,
  },
  button: {
    width: 47,
    height: 61,
    backgroundColor: '#293440',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
  },
});

export default PostFeed;
