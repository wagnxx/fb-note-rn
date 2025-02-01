import { View, FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { getWordRoots, WordRootType } from '@/service/dictManage'
import { getAllScreenshotDoc, ScreenshotDocType } from '@/service/screenshotDoc'
import { auth } from '@/firebase/auth'
import { useTheme, ActivityIndicator } from 'react-native-paper'
import RowItemRoot from './components/RowItemRoot'
import ImageViewerModal from './components/ImageViewerModal'

export type TableRow = WordRootType & {
  isScreenDocUploaded?: boolean
  screenDoc?: ScreenshotDocType[]
}

const WordRoot = () => {
  const [dataSource, setDataSource] = useState<TableRow[]>([])
  const [filteredData, setFilteredData] = useState<TableRow[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([])

  const theme = useTheme()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [pageTotal, setPageTotal] = useState(0)

  const getTableData = useCallback(async () => {
    if (!auth?.currentUser?.uid) return
    setLoading(true)
    try {
      const [roots, screen = []] = await Promise.all([
        getWordRoots({
          pageNumber: currentPage,
          pageSize,
        }),
        getAllScreenshotDoc(),
      ])

      if (roots.data) {
        const data: TableRow[] = roots.data
          .map(item => {
            const combined = { ...item } as TableRow
            const tarDocs = screen.filter(doc => item.root && doc.keyTerms?.includes(item.root))
            if (tarDocs.length) {
              combined.isScreenDocUploaded = true
              combined.screenDoc = tarDocs
            }
            return combined
          })
          .sort((a, b) => a.key - b.key)

        setDataSource(data)
        setFilteredData(data)
        setPageTotal(roots.total)
      } else {
        setDataSource([])
        setPageTotal(0)
      }
    } catch (error) {
      console.error('Error fetching data: ', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    console.log(
      'start getTableData =============================================================== ',
    )
    getTableData()
    return () => {
      console.log('unmounted WordRoot component.')
    }
  }, [])

  const onPressItem = (urls: string[]) => {
    setSelectedImageUrls(urls)
    setVisible(true)
  }

  const closeModal = () => setVisible(false)

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loadingSpinner}
        />
      ) : (
        <FlatList
          data={dataSource}
          keyExtractor={item => item.root.toString()}
          renderItem={({ item }) => <RowItemRoot item={item} onPressItem={onPressItem} />}
          style={[styles.list, { backgroundColor: theme.colors.background }]}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
      <ImageViewerModal imageUrls={selectedImageUrls} visible={visible} onClose={closeModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 60,
  },
})

export default WordRoot
