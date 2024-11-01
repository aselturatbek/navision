import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CommentsModal from '../modals/CommentsModal';
import ShareModal from '../modals/ShareModal';
import StoryModal from '../modals/StoryModal';
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//components
import RefreshComponent from '../components/RefreshComponent';
import StoryFeed from '../components/StoryFeed';
import PostFeed from '../components/PostFeed';
import TopNavigation from '../navigation/TopNavigation';
import SideMenu from '../components/SideMenu';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // posts state oluşturuldu
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

  const fetchCurrentUser = async (user) => {
    const db = getFirestore();
    const userRef = doc(db, 'userInfo', user.uid);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          profileImage: userData.profileImage || 'https://via.placeholder.com/150',
          displayName: userData.username || user.email.split('@')[0],
        });
      } else {
        setCurrentUser(null);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      setCurrentUser(null);
    });

    return unsubscribe;
  };

  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => !prevMenuVisible);
  };
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    const auth = getAuth();
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
    // refresh
    setTimeout(() => setRefreshing(false), 2000); // 2 saniye sonra yenileme bitir
  }, []);

  // User, Stories ve Posts Fetching
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

          const postsCollectionRef = collection(firestore, 'posts'); // posts collection
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
    setSelectedPostId(postId); // Burada postId'yi ayarlıyoruz
    setIsCommentsModalVisible(true); // Yorum modalını açmak için değiştirin
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

  return (
    <RefreshComponent refreshing={refreshing} onRefreshAction={onRefresh}>
      <View style={styles.container}>
      <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Stories */}
          <StoryFeed groupedStories={groupedStories} handleStoryPress={handleStoryPress} />
          <StoryModal visible={isStoryModalVisible} onClose={() => setIsStoryModalVisible(false)} stories={currentUserStories} />
          {/* Post Section */}
          <PostFeed
            user={user}
            posts={posts} // PostFeed'e posts props olarak gönderiliyor
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
        </ScrollView>
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
