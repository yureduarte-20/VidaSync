import { MedicationType, Presentation } from '@/store/MedicationStore';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
type Props = {
    medications: MedicationType[];
    onItemPress?: (medication: MedicationType, index: number) => void
};

const MedicationList = ({ medications, onItemPress }: Props) => {
    const presentationLabel = useCallback((presentation: Presentation) => {
        const options: Record<Presentation, string> = {
            CAPSULE: 'Cápsula',
            SOLVENT: 'Solvente',
            TABLET: 'Comprimido'
        }
        return options[presentation];
    }, [])
    const itemFactory = useCallback(({ item, index }) => (
        <List.Item
            style={{ width: '100%' }}
            title={item.name}
            onPress={() => onItemPress && onItemPress(item, index)}
            description={`Apresentação: ${presentationLabel(item.presentation)}`}
            left={(props) => <List.Icon {...props} icon="pill" />}
            right={(props) => (
                <List.Icon
                    {...props}
                    icon={item.presentation === 'SOLVENT' ? 'water' : 'circle-outline'}
                />
            )}
        />
    ), [])
    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{}}
            data={medications}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={itemFactory}
        />
    );
};

export default MedicationList;