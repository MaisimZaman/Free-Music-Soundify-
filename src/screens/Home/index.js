import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, ImageBackground, StyleSheet } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import AlbunsList from '../../components/AlbunsList';

import api from '../../services/api';
import Axios from 'axios';
import { API_KEY } from '../Search/YoutubeApi';

import { Container, Title } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../../../services/firebase';
import { BG_IMAGE } from '../../services/backgroundImage';


export default function Home({navigation}) {

  const [recently, setRecently] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [yourPlaylists, setYourPlaylists] = useState([]);
  const [recordList, setRecordList] = useState([])
  const [playListRecordList, setPlayListRecordList] = useState([])
  //const [currentPlaylistData, setCurrentPlaylistData] = useState([])


  useEffect(() => {
    var docRef = db.collection("searchRecord").doc(auth.currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {

        if (doc.data().recordList!= undefined){
          setRecordList(doc.data().recordList)
        }
        if (doc.data().playListRecordList != undefined){
          setPlayListRecordList(doc.data().playListRecordList)
        }
          
          
      } else {
         setRecordList([])
         setPlayListRecordList([])
        
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }, [])


  



  useEffect(() => {

    const searches = ["Elon Musk",   "millionaire mindset speach",  'motivational videos']
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&key=${API_KEY}`)
      .then(res => {
        const podCastData = res.data.items;
        setPodcasts(podCastData)
        
        
    })

  }, [navigation])

  useEffect(() => {
    let searches;

    if (recordList.length == 0){
      searches = ["Space", "Car bass", "aviation short", "clasical", "Adventure"]
    } else {
      searches = recordList
    }
    
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}Music&key=${API_KEY}`)
      .then(res => {
        const madeForYou = res.data.items;
        setMadeForYou(madeForYou)
        
        
    })

  }, [navigation, recordList])

  useEffect(() => {
    let searches;
    if (playListRecordList.length == 0){
       searches = ["Car Music",   "Relaxing Music", "Adventure Music", "Study Music"]
    } else {
      searches = playListRecordList
    }
    
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&type=playlist&key=${API_KEY}`)
      .then(res => {
        const popularPlaylists = res.data.items;
        setPopularPlaylists(popularPlaylists)
        
        //getPlayListData(popularPlaylists[0].id.playlistId)
        
        
        
    })

  }, [navigation, playListRecordList])

  useEffect(() => {
    let unsubscribe = db.collection('playlists')
                      .doc(auth.currentUser.uid)
                      .collection('userPlaylists')
                      .onSnapshot((snapshot) => setYourPlaylists(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  useEffect(() => {
    const unsubscribe = db.collection('recentlyPlayed')
                      .doc(auth.currentUser.uid)
                      .collection('userRecents')
                      .orderBy('creation', 'desc')
                      .onSnapshot((snapshot) => setRecently(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])


   async function getPlayListData(item, playlistId){
   
    
    let response = []
      response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlistId}&key=${API_KEY}`)  
      if (response != []){

        const playlistVideos = response.data.items
        //const videoId = playlistVideos[0].snippet.resourceId.videoId
        const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
        const videoTitle = playlistVideos[0].snippet.title
        
        
        
        
        navigation.navigate("AlbumScreen", {title:videoTitle, photoAlbum: videoThumbNail, playlistVideos: playlistVideos, isCustom: false })
      
      }

    

    

   
    
    

    

  }


  function signOutUser(){
    if (auth.currentUser.uid != null &&  auth.currentUser.uid != undefined){
      auth.signOut().then(() => {
          navigation.replace('Login')
      })
  }
  }

  

  return (
    <ImageBackground style={styles.image} source={ BG_IMAGE}>
    <Container>
      <ScrollView>
        <Entypo
          onPress={signOutUser}
          name="cog"
          size={25}
          color="#acacac"
          style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10 }}
        />
        
        <Title>Recently Played</Title>
        <FlatList
          data={recently}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', { rId: item.id, videoId: item.data.videoId, videoThumbNail:item.data.videoThumbNail, videoTitle: item.data.videoTitle, artist: item.data.videoArtist, Search: false, isRecently: true, downloadData: recently, channelId: item.data.channelId})}>
              <AlbunsList
                name={item.data.videoTitle}
                photoAlbum={item.data.videoThumbNail}
                recentPlayed
              />
            </TouchableOpacity>
          )}
        />
        <Title>Trending podcasts</Title>
        <FlatList
          data={podcasts}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id,videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: podcasts, isRecently: false, channelId: item.snippet.channelId })}>
              <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} podcast={true} />
            </TouchableOpacity>
          )}
        />
        <Title>Made For you</Title>
        <FlatList
          data={madeForYou}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id, videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: madeForYou, isRecently: false, channelId: item.snippet.channelId })}>
            <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
            </TouchableOpacity>
          )}
        />
        <Title>Most Popular Playlists</Title>
        <FlatList
          data={popularPlaylists}
          keyExtractor={(item) => item.id.playlistId}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => getPlayListData(item, item.id.playlistId)}>
              <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
              </TouchableOpacity>
          )}
        />
        <Title>Your Playlists</Title>
        <FlatList
          data={yourPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("AlbumScreen", {title:item.data.playlistTitle, photoAlbum: item.data.playListThumbnail, playlistVideos: item.data.playlistVideos, isCustom: item.data.isCustom })}>
              <AlbunsList name={item.data.playlistTitle} photoAlbum={item.data.playListThumbnail} />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </Container>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center"
  },
 
});
