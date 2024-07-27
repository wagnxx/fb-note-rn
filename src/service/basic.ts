import { auth } from '@/firebase/auth'
import {
  addDocToCol,
  getDocsByCondition,
  getFieldValues,
  DocumentData,
  deleteDocById,
  updateDocData,
} from '@/firebase/db'
import { where } from '@react-native-firebase/firestore'

/**
 * 
 * 说明
文件夹管理：

createFolder 用于创建文件夹，可以指定父文件夹（实现文件夹嵌套）。
getFolders 用于获取所有文件夹列表。
Note管理：

createNote 用于在指定文件夹中创建Note。
getNotes 用于获取指定文件夹中的所有Note。
Tag管理：

createTag 用于创建新的Tag。
getTags 用于获取所有Tag列表。
组织和用户管理：

createOrganization 用于创建新的组织。
addMemberToOrg 用于将用户添加到组织并指定角色。
getOrgMembers 用于获取指定组织的所有成员。
广场文章：

getPublishedNotes 用于获取所有已发布的文章。

 * 
 * 
 */

const COL_ORGANIZATIONS = 'organizations'
const COL_ORGMEMBERS = 'orgMembers'
const COL_FOLDERSS = 'folders'

export type Tag = {
  name: string
  id: string
}
export type Folder = {
  id: string
  name: string
  container?: string
  textColor?: string
  createId?: string
}
// 创建文件夹
export const createFolder = async (doc: Partial<Folder>): Promise<string | null> => {
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return addDocToCol(COL_FOLDERSS, doc)
  }
  return Promise.reject('logout')
}

export const updateFolder = async (doc: Partial<Folder>): Promise<boolean | null> => {
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return updateDocData(COL_FOLDERSS, doc.id!, doc)
  }
  return Promise.reject('logout')
}

// 获取文件夹列表
export const getFolders = async (): Promise<(DocumentData | Folder)[]> => {
  if (auth?.currentUser?.uid) {
    return getFieldValues(
      'folders',
      ['name', 'id', 'container', 'textColor'],
      [where('createId', '==', auth.currentUser.uid)],
    )
  }
  return Promise.reject('logout')
}

export const delFolder = async (id: string) => {
  return deleteDocById(COL_FOLDERSS, id)
}

// 创建Note
export const createNote = async (folderId: string, note: DocumentData): Promise<string | null> => {
  note.folderId = folderId
  return addDocToCol('notes', note)
}

// 获取Note列表
export const getNotes = async (folderId: string): Promise<DocumentData[]> => {
  return getDocsByCondition('notes', {
    field: 'folderId',
    operator: '==',
    value: folderId,
  })
}

// 创建Tag
export const createTag = async (tagName: string): Promise<string | null> => {
  return addDocToCol('tags', { name: tagName })
}

// 获取Tag列表
export const getTags = async (): Promise<DocumentData[]> => {
  return getFieldValues('tags', ['name', 'id'])
}

// 创建组织
export const createOrg = async (orgName: string): Promise<string | null> => {
  return addDocToCol(COL_ORGANIZATIONS, { name: orgName })
}

export const getOrgs = () => getFieldValues(COL_ORGANIZATIONS, ['name', 'id'])

export type OrgMemberType = {
  orgId: string
  orgName: string
  userId: string
  role: string
  photoURL: string | null
}

// 添加成员到组织
export const addMemberToOrg = async (doc: OrgMemberType): Promise<string | null> => {
  return addDocToCol(COL_ORGMEMBERS, doc)
}

export const getJoinedOrgs = async (uid: string) => {
  return getDocsByCondition(COL_ORGMEMBERS, {
    field: 'userId',
    operator: '==',
    value: uid,
  })
}
// 获取组织成员列表
export const getOrgMembers = async (orgId: string): Promise<DocumentData[]> => {
  return getDocsByCondition(COL_ORGMEMBERS, {
    field: 'orgId',
    operator: '==',
    value: orgId,
  })
}

// 获取已发布的文章列表
export const getPublishedNotes = async (): Promise<DocumentData[]> => {
  return getDocsByCondition('notes', {
    field: 'published',
    operator: '==',
    value: true,
  })
}
