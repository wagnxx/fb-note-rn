import { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp, ParamListBase } from '@react-navigation/native'
import { FC } from 'react'

export type ScreenComponentType<ParamList extends ParamListBase, RouteName extends keyof ParamList> = FC<{
  navigation: StackNavigationProp<ParamList, RouteName>
  route: RouteProp<ParamList, RouteName>
}>

export enum ScrennTypeEnum {
  HomeTabs = 'HomeTabs',
  NodeDetail = 'NodeDetail',
  Login = 'Login',
  Profile = 'Profile',
  // bottome
  Moment = 'Moment',
  Tag = 'Tag',
  My = 'My',
}

export enum RootScreenTypesEnum {
  HomeTabs = ScrennTypeEnum.HomeTabs,
  NodeDetail = ScrennTypeEnum.NodeDetail,
  Login = ScrennTypeEnum.Login,
  Profile = ScrennTypeEnum.Profile,
}

export enum BottomTabScreenTypesEnum {
  Moment = ScrennTypeEnum.Moment,
  Tag = ScrennTypeEnum.Tag,
  My = ScrennTypeEnum.My,
}

// 合并枚举类型
// export type ScreenTypes = ScrennTypeEnum
type ScreenTypes = keyof typeof ScrennTypeEnum
type RootScreenTypes = keyof typeof RootScreenTypesEnum
type BottomTabScreenTypes = keyof typeof BottomTabScreenTypesEnum

interface ScreenParamsType {
  id: string
}

export type RootStackParamList = Record<RootScreenTypes, ScreenParamsType | undefined>
export type BottomTabParamList = Record<BottomTabScreenTypes, { params: object } | undefined>

// Common props for screen components
type ScreenComponentProps<ParamList extends Record<string, object | undefined>, RouteName extends keyof ParamList> = {
  navigation: StackNavigationProp<ParamList, RouteName>
  route: RouteProp<ParamList, RouteName>
}

type ScreenProps<RouteName extends keyof RootStackParamList | keyof BottomTabParamList> = ScreenComponentProps<
  ParamListBase,
  RouteName
>

// Utility type to map route names to ScreenComponentType
export type ScreenFC<RouteName extends keyof ParamListBase> = RouteName extends
  | keyof RootStackParamList
  | keyof BottomTabParamList
  ? ScreenComponentType<ParamListBase, RouteName>
  : never
