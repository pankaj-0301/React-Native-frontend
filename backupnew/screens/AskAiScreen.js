import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const assistants = [
  { id: 1, name: 'John Doe', specialization: 'Criminal Lawyer', language: 'English', rating: 4.2 },
  { id: 2, name: 'Jane Smith', specialization: 'Consultant', language: 'Hindi', rating: 4.5 },
  { id: 3, name: 'Sarah Lee', specialization: 'Civil Lawyer', language: 'English', rating: 4.0 },
  { id: 4, name: 'Michael Johnson', specialization: 'Family Lawyer', language: 'Spanish', rating: 4.7 },
  { id: 5, name: 'Emily Davis', specialization: 'Immigration Lawyer', language: 'French', rating: 4.3 },
  { id: 6, name: 'David Brown', specialization: 'Tax Consultant', language: 'German', rating: 4.6 },
];


function AskAiScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [lawCategory, setLawCategory] = useState('Law');
  const [crimeCategory, setCrimeCategory] = useState('crime');

  const filteredAssistants =
    selectedFilter === 'All'
      ? assistants
      : assistants.filter((assistant) =>
          selectedFilter === 'Law'
            ? assistant.specialization.includes('Lawyer')
            : assistant.specialization.includes('Consultant')
        );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['All', 'Law', 'Consultant'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dropdowns */}
      <View style={styles.dropdownContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={lawCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setLawCategory(itemValue)}
          >
            <Picker.Item label="Law" value="Law" />
            <Picker.Item label="Law1" value="law1" />
            <Picker.Item label="Law2" value="law2" />
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={crimeCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setCrimeCategory(itemValue)}
          >
            <Picker.Item label="Crime" value="crime" />
            <Picker.Item label="Fraud" value="fraud" />
            <Picker.Item label="Theft" value="theft" />
          </Picker>
        </View>
      </View>

      {/* Assistants List */}
      <FlatList
        data={filteredAssistants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.assistantContainer}>
            <View style={styles.assistantHeader}>
              <Text style={styles.assistantName}>{item.name}</Text>
              <Text style={styles.assistantRating}>{item.rating} ★</Text>
            </View>
            <Text style={styles.assistantDetails}>{item.specialization}</Text>
            <Text style={styles.assistantLanguage}> {item.language}</Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('Chat', { assistant: item })}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cddfe3',
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 27,
    alignItems: 'center',
    backgroundColor: '#A9A9A9',
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 16,
  },
  activeFilterText: {
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#A9A9A9',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  picker: {
    height: 50,
    backgroundColor: 'transparent',
  },
  assistantContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#A9A9A9',
  },
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assistantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assistantRating: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  assistantDetails: {
    fontSize: 14,
    color: '#555',
  },
  assistantLanguage: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-end', // Aligns to the right
    marginTop: 'auto', // Pushes it to the bottom
  },

  chatButtonText: {
    textAlign: 'center',
  },
});

export default AskAiScreen;
