import { StyleSheet, Text, View } from 'react-native';
import type { CalculationResponse } from '../types/calculation';
import { formatKg } from '../utils/formatters';

interface ResultSummaryCardProps {
  result: CalculationResponse;
}

export function ResultSummaryCard({ result }: ResultSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dernier résultat</Text>
      <Text style={styles.main}>{formatKg(result.totalEmissionsKgCo2e)}</Text>
      <Text style={styles.detail}>Construction: {formatKg(result.constructionEmissionsKgCo2e)}</Text>
      <Text style={styles.detail}>Exploitation: {formatKg(result.operationEmissionsKgCo2e)}</Text>
      <Text style={styles.detail}>CO2/m2: {result.co2PerM2Kg.toFixed(3)} kg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 12,
    color: '#5b6a64',
    textTransform: 'uppercase',
  },
  main: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    color: '#2f6f59',
  },
  detail: {
    marginTop: 4,
    color: '#1f2c27',
  },
});
