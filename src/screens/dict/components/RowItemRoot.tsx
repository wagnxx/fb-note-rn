import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { TableRow } from '../word-root'
import { useTheme } from 'react-native-paper'

const RowItemRoot: FC<{
  item: TableRow
  onPressItem: (urls: string[]) => void
}> = ({ item, onPressItem }) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.rootText, { color: theme.colors.primary }]}>{item.root.toString()}</Text>
      {item.isScreenDocUploaded && (item.screenDoc?.length || 0) > 0 && (
        <View style={styles.docListContainer}>
          {item.screenDoc!.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={styles.docItem}
              onPress={() => onPressItem(doc.screenshots)}
            >
              <Text style={[styles.docName, { color: theme.colors.accent }]}>{doc.docName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  rootText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  docListContainer: {
    marginLeft: 12,
  },
  docItem: {
    paddingVertical: 4,
  },
  docName: {
    fontSize: 14,
    fontWeight: 'normal',
  },
})

export default RowItemRoot
