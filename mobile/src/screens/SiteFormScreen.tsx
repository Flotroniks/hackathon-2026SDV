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
  totalAreaM2: 500,
  parkingSpaces: 0,
  annualEnergyConsumptionKwh: 0,
  energySource: 'ELECTRICITY_GRID',
  employeeCount: 0,
  materials: [
    { materialType: 'CONCRETE', materialLabel: 'Concrete structure', quantity: 1000, unit: 'kg' },
  ],
};

export function SiteFormScreen({ navigation }: Props) {
  const [form, setForm] = useState<SiteRequest>(initialForm);

  async function submit() {
    if (!form.name || !form.code) {
      Alert.alert('Validation', 'Name and code are required');
      return;
    }
    const created = await createSite(form);
    navigation.replace('SiteResult', { siteId: created.id, siteName: form.name });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ gap: 10, paddingBottom: 30 }}>
      <TextInput style={styles.input} placeholder="Site name" value={form.name} onChangeText={(value) => setForm({ ...form, name: value })} />
      <TextInput style={styles.input} placeholder="Code" value={form.code} onChangeText={(value) => setForm({ ...form, code: value.toUpperCase() })} />
      <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={(value) => setForm({ ...form, city: value })} />
      <TextInput
        style={styles.input}
        placeholder="Annual energy (kWh)"
        keyboardType="decimal-pad"
        value={String(form.annualEnergyConsumptionKwh)}
        onChangeText={(value) => setForm({ ...form, annualEnergyConsumptionKwh: Number(value) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Total area (m2)"
        keyboardType="decimal-pad"
        value={String(form.totalAreaM2)}
        onChangeText={(value) => setForm({ ...form, totalAreaM2: Number(value) || 0 })}
      />
      <TextInput
        style={styles.input}
        placeholder="Employees"
        keyboardType="number-pad"
        value={String(form.employeeCount)}
        onChangeText={(value) => setForm({ ...form, employeeCount: Number(value) || 0 })}
      />
      <MaterialInputList
        materials={form.materials}
        onChange={(materials) => setForm({ ...form, materials })}
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonLabel}>Create site</Text>
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
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
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
