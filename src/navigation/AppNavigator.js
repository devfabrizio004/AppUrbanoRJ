import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import NewReportScreen from '../screens/NewReportScreen';
import DetailScreen from '../screens/DetailScreen';
import StatsScreen from '../screens/StatsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewReport"
        component={NewReportScreen}
        options={{
          title: 'Nova Ocorrência',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: 'Detalhes',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Estatísticas',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray200,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Ocorrências') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Estatísticas') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Sobre') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Ocorrências" component={HomeStack} />
      <Tab.Screen
        name="Estatísticas"
        component={StatsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          title: 'Estatísticas',
        }}
      />
      <Tab.Screen
        name="Sobre"
        component={AboutScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          title: 'Sobre o UrbanoRJ',
        }}
      />
    </Tab.Navigator>
  );
}
