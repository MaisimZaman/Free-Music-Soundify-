import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import AlbunsList from '../../components/AlbunsList';

import api from '../../services/api';
import Axios from 'axios';
import { API_KEY } from '../Search/YoutubeApi';

import { Container, Title } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../../../services/firebase';




export default function Home({navigation}) {
  const [recently, setRecently] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [yourPlaylists, setYourPlaylists] = useState([]);

  useEffect(async() => {
    //const youtubeURL = 'https://www.youtube.com/watch?v=TVowQ4LgwLk';
    //const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
  }, [])

  useEffect(() => {
    const searches = ["Elon Musk", "Jordan Petterson", "Ben Shapiro", "Joe Rogan", "Jeff Bezos"]
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}Interview&key=${API_KEY}`)
      .then(res => {
        const podCastData = res.data.items;
        setPodcasts(podCastData)
        
        
    })

  }, [navigation])

  useEffect(() => {
    const searches = ["Space", "Car", "clasical"]
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}Music&key=${API_KEY}`)
      .then(res => {
        const madeForYou = res.data.items;
        setMadeForYou(madeForYou)
        
        
    })

  }, [navigation])

  useEffect(() => {
    const unsubscribe = db.collection('recentlyPlayed')
                      .doc(auth.currentUser.uid)
                      .collection('userRecents')
                      .onSnapshot((snapshot) => setRecently(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  useEffect(() => {
    async function getData() {
      const response = await api.get('/db');

      //setRecently(response.data.Recently.Playlists);
      //setPodcasts(response.data.PodCasts.Shows);
      //setMadeForYou(response.data.Playlists.MadeForYou);
      setPopularPlaylists(response.data.Playlists.PopularPlaylists);
      setYourPlaylists(response.data.Recently.YourPlaylists);
    }

    getData();
  }, []);

  return (
    <Container>
      <ScrollView>
        <Entypo
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
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {videoId: item.data.videoId, videoThumbNail:item.data.videoThumbNail, videoTitle: item.data.videoTitle, Search: false})}>
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
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: true })}>
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
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: false })}>
            <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
            </TouchableOpacity>
          )}
        />
        <Title>Most Popular Playlists</Title>
        <FlatList
          data={popularPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <AlbunsList name={item.name} photoAlbum={item.photoAlbum} />
          )}
        />
        <Title>Your Playlists</Title>
        <FlatList
          data={yourPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <AlbunsList name={item.name} photoAlbum={item.photoAlbum} />
          )}
        />
      </ScrollView>
    </Container>
  );
}