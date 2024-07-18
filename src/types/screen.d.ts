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
  Moment = 'Moment',
  Tag = 'Tag',
  My = 'My',
}

export enum RootScreenTypesEnum {
  HomeTabs = ScrennTypeEnum.HomeTabs,
  NodeDetail = ScrennTypeEnum.NodeDetail,
  Login = ScrennTypeEnum.Login,
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

export type RootStackParamList = Record<RootScreenTypes, { item: unknown } | undefined>
export type BottomTabParamList = Record<BottomTabScreenTypes, { item: unknown } | undefined>

// Common props for screen components
type ScreenComponentProps<ParamList extends Record<string, object | undefined>, RouteName extends keyof ParamList> = {
  navigation: StackNavigationProp<ParamList, RouteName>
  route: RouteProp<ParamList, RouteName>
}

// Utility type to map route names to ScreenComponentType
export type ScreenFC<RouteName extends keyof ParamListBase> = RouteName extends keyof RootStackParamList | keyof BottomTabParamList
  ? ScreenComponentType<ParamListBase, RouteName>
  : never
