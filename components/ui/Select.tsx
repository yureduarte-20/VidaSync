import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';

interface SelectOption {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    options: SelectOption[];
    value?: string | number | null;
    onSelect: (option: SelectOption) => void;
    placeholder?: string;
    label?: string;
    error?: string;
}

const Select = ({
    options,
    value,
    onSelect,
    placeholder = 'Selecione uma opção',
    label,
    error,
}: CustomSelectProps) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
  
    const selectedOption = options.find(option => option.value === value);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleSelect = (option: SelectOption) => {
        onSelect(option);
        hideModal();
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity onPress={showModal} activeOpacity={0.7}>
                <View style={[
                    styles.selectContainer,
                    { borderColor: error ? theme.colors.error : theme.colors.outline, backgroundColor: theme.colors.background, }
                ]}>
                    <Text style={[
                        styles.selectText,
                        !selectedOption && { color: theme.colors.scrim }
                    ]}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </Text>
                    <IconButton
                        icon="chevron-down"
                        size={20}
                        iconColor={theme.colors.onSurfaceVariant}
                    />
                </View>
            </TouchableOpacity>

            {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

            <Modal
                visible={visible}
                onRequestClose={hideModal}
                transparent
                animationType="slide"
            >
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={hideModal}
                >
                    <Card style={styles.modalCard} onPress={() => { }}>
                        <Card.Title title="Selecione uma opção" />
                        <Card.Content>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value.toString()}
                                ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.optionItem,
                                            value === item.value && { backgroundColor: theme.colors.primaryContainer }
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            value === item.value && { color: theme.colors.primary, fontWeight: 'bold' }
                                        ]}>
                                            {item.label}
                                        </Text>
                                        {value === item.value && (
                                            <IconButton
                                                icon="check"
                                                size={20}
                                                iconColor={theme.colors.primary}
                                            />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        marginBottom: 4,
        fontSize: 14,

        fontWeight: '500',
    },
    selectContainer: {
        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 4,
        height: 56,
        paddingHorizontal: 12,
    },
    selectText: {
        flex: 1,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxHeight: '70%',
    },
    divider: {
        marginVertical: 4,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    optionText: {
        fontSize: 16,
    },
});
export default Select;