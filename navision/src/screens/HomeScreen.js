import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import CommentsModal from '../modals/CommentsModal';
import ShareModal from '../modals/ShareModal';
import StoryModal from '../modals/StoryModal';
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// components
import RefreshComponent from '../components/RefreshComponent';
import StoryFeed from '../components/StoryFeed';
import PostFeed from '../components/PostFeed';
import TopNavigation from '../navigation/TopNavigation';
import SideMenu from '../components/SideMenu';
// expo
import * as Font from 'expo-font';
//axios
import axios from 'axios';
//apibaseurl
import { API_BASE_URL } from '@env'; 
//secure store
import * as SecureStore from 'expo-secure-store';


const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const firestore = getFirestore();
  const auth = getAuth();
  const [stories, setStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  

  const loadFonts = async () => {
    await Font.loadAsync({
      'ms-regular': require('../assets/fonts/ms-regular.ttf'),
      'ms-bold': require('../assets/fonts/ms-bold.ttf'),
      'ms-light': require('../assets/fonts/ms-light.ttf'),
      'ms-italic': require('../assets/fonts/ms-italic.ttf'),
    });
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          console.error('Access token bulunamadı.');
          navigation.navigate('Login');
          return;
        }
  
        const response = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata:', error.message);
        setCurrentUser(null); // Hata durumunda null olarak ayarlayın
      }
    };
  
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    console.log('Current User in HomeScreen:', currentUser);
  }, [currentUser]);
  
  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => !prevMenuVisible);
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const fetchUserDataAndContent = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userDocRef = doc(firestore, 'userInfo', userId);

          const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUser(doc.data());
            }
          });

          const storiesCollectionRef = collection(firestore, 'stories');
          const unsubscribeStories = onSnapshot(storiesCollectionRef, (snapshot) => {
            const storiesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setStories(storiesData);
          });

          const postsCollectionRef = collection(firestore, 'posts');
          const unsubscribePosts = onSnapshot(postsCollectionRef, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(postsData);
          });

          return () => {
            unsubscribeUser();
            unsubscribeStories();
            unsubscribePosts();
          };
        } else {
          console.log('Kullanıcı oturum açmamış.');
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      }
    };

    fetchUserDataAndContent();
  }, [firestore, auth]);

  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.userId;
    if (!acc[userId]) {
      acc[userId] = {
        profileImage: story.profileImage,
        stories: [],
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);

  const handleCommentPress = (postId) => {
    setSelectedPostId(postId);
    setIsCommentsModalVisible(true);
  };

  const handleSharePress = () => {
    setIsShareModalVisible(true);
  };

  const handleStoryPress = (userId) => {
    const userStories = groupedStories[userId]?.stories || [];
    setCurrentUserStories(userStories);
    setIsStoryModalVisible(true);
  };

  const [currentUserStories, setCurrentUserStories] = useState([]);
  const closeCommentsModal = () => {
    setIsCommentsModalVisible(false);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
  };

  const renderContent = () => {
    if (!currentUser) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    return (
      <>
        <StoryFeed groupedStories={groupedStories} handleStoryPress={handleStoryPress} />
        <StoryModal visible={isStoryModalVisible} onClose={() => setIsStoryModalVisible(false)} stories={currentUserStories} />
        <PostFeed
          user={currentUser} // currentUser null değilse gönderiliyor
          handleCommentPress={handleCommentPress}
          handleSharePress={handleSharePress}
        />
        <CommentsModal
          visible={isCommentsModalVisible}
          onClose={closeCommentsModal}
          postId={selectedPostId}
          user={user}
        />
        <ShareModal visible={isShareModalVisible} onClose={closeShareModal} />
      </>
    );
  };
  return (
    <RefreshComponent refreshing={refreshing} onRefreshAction={onRefresh}>
      <View style={styles.container}>
        <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={renderContent}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
        />
        {menuVisible && <SideMenu onClose={toggleMenu} />}
      </View>
    </RefreshComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
