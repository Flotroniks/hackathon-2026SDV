import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createSite } from '../api/siteApi';
import { MaterialInputList } from '../components/MaterialInputList';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { SiteRequest } from '../types/site';

type Props = NativeStackScreenProps<RootStackParamList, 'SiteForm'>;

const initialForm: SiteRequest = {
  name: '',
  code: '',
  address: '',
  city: '',
  country: 'France',
  totalAreaM2: 0,
  parkingSpaces: 0,
  annualEnergyConsumptionKwh: 0,
  energySource: 'ELECTRICITY_GRID',
  employeeCount: 0,
  materials: [
    { materialType: 'CONCRETE', materialLabel: 'Béton', quantity: 0, unit: 'kg' },
  ],
};

export function SiteFormScreen({ navigation }: Props) {
  const [form, setForm] = useState<SiteRequest>(initialForm);

  async function submit() {
    if (!form.name || !form.code) {
      Alert.alert('Validation', 'Le nom et le code sont requis');
      return;
    }
    const siteData = {
      ...form,
      totalAreaM2: form.totalAreaM2 || 500,
      annualEnergyConsumptionKwh: form.annualEnergyConsumptionKwh || 0,
      employeeCount: form.employeeCount || 0,
      parkingSpaces: form.parkingSpaces || 0,
    };
    const created = await createSite(siteData);
    navigation.replace('SiteResult', { siteId: created.id, siteName: form.name });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 12, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>Informations générales</Text>
      <TextInput style={styles.input} placeholder="Nom du site *" placeholderTextColor="#999" value={form.name} onChangeText={(value) => setForm({ ...form, name: value })} />
      <TextInput style={styles.input} placeholder="Code site *" placeholderTextColor="#999" value={form.code} onChangeText={(value) => setForm({ ...form, code: value.toUpperCase() })} />
      <TextInput style={styles.input} placeholder="Adresse" placeholderTextColor="#999" value={form.address} onChangeText={(value) => setForm({ ...form, address: value })} />
      <TextInput style={styles.input} placeholder="Ville" placeholderTextColor="#999" value={form.city} onChangeText={(value) => setForm({ ...form, city: value })} />

      <Text style={styles.sectionTitle}>Caractéristiques</Text>
      <TextInput
        style={styles.input}
        placeholder="Surface (m²) - défaut: 500"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={form.totalAreaM2 ? String(form.totalAreaM2) : ''}
        onChangeText={(value) => setForm({ ...form, totalAreaM2: Number(value) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Employés"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={form.employeeCount ? String(form.employeeCount) : ''}
        onChangeText={(value) => setForm({ ...form, employeeCount: Number(value) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Places parking"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={form.parkingSpaces ? String(form.parkingSpaces) : ''}
        onChangeText={(value) => setForm({ ...form, parkingSpaces: Number(value) || 0 })}
      />

      <Text style={styles.sectionTitle}>Énergie</Text>
      <TextInput
        style={styles.input}
        placeholder="Conso annuelle (kWh)"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={form.annualEnergyConsumptionKwh ? String(form.annualEnergyConsumptionKwh) : ''}
        onChangeText={(value) => setForm({ ...form, annualEnergyConsumptionKwh: Number(value) || 0 })}
      />

      <Text style={styles.sectionTitle}>Matériaux</Text>
      <MaterialInputList
        materials={form.materials}
        onChange={(materials) => setForm({ ...form, materials })}
      />
      
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonLabel}>Créer le site</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2c27',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    width: '100%',
  },
  button: {
    marginTop: 12,
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
