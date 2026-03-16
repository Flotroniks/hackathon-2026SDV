import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SiteListItemResponse } from '../types/site';
import { formatKg } from '../utils/formatters';

interface SiteCardProps {
  site: SiteListItemResponse;
  onPress: () => void;
}

export function SiteCard({ site, onPress }: SiteCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.code}>{site.code}</Text>
      <Text style={styles.name}>{site.name}</Text>
      <Text style={styles.meta}>{site.city} - {site.totalAreaM2} m2</Text>
      <Text style={styles.value}>{formatKg(site.latestTotalEmissionsKgCo2e)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  code: {
    fontSize: 12,
    color: '#5b6a64',
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2c27',
  },
  meta: {
    fontSize: 12,
    color: '#5b6a64',
    marginTop: 4,
  },
  value: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#2f6f59',
  },
});
