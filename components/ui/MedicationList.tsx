import { MedicationType } from '@/store/MedicationStore';
import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
type Props = {
    medications: MedicationType[];
};
const MedicationList = ({ medications }: Props) => {
    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ width: '100%'}}
            data={medications}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
                <List.Item
                style={{ width: '100%' }}
                    title={item.name}
                    description={`Apresentação: ${item.presentation}`}
                    left={(props) => <List.Icon {...props} icon="pill" />}
                    right={(props) => (
                        <List.Icon
                            {...props}
                            icon={item.presentation === 'SOLVENT' ? 'water' : 'circle-outline'}
                        />
                    )}
                />
            )}
        />
    );
};

export default MedicationList;