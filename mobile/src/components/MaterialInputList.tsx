import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { MaterialInput } from '../types/site';

interface MaterialInputListProps {
  materials: MaterialInput[];
  onChange: (materials: MaterialInput[]) => void;
}

export function MaterialInputList({ materials, onChange }: MaterialInputListProps) {
  function update(index: number, patch: Partial<MaterialInput>) {
    onChange(materials.map((material, materialIndex) => (materialIndex === index ? { ...material, ...patch } : material)));
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.title}>Materials</Text>
      {materials.map((material, index) => (
        <View key={`${material.materialType}-${index}`} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Label"
            value={material.materialLabel}
            onChangeText={(value) => update(index, { materialLabel: value })}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Qty"
            keyboardType="decimal-pad"
            value={String(material.quantity)}
            onChangeText={(value) => update(index, { quantity: Number(value) || 0 })}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    color: '#1f2c27',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cfd7d3',
  },
});
