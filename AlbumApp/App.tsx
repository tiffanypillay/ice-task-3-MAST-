import { useState, type ComponentType, type ReactNode } from 'react';
import {Alert,FlatList,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';

type PickerComponentProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
};

let Picker: (ComponentType<PickerComponentProps> & {
  Item: ComponentType<{ label: string; value: string }>;
}) | null = null;

try {
  const pickerModule = require('@react-native-picker/picker');
  Picker = pickerModule.Picker;
} catch {
  Picker = (({ selectedValue, onValueChange }: PickerComponentProps) => (
    <TextInput
      style={styles.input}
      placeholder="Select a genre"
      value={selectedValue}
      onChangeText={onValueChange}
    />
  )) as ComponentType<PickerComponentProps> & {
    Item: ComponentType<{ label: string; value: string }>;
  };

  Picker.Item = ({ label }: { label: string; value: string }) => (
    <Text style={styles.label}>{label}</Text>
  );
}

type Album = {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  rating: string;
};

const genres: string[] = [
  'Alternative',
  'Blues',
  'Classical',
  'Country',
  'Electronic',
  'Hip Hop',
  'Jazz',
  'Metal',
  'Pop',
  'R&B',
  'Reggae',
  'Rock',
  'Soundtrack',
  'Soul',
  'Other',
];

const MIN_TEXT_LENGTH = 2;
const MAX_TITLE_LENGTH = 50;
const MAX_ARTIST_LENGTH = 50;
const MIN_YEAR = 1900;
const MAX_RATING = 5;

export default function App() {
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [rating, setRating] = useState<string>('');

  const [albums, setAlbums] = useState<Album[]>([]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter an album title.');
      return false;
    }

    // FIX 2: Replaced logical AND (&&) with logical OR (||).
    // A string cannot be simultaneously less than MIN and greater than MAX.
    if (
      title.trim().length < MIN_TEXT_LENGTH ||
      title.trim().length > MAX_TITLE_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Album title must contain between ${MIN_TEXT_LENGTH} and ${MAX_TITLE_LENGTH} characters.`
      );
      return false;
    }

    if (!artist.trim()) {
      Alert.alert('Validation Error', 'Please enter an artist name.');
      return false;
    }

    // FIX 3: Replaced logical AND (&&) with logical OR (||).
    if (
      artist.trim().length < MIN_TEXT_LENGTH ||
      artist.trim().length > MAX_ARTIST_LENGTH
    ) {
      Alert.alert(
        'Validation Error',
        `Artist name must contain between ${MIN_TEXT_LENGTH} and ${MAX_ARTIST_LENGTH} characters.`
      );
      return false;
    }

    if (!year.trim()) {
      Alert.alert('Validation Error', 'Please enter an album release year.');
      return false;
    }

    const numericYear = Number(year);

    if (!Number.isInteger(numericYear)) {
      Alert.alert('Validation Error', 'Album year must be a whole number.');
      return false;
    }

    const currentYear = new Date().getFullYear();

    // FIX 4: Added upper boundary check `numericYear > currentYear` to reject future years.
    if (numericYear < MIN_YEAR || numericYear > currentYear) {
      Alert.alert(
        'Validation Error',
        `Album year must be between ${MIN_YEAR} and ${currentYear}.`
      );
      return false;
    }

    if (!genre) {
      Alert.alert('Validation Error', 'Please select a genre.');
      return false;
    }

    if (!rating.trim()) {
      Alert.alert('Validation Error', 'Please enter a rating.');
      return false;
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating)) {
      Alert.alert('Validation Error', 'Rating must be a whole number.');
      return false;
    }

    // FIX 5: Added upper bound check `numericRating > MAX_RATING` to validate the full 1-5 range.
    if (numericRating < 1 || numericRating > MAX_RATING) {
      Alert.alert(
        'Validation Error',
        `Rating must be between 1 and ${MAX_RATING}.`
      );
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // FIX 6: Preserved `year` and `rating` as strings (`.trim()`) to comply with the `Album` TypeScript type declaration.
    const temporaryAlbum: Album = {
      id: Date.now().toString(),
      title: title.trim(),
      artist: artist.trim(),
      year: year.trim(),
      genre: genre,
      rating: rating.trim(),
    };

    // FIX 7: Used functional updater `[...currentAlbums, temporaryAlbum]` to append the new album instead of overwriting the array.
    setAlbums((currentAlbums) => [...currentAlbums, temporaryAlbum]);

    setTitle('');
    setArtist('');
    setYear('');
    setGenre('');
    setRating('');
  };

  const handleDelete = (id: string) => {
    // FIX 8: Changed filter condition from `album.id === id` to `album.id !== id` so the target album is deleted rather than kept.
    setAlbums((currentAlbums) =>
      currentAlbums.filter((album) => album.id !== id)
    );
  };

  const renderAlbum = ({ item }: { item: Album }) => (
    <View style={styles.albumCard}>
      <View style={styles.albumInformation}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.albumArtist}>{item.artist}</Text>
        <Text>Year: {item.year}</Text>
        <Text>Genre: {item.genre}</Text>
        <Text>Rating: {item.rating}/5</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Album Collection</Text>

      <Text style={styles.label}>Album Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter album title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Artist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter artist name"
        value={artist}
        onChangeText={setArtist}
      />

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter release year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Genre</Text>

      {/* FIX 9: Changed `selectedValue={title}` to `selectedValue={genre}` */}
      <Picker
        selectedValue={genre}
        onValueChange={(value) => setGenre(value)}
      >
        <Picker.Item label="Select a genre..." value="" />

        {/* FIX 10: Changed item value from `value={genre}` to `value={item}` so each option passes its own genre string */}
        {genres.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Rating</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter rating from 1 to 5"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Add to Favourites</Text>
      </TouchableOpacity>

      <Text style={styles.collectionHeading}>
        My Favourite Albums ({albums.length})
      </Text>

      {/* FIX 11: Changed `keyExtractor={(item) => item.title}` to `(item) => item.id` to avoid key collisions on duplicate album titles */}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderAlbum}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No albums have been added yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  collectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  albumInformation: {
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  albumArtist: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 20,
    fontStyle: 'italic',
  },
});