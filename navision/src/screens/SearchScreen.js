import React, { useEffect,useState} from "react";
import { StyleSheet, View, TouchableOpacity,Text,ScrollView,Image } from "react-native";
//icons
import Icon from "react-native-vector-icons/EvilIcons";
import LoopExplore from "../assets/icons/searchicons/LoopExplore";
//firebase
import { getFirestore, collection, onSnapshot, query, orderBy,getDocs} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
//expo
import { Video } from "expo-av";

function SearchScreen(props) {
  const [randomLoops, setRandomLoops] = useState([]); 
  const [randomPosts, setRandomPosts] = useState([]);
  const firestore = getFirestore();
  const storage = getStorage();

  // Firestore'dan verileri çek
  const fetchRandomData = async () => {
    try {
      // Loops Koleksiyonu
      const loopsSnapshot = await getDocs(collection(firestore, "loops"));
      const loops = await Promise.all(
        loopsSnapshot.docs.map(async (doc) => {
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
        })
      );
      const filteredLoops = loops.filter(Boolean);
      const randomLoopSelection = filteredLoops.map(
        (loop) => loop.loopUrls[Math.floor(Math.random() * loop.loopUrls.length)]
      );
      setRandomLoops(randomLoopSelection);

      // Posts Koleksiyonu
      const postsSnapshot = await getDocs(collection(firestore, "posts"));
      const posts = await Promise.all(
        postsSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          if (data.mediaUrl) {
            const mediaUrl = await getDownloadURL(ref(storage, data.mediaUrl));
            return mediaUrl;
          }
        })
      );
      const filteredPosts = posts.filter(Boolean);
      setRandomPosts(filteredPosts);
    } catch (error) {
      console.error("Veriler çekilirken hata:", error);
    }
  };

  useEffect(() => {
    fetchRandomData();
  }, []);

  return (
    <View style={styles.container}>
    {/* Header */}
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.search}>
          <Icon name="search" style={styles.icon}></Icon>
        </TouchableOpacity>
        <View style={styles.button2Row}>
          <TouchableOpacity style={styles.option1}>
            <Text style={styles.cevremde}>Çevremde</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option2}>
            <Text style={styles.dunyada}>Dünyada</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Feed Cards */}
    <View style={styles.gridContainer}>
          <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={false} 
            >
        {/* 1.grup */}
        <View style={styles.rectColumnRow}>
          <View style={styles.rectColumn}>
            <TouchableOpacity style={styles.post1}>
                
              </TouchableOpacity>
            <TouchableOpacity style={styles.post2} />
          </View>
          <View style={styles.rect1Column}>
            <TouchableOpacity style={styles.post3} />
            <TouchableOpacity style={styles.post4} />
          </View>
          <TouchableOpacity style={styles.loop1}>
          {randomLoops[0] ? (
            <>
              {/* Video */}
              <Video
                source={{ uri: randomLoops[0] }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />
              {/* LoopExplore Icon */}
              <View style={styles.iconContainer}>
                <LoopExplore width={30} height={30} />
              </View>
            </>
          ) : (
            <View style={styles.iconContainer}>
              <LoopExplore width={30} height={30} />
            </View>
          )}
        </TouchableOpacity>


        </View>
        {/* 2.grup */}
        <View style={styles.rect10Row}>
        <TouchableOpacity style={styles.loop2}>
          {randomLoops[0] ? (
            <>
              {/* Video */}
              <Video
                source={{ uri: randomLoops[1] }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />
              {/* LoopExplore Icon */}
              <View style={styles.iconContainer}>
                <LoopExplore width={30} height={30} />
              </View>
            </>
          ) : (
            <View style={styles.iconContainer}>
              <LoopExplore width={30} height={30} />
            </View>
          )}
        </TouchableOpacity>
          <View style={styles.rect9Column}>
            <TouchableOpacity style={styles.post5} />
            <TouchableOpacity style={styles.post6} />
          </View>
          <View style={styles.rect8Column}>
            <TouchableOpacity style={styles.post7} />
            <TouchableOpacity style={styles.post8} />
          </View>
        </View>
        {/* 3.grup */}
        <View style={styles.rectColumnRow1}>
          <View style={styles.rectColumn}>
            <TouchableOpacity style={styles.post1} />
            <TouchableOpacity style={styles.post2} />
          </View>
          <View style={styles.rect1Column}>
            <TouchableOpacity style={styles.post3} />
            <TouchableOpacity style={styles.post4} />
          </View>
          <TouchableOpacity style={styles.loop1}>
          {randomLoops[0] ? (
            <>
              {/* Video */}
              <Video
                source={{ uri: randomLoops[2] }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />
              {/* LoopExplore Icon */}
              <View style={styles.iconContainer}>
                <LoopExplore width={30} height={30} />
              </View>
            </>
          ) : (
            <View style={styles.iconContainer}>
              <LoopExplore width={30} height={30} />
            </View>
          )}
        </TouchableOpacity>
        </View>
        {/* 4.grup */}
        <View style={styles.rect10Row}>
        <TouchableOpacity style={styles.loop2}>
          {randomLoops[0] ? (
            <>
              {/* Video */}
              <Video
                source={{ uri: randomLoops[3] }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
              />
              {/* LoopExplore Icon */}
              <View style={styles.iconContainer}>
                <LoopExplore width={30} height={30} />
              </View>
            </>
          ) : (
            <View style={styles.iconContainer}>
              <LoopExplore width={30} height={30} />
            </View>
          )}
        </TouchableOpacity>
          <View style={styles.rect9Column}>
            <TouchableOpacity style={styles.post5} />
            <TouchableOpacity style={styles.post6} />
          </View>
          <View style={styles.rect8Column}>
            <TouchableOpacity style={styles.post7} />
            <TouchableOpacity style={styles.post8} />
          </View>
        </View>
      </ScrollView>
    </View>

  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Dikey hizalama
    alignItems: "center", // Yatay hizalama
    backgroundColor: "#fff",
    padding: 10,
  },
  gridContainer: {
    justifyContent: "center", // Dikey hizalama
    alignItems: "center", // Yatay hizalama
    marginTop: 10, // Header ile grid arasında boşluk
    backgroundColor:'white'
  },
  //header
  header:{
    marginTop:280,
  },
  
  search: {
    width: 352,
    height: 40,
    backgroundColor: "#E6E6E6",
    borderRadius: 42,
    alignSelf: "center",
    marginTop:-100,
  },
  icon: {
    color: "black",
    fontSize: 33,
    height: 35,
    width: 33,
    marginTop: 6,
    marginLeft: 7
  },
  option1: {
    width: 170,
    height: 49,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 25,
    alignItems:'center',
    justifyContent:'center'
    
  },
  cevremde: {
    fontFamily: "ms-bold",
    color: "rgba(255,255,255,1)",
    fontSize:16,

  },
  option2: {
    width: 170,
    height: 49,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 25,
    marginLeft:10,
    alignItems:'center',
    justifyContent:'center'
   
  },
  dunyada: {
    fontFamily: "ms-bold",
    color: "rgba(255,255,255,1)",
    fontSize:16,
  },
  button2Row: {
    height: 42,
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 23,
    marginRight: 26
  },
  //cards
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Resmin kutuya sığmasını sağlar
  },
  
  scrollContent: {
    flexGrow: 1, // İçeriğin tamamını kapsamasını sağlar
    justifyContent: "center",
    alignItems: "center",
  },
  
  post1: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  post2: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  rectColumn: {
    width: 114,
  },
  post3: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
  },
  post4: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  rect1Column: {
    width: 114,
    marginLeft: 11,
  },
  loop1: {
    width: 114,
    height: 220,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginLeft: 8,
    overflow: "hidden", // Arka plan resminin köşelere taşmasını engellemek için
  },
  video: {
    width: "100%", // Kutunun tamamını kaplayacak
    height: "100%", // Kutunun tamamını kaplayacak
    
  },
  iconContainer: {
    position: "absolute", // İkonu kutu içinde konumlandırmak için
    top: 10, // Üst kenardan mesafe
    right: 10, // Sağ kenardan mesafe
  },
  
  rectColumnRow: {
    flexDirection: "row",
    marginBottom: 7, // İki grup arasına boşluk
    marginTop:20,
    
  },
  rectColumnRow1: {
    flexDirection: "row",
    marginBottom: 7, // İki grup arasına boşluk
    marginTop:8,
    
  },
  loop2: {
    width: 114,
    height: 220,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
   
    overflow: "hidden", // Arka plan resminin köşelere taşmasını engellemek için
  },
  post5: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
  },
  post6: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  rect9Column: {
    width: 114,
    marginLeft: 8,
  },
  post7: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
  },
  post8: {
    width: 114,
    height: 106,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  rect8Column: {
    width: 114,
    marginLeft: 11,
  },
  rect10Row: {
    flexDirection: "row",
    marginTop: 0,
  },
});

export default SearchScreen;
