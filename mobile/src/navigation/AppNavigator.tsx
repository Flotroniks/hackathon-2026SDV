import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SiteFormScreen } from '../screens/SiteFormScreen';
import { SiteListScreen } from '../screens/SiteListScreen';
import { SiteResultScreen } from '../screens/SiteResultScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Sites: undefined;
  SiteForm: undefined;
  SiteResult: { siteId: string; siteName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Carbon Platform' }} />
          <Stack.Screen name="Sites" component={SiteListScreen} options={{ title: 'Mes sites' }} />
          <Stack.Screen name="SiteForm" component={SiteFormScreen} options={{ title: 'Nouveau site' }} />
          <Stack.Screen name="SiteResult" component={SiteResultScreen} options={{ title: 'Résultat carbone' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
