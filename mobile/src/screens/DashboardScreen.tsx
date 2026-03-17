import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDashboardSummary, fetchEmissionTrend, fetchTopSites } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import type { DashboardSummaryResponse, EmissionTrendPointResponse, TopSiteResponse } from '../types/dashboard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const screenWidth = Dimensions.get('window').width;

export function DashboardScreen({ navigation }: Props) {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [trend, setTrend] = useState<EmissionTrendPointResponse[]>([]);
  const [topSites, setTopSites] = useState<TopSiteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useAuth();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryData, trendData, topData] = await Promise.all([
        fetchDashboardSummary(),
        fetchEmissionTrend(),
        fetchTopSites(5),
      ]);
      setSummary(summaryData);
      setTrend(trendData);
      setTopSites(topData);
    } catch {
      setSummary(null);
      setTrend([]);
      setTopSites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const chartData = {
    labels: trend.slice(-7).map((t) => t.day.slice(5)),
    datasets: [
      {
        data: trend.slice(-7).map((t) => t.totalEmissionsKgCo2e || 0),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Pressable style={styles.ghost} onPress={() => signOut()}>
          <Text style={styles.ghostLabel}>Déconnexion</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2f6f59" />
      ) : (
        <>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{summary?.siteCount ?? 0}</Text>
              <Text style={styles.kpiLabel}>Sites</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{summary?.totalEmissionsKgCo2e?.toFixed(0) ?? 0}</Text>
              <Text style={styles.kpiLabel}>kg CO₂e</Text>
            </View>
          </View>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{summary?.averageCo2PerM2Kg?.toFixed(1) ?? 0}</Text>
              <Text style={styles.kpiLabel}>kg CO₂e/m²</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{summary?.calculationCount ?? 0}</Text>
              <Text style={styles.kpiLabel}>Calculs</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Sites Émetteurs</Text>
            {topSites.length === 0 ? (
              <Text style={styles.emptyText}>Aucun site calculé</Text>
            ) : (
              topSites.map((site) => (
                <Pressable
                  key={site.siteId}
                  style={styles.siteRow}
                  onPress={() => navigation.navigate('SiteResult', { siteId: site.siteId, siteName: site.siteName })}
                >
                  <View>
                    <Text style={styles.siteName}>{site.siteName}</Text>
                    <Text style={styles.siteCode}>{site.siteCode}</Text>
                  </View>
                  <Text style={styles.siteEmission}>{site.totalEmissionsKgCo2e.toFixed(0)} kg</Text>
                </Pressable>
              ))
            )}
          </View>

          {trend.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Émissions - 7 derniers jours</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={200}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(47, 111, 89, ${opacity})`,
                  labelColor: () => '#5b6a64',
                  style: { borderRadius: 16 },
                  propsForDots: { r: '4', strokeWidth: '2', stroke: '#2f6f59' },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          )}

          <Pressable style={styles.button} onPress={() => navigation.navigate('SiteForm')}>
            <Text style={styles.buttonLabel}>+ Nouveau site</Text>
          </Pressable>

          <Pressable style={styles.secondary} onPress={() => navigation.navigate('Sites')}>
            <Text style={styles.secondaryLabel}>Voir tous les sites</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1ea',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2c27',
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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f6f59',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#5b6a64',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2c27',
    marginBottom: 12,
  },
  siteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  siteName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2c27',
  },
  siteCode: {
    fontSize: 12,
    color: '#5b6a64',
  },
  siteEmission: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f6f59',
  },
  emptyText: {
    color: '#5b6a64',
    textAlign: 'center',
    paddingVertical: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#2f6f59',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondary: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryLabel: {
    color: '#2f6f59',
    fontWeight: '600',
  },
});
