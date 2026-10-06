**ICE TASK 3 MAST ALBUM APP**

**Name**- Tiffany Pillay

**Student Number**- ST10524721

**Task**- Ice task 3- Album App MAST

___________________________________________________________________________________________________

Edited Code
## 3. Error Log

| # | Location | Problem | Error Type | Correction |
|---|---|---|---|---|
| 1 | `App.tsx` (Imports) | Incorrect import path `@expo/ui/community/picker` causing build failure. | Import / Runtime | Installed and imported `@react-native-picker/picker`. |
| 2 | `App.tsx` (`validateForm`) | Title length check used `&&` (`length < 2 && length > 50`), making validation logically impossible to trigger. | Logic Error | Changed `&&` to `||` so titles shorter than 2 or longer than 50 characters trigger an alert. |
| 3 | `App.tsx` (`validateForm`) | Artist length check used `&&`, making validation logically impossible to trigger. | Logic Error | Changed `&&` to `||` so artist names shorter than 2 or longer than 50 characters trigger an alert. |
| 4 | `App.tsx` (`validateForm`) | Year validation only checked lower bound (`numericYear < 1900`), allowing future release years. | Logic Error | Added `|| numericYear > currentYear` to ensure release years do not exceed the current year. |
| 5 | `App.tsx` (`validateForm`) | Rating validation only checked `numericRating < 1`, allowing values greater than 5. | Logic Error | Updated condition to `numericRating < 1 || numericRating > MAX_RATING` to keep the 1–5 range. |
| 6 | `App.tsx` (`handleSave`) | Saved `year` and `rating` as numbers while the `Album` TypeScript type expected strings. | TypeScript Type Error | Kept `year` and `rating` as strings using `.trim()` to match the `Album` interface. |
| 7 | `App.tsx` (`handleSave`) | `setAlbums([temporaryAlbum])` replaced the entire collection with only the new album. | State Logic | Used functional updater `setAlbums((current) => [...current, temporaryAlbum])` to preserve existing albums. |
| 8 | `App.tsx` (`handleDelete`) | `filter((album) => album.id === id)` kept only the selected album and deleted all others. | Logic Error | Inverted condition to `album.id !== id` so only the selected album is removed. |
| 9 | `App.tsx` (`Picker`) | The `selectedValue` prop was bound to the `title` state instead of `genre`. | Runtime / State | Updated `selectedValue={title}` to `selectedValue={genre}`. |
| 10 | `App.tsx` (`Picker.Item`) | Dropdown items mapped `value={genre}` instead of mapping each item's own value. | Logic Error | Updated mapping to `value={item}` so selected genres save correctly. |
| 11 | `App.tsx` (`FlatList`) | `keyExtractor` used `item.title`, causing duplicate key warnings if two albums shared a title. | React Native / Warning | Updated `keyExtractor` to `(item) => item.id` to ensure unique identifiers. |

___________________________________________________________________________________________________


**Screenshots of app**

<img width="200" height="400" alt="album app" src="https://github.com/user-attachments/assets/b76c0325-5107-43d5-9682-9ac1839107b2" />

App running


<img width="217" height="437" alt="error message" src="https://github.com/user-attachments/assets/9015080f-0446-439e-be70-98deb7a5552e" />

Error message
