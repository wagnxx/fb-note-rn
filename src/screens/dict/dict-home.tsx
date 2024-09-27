import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DictListComponent from './components/DictListComponent'
import WordManage from './word-manage'

const DictHome: React.FC = () => {
  const hasSelectedDict = useSelector((state: RootState) => state.dict.hasSelectedDict)

  return hasSelectedDict ? <WordManage /> : <DictListComponent />
}

export default DictHome
