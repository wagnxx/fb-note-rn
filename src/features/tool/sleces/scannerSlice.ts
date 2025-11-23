import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ScanRecord {
  code: string
  time: string
  image?: string // ← 新增
}
//   const [isScanning, setIsScanning] = useState(false)
//   const [history, setHistory] = useState<ScanRecord[]>([])

type ScannerStateType = {
  isScanning: boolean
  history: ScanRecord[]
}

const initialState: ScannerStateType = {
  isScanning: false,
  history: [],
}

const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload
    },
    setHistory: (state, action: PayloadAction<ScanRecord[]>) => {
      state.history = action.payload
    },
    addRecord: (state, action: PayloadAction<ScanRecord>) => {
      state.history = [action.payload, ...state.history]
    },
    removeRecord: (state, action: PayloadAction<number>) => {
      state.history.splice(action.payload, 1)
    },
  },
})

export const { setScanning, setHistory, addRecord, removeRecord } = scannerSlice.actions
export default scannerSlice.reducer
export const selectScanner = (state: { scanner: typeof initialState }) => state.scanner
