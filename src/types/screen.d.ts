import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
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
  Moment = 'Moment',
  Tag = 'Tag',
  My = 'My',
}

export enum RootScreenTypes {
  HomeTabs = ScrennTypeEnum.HomeTabs,
  NodeDetail = ScrennTypeEnum.NodeDetail,
  Login = ScrennTypeEnum.Login,
}

export enum BottomTabScreenTypes {
  Moment = ScrennTypeEnum.Moment,
  Tag = ScrennTypeEnum.Tag,
  My = ScrennTypeEnum.My,
}

// 合并枚举类型
export type ScreenTypes = ScrennTypeEnum

export type RootStackParamList = Record<
  RootScreenTypes,
  { item: unknown } | undefined
>
export type BottomTabParamList = Record<
  BottomTabScreenTypes,
  { item: unknown } | undefined
>

// 定义 RootScreenProps 和 BottomTabScreenProps
export type RootScreenProps<T extends RootScreenTypes> = StackScreenProps<
  RootStackParamList,
  T
>
export type BottomTabScreenProps<T extends BottomTabScreenTypes> =
  StackScreenProps<BottomTabParamList, T>

// 提供一个 ScreenProps 类型
export type ScreenProps<T extends ScreenTypes> = T extends RootScreenTypes
  ? RootScreenProps<T>
  : T extends BottomTabScreenTypes
    ? BottomTabScreenProps<T>
    : never

export type ScreenFC<P = {}> = FC<P & { navigation: any; route: any }>

export type ScreenFCType<T extends ScreenTypes> = ScreenFC<ScreenProps<T>> &
  (T extends BottomTabScreenTypes
    ? ScreenComponentType<BottomTabParamList, T>
    : ScreenComponentType<RootStackParamList, T>)

// 用于 Moment 和 Login 组件的类型
export type MomentScreenType = ScreenFCType<ScreenTypes.Moment>
export type LoginScreenType = ScreenFCType<ScreenTypes.Login>
