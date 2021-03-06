import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#E5E5E5', flex: 1 }}>
    <AppContainer>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.1)"
      />
      <Routes />
    </AppContainer>
  </View>
);

export default App;
