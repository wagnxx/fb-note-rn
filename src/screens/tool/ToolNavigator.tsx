import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack'
import ToolIndex from './index';
import ScannerScreen from './ScannerScreen';
import CheckElectron from './CheckElectron';

const Stack = createStackNavigator();

export default function ToolNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ToolIndex"
        component={ToolIndex}
        options={{ title: '工具', headerShown: false }}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: '扫一扫' }}
      />
      <Stack.Screen
        name="CheckElectron"
        component={CheckElectron}
        options={{ title: 'Check Electron' }}
      />
    </Stack.Navigator>
  );
}
