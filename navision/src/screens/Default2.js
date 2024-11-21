import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
//api base
import { API_BASE_URL } from '@env';

const Default2Screen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <Text style={styles.title}>{item.username || 'No Username'}</Text>
          {/* mediaUrls'deki ilk medyayı görüntü olarak çekiyoruz */}
          {item.mediaUrls && item.mediaUrls.length > 0 && (
            <Image
              source={{ uri: item.mediaUrls[0] }} // İlk medya URL'sini kullan
              style={styles.image}
            />
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  post: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%', // Görüntüyü tam genişlikte göstermek için
    height: 200,   // Yüksekliği sabit bir boyutta ayarlayın
    borderRadius: 10,
  },
});

export default Default2Screen;
