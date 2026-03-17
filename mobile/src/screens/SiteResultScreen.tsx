import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { calculateSite, fetchLatestCalculation } from '../api/calculationApi';
import { ResultSummaryCard } from '../components/ResultSummaryCard';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { CalculationResponse } from '../types/calculation';

type Props = NativeStackScreenProps<RootStackParamList, 'SiteResult'>;

export function SiteResultScreen({ route }: Props) {
  const { siteId, siteName } = route.params;
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const latest = await fetchLatestCalculation(siteId);
      setResult(latest);
    } catch {
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [siteId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function runCalculation() {
    try {
      const latest = await calculateSite(siteId);
      setResult(latest);
    } catch {
      Alert.alert('Erreur', 'Impossible de lancer le calcul');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
      <Text style={styles.title}>{siteName}</Text>
      {isLoading ? <ActivityIndicator /> : null}
      {result ? <ResultSummaryCard result={result} /> : <Text style={styles.empty}>Aucun résultat enregistré.</Text>}
      <Pressable style={styles.button} onPress={runCalculation}>
        <Text style={styles.buttonLabel}>Lancer le calcul</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1ea',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2c27',
  },
  empty: {
    color: '#5b6a64',
  },
  button: {
    backgroundColor: '#2f6f59',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
