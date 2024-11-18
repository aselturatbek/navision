import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
// Firebase
import { getFirestore, collection, getDocs,isArray} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Components
import ExploreFeed from "../components/searchscreen/ExploreFeed";
import HeaderComponent from "../components/searchscreen/HeaderComponent";
import MapOptions from "../components/searchscreen/MapOptions";

function SearchScreen(props) {
  const [randomLoops, setRandomLoops] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);
  const firestore = getFirestore();
  const storage = getStorage();

  const fetchDataFromCollection = async (collectionName, processData) => {
    try {
      const snapshot = await getDocs(collection(firestore, collectionName));
      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const item = await processData(doc);
          return item;
        })
      );
      return data.filter(Boolean); // Geçersiz verileri filtrele
    } catch (error) {
      console.error(`Error fetching data from ${collectionName}:`, error);
      return [];
    }
  };

  const fetchRandomData = async () => {
    // Fetch Loops
    const loops = await fetchDataFromCollection("loops", async (doc) => {
      const data = doc.data();
      if (data.loopUrl && data.loopUrl.length > 0) {
        const loopUrls = await Promise.all(
          data.loopUrl.map(async (url) => {
            const loopUrl = await getDownloadURL(ref(storage, url));
            return loopUrl;
          })
        );
        return { id: doc.id, loopUrls };
      }
    });
    const randomLoopSelection = loops.map(
      (loop) => loop.loopUrls[Math.floor(Math.random() * loop.loopUrls.length)]
    );
    setRandomLoops(randomLoopSelection);

    // Fetch Posts
    const posts = await fetchDataFromCollection("posts", async (doc) => {
      const data = doc.data();
      if (data.mediaUrls && Array.isArray(data.mediaUrls) && data.mediaUrls.length > 0) {
        const mediaUrls = await Promise.all(
          data.mediaUrls.map(async (url) => {
            try {
              const mediaUrl = await getDownloadURL(ref(storage, url));
              return { uri: mediaUrl, type: "image" };
            } catch (error) {
              console.error("Error fetching media URL:", error);
              return null; // Hatalı URL'leri atla
            }
          })
        );
        return { id: doc.id, ...data, mediaUrls };
      }
    });
    setRandomPosts(posts);
  };

  useEffect(() => {
    fetchRandomData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent />
      {/* MapView */}
      <MapOptions />
      {/* Feed Cards */}
      <ExploreFeed randomLoops={randomLoops} randomPosts={randomPosts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default SearchScreen;
