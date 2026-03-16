import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSites } from '../api/siteApi';
import { useAuth } from '../context/AuthContext';
import { SiteCard } from '../components/SiteCard';
import type { SiteListItemResponse } from '../types/site';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Sites'>;

export function SiteListScreen({ navigation }: Props) {
  const [sites, setSites] = useState<SiteListItemResponse[]>([]);
  const { signOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchSites().then(setSites);
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Sites</Text>
        <View style={styles.actions}>
          <Pressable style={styles.secondary} onPress={() => navigation.navigate('SiteForm')}>
            <Text style={styles.secondaryLabel}>+ Quick add</Text>
          </Pressable>
          <Pressable style={styles.ghost} onPress={() => signOut()}>
            <Text style={styles.ghostLabel}>Logout</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView>
        {sites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onPress={() => navigation.navigate('SiteResult', { siteId: site.id, siteName: site.name })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1ea',
    padding: 16,
  },
  topRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2c27',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondary: {
    backgroundColor: '#2f6f59',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  secondaryLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  ghost: {
    borderColor: '#2f6f59',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  ghostLabel: {
    color: '#2f6f59',
    fontWeight: '700',
    fontSize: 12,
  },
});
