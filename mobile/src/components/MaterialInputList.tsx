import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { MaterialInput } from '../types/site';

interface MaterialInputListProps {
  materials: MaterialInput[];
  onChange: (materials: MaterialInput[]) => void;
}

export function MaterialInputList({ materials, onChange }: MaterialInputListProps) {
  function update(index: number, patch: Partial<MaterialInput>) {
    onChange(materials.map((material, materialIndex) => (materialIndex === index ? { ...material, ...patch } : material)));
  }

  function addMaterial() {
    onChange([...materials, { materialType: 'OTHER', materialLabel: '', quantity: 0, unit: 'kg' }]);
  }

  function removeMaterial(index: number) {
    if (materials.length > 1) {
      onChange(materials.filter((_, materialIndex) => materialIndex !== index));
    }
  }

  return (
    <View style={{ gap: 8, width: '100%' }}>
      <Text style={styles.title}>Matériaux</Text>
      {materials.map((material, index) => (
        <View key={`${material.materialType}-${index}`} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Libellé (ex: Béton)"
            placeholderTextColor="#999"
            value={material.materialLabel}
            onChangeText={(value) => update(index, { materialLabel: value })}
          />
          <TextInput
            style={[styles.inputQty, { flex: 1 }]}
            placeholder="Qté (kg)"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={material.quantity ? String(material.quantity) : ''}
            onChangeText={(value) => update(index, { quantity: Number(value) || 0 })}
          />
          <Pressable style={styles.removeBtn} onPress={() => removeMaterial(index)}>
            <Text style={styles.removeBtnText}>✕</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.addBtn} onPress={addMaterial}>
        <Text style={styles.addBtnText}>+ Ajouter un matériau</Text>
      </Pressable>
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
    alignItems: 'center',
    gap: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cfd7d3',
  },
  inputQty: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cfd7d3',
    minWidth: 80,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#c84f4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#2f6f59',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
