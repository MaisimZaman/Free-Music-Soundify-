import React, {useState, useEffect} from 'react';

import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../../../components/Playlist';
import {Text, Alert, StyleSheet, Modal, Pressable, Button, TextInput} from 'react-native'

import {
  Container,
  DownloadMessager,
  SubMessage,
  ContainerButton,
  T//extButton,
} from './styles';
import { TextButton } from '../../../ProfileScreen/ProfileComponents';
import { auth, db } from '../../../../../services/firebase';
import { View } from 'react-native-web';

export default function Downloads({navigation}) {

  const [downloadData, setDownloadData] = useState([]);
  const [playlistSelect, setPlaylistSelect] = useState(false)
  const [playlistTitle, setPlaylistTitle] = useState('')
  const [selectedDownloads, setSelectedDownloads] = useState([])
  //const [modalVisible, setModalVisible] = useState(false);

 


  useEffect(() => {
     db.collection('audioDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userAudios')
                      //.orderBy('creation', 'desc')
                      .onSnapshot((snapshot) => setDownloadData(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    //return unsubscribe;
    
  }, [navigation])


  

  function renderBody(){
    
      return (       
        <FlatList
          data={downloadData}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity

                    onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.data.thumbNail,
                                                                      audioURI: item.data.audio, 
                                                                      title: item.data.title,
                                                                      downloadData: downloadData,
                                                                                  audioID: item.id
                                                                                   })}>
              <Playlist
                name={item.data.title}
                photoAlbum={item.data.thumbNail}
                create={false}
              />
            </TouchableOpacity>
          )}
        />
        
       
      )
      
    
    
    
  }
  
  return (
    <>
      <TextButton
                    contentContainerStyle={{
                        height: 40,
                        marginTop: 10,
                        borderRadius: 30,
                        backgroundColor: "#054c85"
                    }}
                    label="Create a playlist?"
                    onPress={() => navigation.navigate('NamePlaylist')}
                />
      {renderBody()}
     
    </>
  );
}


const styles = StyleSheet.create({
  video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: '#1b1c1f',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 7,
    },
    button1: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginBottom: 20
    },
    button2: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginBottom: 20
    },
    button3: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#054c85',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: "white",
      fontSize: 25
    },
  downloadButton: {
      borderRadius: 30,
      padding: 10,
      elevation: 2,
  },
  image: {
      flex: 1,
      justifyContent: "center"
    },
})