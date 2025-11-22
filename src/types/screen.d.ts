import { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp, ParamListBase } from '@react-navigation/native'
import { FC } from 'react'

export type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
> = FC<{
  navigation: StackNavigationProp<ParamList, RouteName>
  route: RouteProp<ParamList, RouteName>
}>

export enum ScrennTypeEnum {
  HomeTabs = 'HomeTabs',
  NodeDetail = 'NodeDetail',
  Login = 'Login',
  Profile = 'Profile',
  Photo = 'Photo',
  Music = 'Music',
  CreateNote = 'CreateNote',
  RecentRemovedNote = 'RecentRemovedNote',
  Tag = 'Tag',
  DictEnglish = 'DictEnglish',
  // bottome
  Moment = 'Moment',
  Tool = 'Tool',
  Me = 'Me',
}

interface ScreenParamsType {
  id: string
  [key: string]: any
}

export type RootStackParamList = Record<keyof typeof ScrennTypeEnum, ScreenParamsType | undefined>

// Common props for screen components
type ScreenComponentProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList,
> = {
  navigation: StackNavigationProp<ParamList, RouteName>
  route: RouteProp<ParamList, RouteName>
}

type ScreenProps<RouteName extends keyof RootStackParamList | keyof BottomTabParamList> =
  ScreenComponentProps<ParamListBase, RouteName>

// Utility type to map route names to ScreenComponentType
export type ScreenFC<RouteName extends keyof ParamListBase> =
  RouteName extends keyof RootStackParamList ? ScreenComponentType<ParamListBase, RouteName> : never
