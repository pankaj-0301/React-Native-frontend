import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiClient from '../utils/apiClient';

export default function TransactionsScreen({ route }) {
    const { userId } = route.params;
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [friends, setFriends] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);
    
    // Filter states
    const [filterSplit, setFilterSplit] = useState('all'); // 'all', 'split', 'unsplit'
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    useEffect(() => {
        // Fetch transactions
        apiClient.get(`/api/transactions?userId=${userId}&_t=${Date.now()}`)
            .then((response) => {
                setTransactions(response.data);
                setFilteredTransactions(response.data);
            })
            .catch((error) => console.error(error));
        
        // Fetch friends
        apiClient.get(`/api/friends?userId=${userId}&_t=${Date.now()}`)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setFriends(response.data);
                } else {
                    console.error("Unexpected friends response format:", response.data);
                    setFriends([]);
                }
            })
            .catch((error) => console.error(error));
    }, [userId]);

    const applyFilters = () => {
        let filtered = [...transactions];
        
        // Filter by split status
        if (filterSplit === 'split') {
            filtered = filtered.filter(t => t.splitWith && t.splitWith.length > 0);
        } else if (filterSplit === 'unsplit') {
            filtered = filtered.filter(t => !t.splitWith || t.splitWith.length === 0);
        }
        
        // Filter by date range
        if (filterStartDate) {
            filtered = filtered.filter(t => new Date(t.date) >= filterStartDate);
        }
        if (filterEndDate) {
            filtered = filtered.filter(t => new Date(t.date) <= filterEndDate);
        }
        
        // Filter by amount
        if (filterMinAmount) {
            filtered = filtered.filter(t => t.amount >= parseFloat(filterMinAmount));
        }
        if (filterMaxAmount) {
            filtered = filtered.filter(t => t.amount <= parseFloat(filterMaxAmount));
        }
        
        setFilteredTransactions(filtered);
        setFilterModalVisible(false);
    };

    const resetFilters = () => {
        setFilterSplit('all');
        setFilterStartDate(null);
        setFilterEndDate(null);
        setFilterMinAmount('');
        setFilterMaxAmount('');
        setFilteredTransactions(transactions);
        setFilterModalVisible(false);
    };

    const handleSplitTransaction = async () => {
        if (!selectedTransaction || selectedFriends.length === 0) return;
        
        try {
            await apiClient.post('/api/split-transaction', {
                transactionId: selectedTransaction.id,
                friendIds: selectedFriends
            });
            
            // Refresh transactions after splitting
            const response = await apiClient.get(`/api/transactions?userId=${userId}&_t=${Date.now()}`);
            setTransactions(response.data);
            applyFilters(); // Re-apply filters to updated data
            
            // Reset and close modal
            setSelectedFriends([]);
            setModalVisible(false);
        } catch (error) {
            console.error('Error splitting transaction:', error);
        }
    };

    const toggleFriendSelection = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const openSplitModal = (transaction) => {
        setSelectedTransaction(transaction);
        setSelectedFriends([]);
        setModalVisible(true);
    };

    const renderRightActions = (transaction) => {
        return (
            <TouchableOpacity 
                style={styles.rightAction}
                onPress={() => openSplitModal(transaction)}
            >
                <Text style={styles.actionText}>Split</Text>
            </TouchableOpacity>
        );
    };

    const renderTransaction = ({ item }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item)}
            overshootRight={false}
        >
            <View style={styles.transactionCard}>
                <Text style={styles.transactionText}>{item.description} - ₹{item.amount}</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                {item.splitWith && item.splitWith.length > 0 && (
                    <Text style={styles.splitLabel}>
                        ✓ Split with {item.splitWith.length} {item.splitWith.length === 1 ? 'person' : 'people'}
                    </Text>
                )}
            </View>
        </Swipeable>
    );

    const formatDate = (date) => {
        if (!date) return 'Select date';
        return date.toLocaleDateString();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    {/* <Text style={styles.headerTitle}>Transactions</Text> */}
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>Filter</Text>
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTransaction}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyListText}>No transactions found</Text>
                    }
                />

                {/* Split Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Split Transaction</Text>
                            <Text style={styles.modalSubtitle}>
                                {selectedTransaction?.description} - ₹{selectedTransaction?.amount}
                            </Text>
                            
                            <Text style={styles.friendsTitle}>Select Friends to Split With:</Text>
                            
                            {friends.length > 0 ? (
                                <FlatList
                                    data={friends}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.friendItem,
                                                selectedFriends.includes(item.id) && styles.selectedFriend
                                            ]}
                                            onPress={() => toggleFriendSelection(item.id)}
                                        >
                                            <Text style={styles.friendName}>{item.name}</Text>
                                            {selectedFriends.includes(item.id) && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <Text style={styles.noFriendsText}>No friends found</Text>
                            )}
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.cancelButton]} 
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[
                                        styles.button, 
                                        styles.splitButton,
                                        selectedFriends.length === 0 && styles.disabledButton
                                    ]} 
                                    onPress={handleSplitTransaction}
                                    disabled={selectedFriends.length === 0}
                                >
                                    <Text style={styles.buttonText}>Split</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Filter Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filterModalVisible}
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <ScrollView style={styles.filterModalContent}>
                            <Text style={styles.modalTitle}>Filter Transactions</Text>
                            
                            {/* Split Status Filter */}
                            <Text style={styles.filterSectionTitle}>Split Status</Text>
                            <View style={styles.filterOptions}>
                                <TouchableOpacity 
                                    style={[styles.filterOption, filterSplit === 'all' && styles.selectedFilterOption]}
                                    onPress={() => setFilterSplit('all')}
                                >
                                    <Text style={styles.filterOptionText}>All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.filterOption, filterSplit === 'split' && styles.selectedFilterOption]}
                                    onPress={() => setFilterSplit('split')}
                                >
                                    <Text style={styles.filterOptionText}>Split</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.filterOption, filterSplit === 'unsplit' && styles.selectedFilterOption]}
                                    onPress={() => setFilterSplit('unsplit')}
                                >
                                    <Text style={styles.filterOptionText}>Unsplit</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Date Range Filter */}
                            <Text style={styles.filterSectionTitle}>Date Range</Text>
                            <View style={styles.datePickerContainer}>
                                <TouchableOpacity 
                                    style={styles.datePickerButton}
                                    onPress={() => setShowStartDatePicker(true)}
                                >
                                    <Text>{filterStartDate ? formatDate(filterStartDate) : 'Start Date'}</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.dateRangeSeparator}>to</Text>
                                
                                <TouchableOpacity 
                                    style={styles.datePickerButton}
                                    onPress={() => setShowEndDatePicker(true)}
                                >
                                    <Text>{filterEndDate ? formatDate(filterEndDate) : 'End Date'}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={filterStartDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (selectedDate) {
                                            setFilterStartDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                            
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={filterEndDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) {
                                            setFilterEndDate(selectedDate);
                                        }
                                    }}
                                />
                            )}
                            
                            {/* Amount Range Filter */}
                            <Text style={styles.filterSectionTitle}>Amount Range</Text>
                            <View style={styles.amountRangeContainer}>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="Min Amount"
                                    keyboardType="numeric"
                                    value={filterMinAmount}
                                    onChangeText={setFilterMinAmount}
                                />
                                
                                <Text style={styles.amountRangeSeparator}>to</Text>
                                
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="Max Amount"
                                    keyboardType="numeric"
                                    value={filterMaxAmount}
                                    onChangeText={setFilterMaxAmount}
                                />
                            </View>
                            
                            <View style={styles.filterButtons}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.resetButton]} 
                                    onPress={resetFilters}
                                >
                                    <Text style={styles.buttonText}>Reset</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.button, styles.applyButton]} 
                                    onPress={applyFilters}
                                >
                                    <Text style={styles.buttonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 10,
    },
    transactionCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 2,
    },
    transactionText: {
        fontSize: 16,
        color: '#333',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    splitLabel: {
        fontSize: 14,
        color: '#4caf50',
        marginTop: 5,
    },
    rightAction: {
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 100,
        height: '100%',
        borderRadius: 8,
        marginVertical: 5,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    filterModalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    friendsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedFriend: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    friendName: {
        fontSize: 16,
    },
    checkmark: {
        color: '#4caf50',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noFriendsText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 20,
    },
    emptyListText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 50,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    splitButton: {
        backgroundColor: '#4caf50',
    },
    disabledButton: {
        backgroundColor: '#a5d6a7',
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    filterOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    filterOption: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedFilterOption: {
        backgroundColor: '#4caf50',
    },
    filterOptionText: {
        fontWeight: '500',
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    datePickerButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    dateRangeSeparator: {
        marginHorizontal: 10,
    },
    amountRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    amountInput: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        textAlign: 'center',
    },
    amountRangeSeparator: {
        marginHorizontal: 10,
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: '#f44336',
    },
    applyButton: {
        backgroundColor: '#4caf50',
    },
});
