import styled from 'styled-components/native';

export const Container = styled.View`
  width: ${(props) => (props.recentPlayed ? 140 : 135)}px;
  height: ${(props) => (props.recentPlayed ? 150 : 160)}px;
 
  margin: 0px 10px 8px;
`;

export const Image = styled.Image.attrs({
  resizeMode: 'cover',
})`
  height: 90%;
  width: 100%;
  border-radius: 15px;
  background: #80808055;
  align-self: center;
`;
export const AlbumInformation = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 5px 0px;
  height: 40px;
`;
export const Title = styled.Text`
  font-size: ${(props) => (props.podcast ? 13 : 11)}px;
  color: #fff;
  margin-left: ${(props) => (props.podcast ? 0 : 5)}px;
`;