import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image} from "react-native";
import { Video } from "expo-av";
import LoopExplore from "../../assets/icons/searchicons/LoopExplore";

const ExploreFeed = ({ randomLoops, randomPosts }) => {
  const getRandomMedia = (mediaUrls) => {
    if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
      const randomIndex = Math.floor(Math.random() * mediaUrls.length);
      return mediaUrls[randomIndex];
    }
    return null;
  };

  return (
    <View style={styles.gridContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1st Group */}
        <View style={styles.rectColumnRow}>
          <View style={styles.rectColumn}>
            {/* Post 1 */}
            <TouchableOpacity style={styles.post1}>
              {randomPosts[0] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[0].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
            {/* Post 2 */}
            <TouchableOpacity style={styles.post2}>
              {randomPosts[1] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[1].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.rect1Column}>
            {/* Post 3 */}
            <TouchableOpacity style={styles.post3}>
              {randomPosts[2] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[2].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
            {/* Post 4 */}
            <TouchableOpacity style={styles.post4}>
              {randomPosts[3] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[3].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
          </View>
          {/* Loop 1 */}
          <TouchableOpacity style={styles.loop1}>
            {randomLoops[0] ? (
              <>
                <Video
                  source={{ uri: randomLoops[0] }}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  isMuted
                />
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

         {/* 2nd Group */}
         <View style={styles.rectColumnRow}>
          {/* Loop 2 */}
          <TouchableOpacity style={styles.loop2}>
            {randomLoops[0] ? (
              <>
                <Video
                  source={{ uri: randomLoops[3] }}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  isMuted
                />
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
          <View style={styles.rectColumn}>
            {/* Post 1 */}
            <TouchableOpacity style={styles.post1}>
              {randomPosts[0] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[5].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
            {/* Post 2 */}
            <TouchableOpacity style={styles.post2}>
              {randomPosts[1] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[6].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.rect1Column}>
            {/* Post 3 */}
            <TouchableOpacity style={styles.post3}>
              {randomPosts[2] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[7].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
            {/* Post 4 */}
            <TouchableOpacity style={styles.post4}>
              {randomPosts[3] &&
                (() => {
                  const randomMedia = getRandomMedia(randomPosts[8].mediaUrls);
                  return (
                    randomMedia && (
                      <Image source={{ uri: randomMedia.uri }} style={styles.image} />
                    )
                  );
                })()}
            </TouchableOpacity>
          </View>
          
        </View>


      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "white",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  rectColumnRow: {
    flexDirection: "row",
    marginBottom: 7,
  },
  rectColumn: {
    width: 114,
  },
  image: {
    width: 116,
    height: 108,
    borderRadius: 11,
  },
  post1: {
    width: 116,
    height: 108,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    overflow: "hidden",
  },
  post2: {
    width: 116,
    height: 108,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  rect1Column: {
    width: 116,
    marginLeft: 7,
  },
  post3: {
    width: 116,
    height: 108,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
  },
  post4: {
    width: 116,
    height: 108,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginTop: 8,
  },
  loop1: {
    width: 116,
    height: 224,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginLeft: 7,
    overflow: "hidden",
  },
  loop2: {
    width: 116,
    height: 224,
    backgroundColor: "#E6E6E6",
    borderRadius: 11,
    marginRight: 7,
    overflow: "hidden",
   },
  video: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ExploreFeed;
