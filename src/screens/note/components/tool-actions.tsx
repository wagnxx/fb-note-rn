import React, { useMemo, useState } from 'react'
import { ListBulletIcon } from 'react-native-heroicons/outline'
import Svg, { Path, Text } from 'react-native-svg'
import { actions } from 'react-native-pell-rich-editor'
import { useTheme } from 'react-native-paper'
import { SvgProps } from 'react-native-svg'
import { Text as NativeText, TouchableOpacity, View } from 'react-native'
import Slider from '@react-native-community/slider'
import tw from 'twrnc'
interface IconElementProps extends SvgProps {
  size?: number
  color?: string
}

function getDefaultIcon() {
  const texts: Record<actions, React.FC<IconElementProps>> = {} as Record<
    actions,
    React.FC<IconElementProps>
  >
  texts[actions.setBold] = (props: IconElementProps) => <BoldIcon {...props} />
  texts[actions.setItalic] = (props: IconElementProps) => (
    <ItalicIcon {...props} />
  )
  texts[actions.setUnderline] = (props: IconElementProps) => (
    <UnderlineIcon {...props} />
  )
  texts[actions.insertBulletsList] = (props: IconElementProps) => (
    <ListBulletIcon {...props} />
  )
  texts[actions.insertOrderedList] = (props: IconElementProps) => (
    <NumberedListIcon {...props} />
  )
  texts[actions.alignLeft] = (props: IconElementProps) => (
    <LeftAlignIcon {...props} />
  )
  texts[actions.alignCenter] = (props: IconElementProps) => (
    <CenterAlignIcon {...props} />
  )
  texts[actions.alignRight] = (props: IconElementProps) => (
    <RightAlignIcon {...props} />
  )
  return texts
}

const defaultActions = [
  [actions.setBold],
  [actions.setItalic],
  [actions.setUnderline],
  [actions.insertBulletsList, actions.insertOrderedList],
  [actions.alignLeft, actions.alignCenter, actions.alignRight],
]

const iconsMap = getDefaultIcon()

export default function ToolActions({ editor, selectedItems = [] }) {
  const theme = useTheme()
  const [actionList, setActionList] = useState(defaultActions)

  /**
   * 1 = 10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
   */
  // export type FONT_SIZE = 1 | 2 | 3 | 4 | 5 | 6 | 7;
  // setFontSize: (size: FONT_SIZE) => void;
  const [sliderValue, setSliderValue] = useState(3)

  // useEffect(() => {
  //   if (
  //     selectedItems.length &&
  //     selectedItems.some(item => item?.type === 'fontSize')
  //   ) {
  //     const fontItem = selectedItems.find(item => item.type === 'fontSize')
  //     const fontLevel = Number(fontItem?.value || 3)
  //     setSliderValue(fontLevel)
  //   }
  // }, [selectedItems])

  const currentFontSize = useMemo(() => {
    const fontsizeList = [
      { size: 0, fontSize: 10, text: '超小', level: 1 },
      { size: 25, fontSize: 13, text: '小', level: 2 },
      { size: 50, fontSize: 16, text: '默认', level: 3 },
      { size: 75, fontSize: 18, text: '中', level: 4 },
      { size: 100, fontSize: 24, text: '中大', level: 5 },
      { size: 125, fontSize: 32, text: '大', level: 6 },
      { size: 150, fontSize: 48, text: '超大', level: 7 },
    ]
    return (
      fontsizeList.find(item => item.level === sliderValue) || fontsizeList[2]
    )
  }, [sliderValue])

  const onFontSliderChange = val => {
    setSliderValue(val)
    editor?.current?.setFontSize(currentFontSize.level)
  }

  return (
    <View style={tw`flex-row gap-3 items-center pb-3 px-2 flex-wrap bg-white`}>
      {actionList?.map((group, index1) => (
        <View style={tw`flex-row gap-1`} key={index1}>
          {group.map((act, index) => {
            const IconComponent = iconsMap[act]
            const bg = selectedItems.includes(act)
              ? theme.colors.primary
              : theme.colors.surfaceVariant
            const textColor = selectedItems.includes(act)
              ? theme.colors.onPrimary
              : theme.colors.onSurface
            const iconItemStyle = [{ backgroundColor: bg }, tw`px-5 py-1`]

            return (
              <TouchableOpacity
                style={iconItemStyle}
                onPress={() => editor?.current?.sendAction(act, 'result')}
                key={index1 + index}
              >
                <IconComponent size={22} color={textColor} />
              </TouchableOpacity>
            )
          })}
        </View>
      ))}
      <View style={[tw`flex-1 py-2`]}>
        <View style={tw`flex-row justify-between py-1`}>
          <NativeText
            style={[
              theme.fonts.titleSmall,
              { color: theme.colors.onBackground },
            ]}
          >
            字体大小
          </NativeText>
          <NativeText
            style={[
              theme.fonts.labelSmall,
              { color: theme.colors.onBackground },
            ]}
          >
            {currentFontSize?.text}:{currentFontSize?.fontSize}
          </NativeText>
        </View>
        <Slider
          value={sliderValue}
          onValueChange={onFontSliderChange}
          step={1}
          minimumValue={0}
          maximumValue={6}
          thumbTintColor="#eac028"
          minimumTrackTintColor="#eac028"
          maximumTrackTintColor="#2b2929"
          // StepMarker={({ stepMarked }) => (
          //   <View
          //     style={{
          //       width: 10,
          //       height: 10,
          //       backgroundColor: stepMarked ? 'red' : '#ddd',
          //       borderRadius: 5,
          //       transform: [{ translateY: 4 }],
          //     }}
          //   />
          // )}
        />
      </View>
    </View>
  )
}

const LeftAlignIcon: React.FC<IconElementProps> = ({
  size = 24,
  color = 'black',
}) => (
  <Svg
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path d="M3 3h18v2H3V3zm0 6h12v2H3V9zm0 6h18v2H3v-2zm0 6h12v2H3v-2z" />
  </Svg>
)
const CenterAlignIcon: React.FC<IconElementProps> = ({
  size = 24,
  color = 'black',
}) => (
  <Svg
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path d="M3 3h18v2H3V3zm3 6h12v2H6V9zm-3 6h18v2H3v-2zm3 6h12v2H6v-2z" />
  </Svg>
)

const RightAlignIcon: React.FC<IconElementProps> = ({
  size = 24,
  color = 'black',
}) => (
  <Svg
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path d="M3 3h18v2H3V3zm6 6h12v2H9V9zm-6 6h18v2H3v-2zm6 6h12v2H9v-2z" />
  </Svg>
)

const NumberedListIcon: React.FC<IconElementProps> = ({
  size = 24,
  color = 'black',
}) => (
  <Svg
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path d="M3 4h18v2H3V4zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
    <Text x="-3" y="9" fontSize="10" fill={color} fontWeight="500">
      1
    </Text>
    <Text x="-3" y="15" fontSize="10" fill={color} fontWeight="500">
      2
    </Text>
    <Text x="-3" y="21" fontSize="10" fill={color} fontWeight="500">
      3
    </Text>
  </Svg>
)

const ItalicIcon = ({ size = 24, color = 'black' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      width={size}
      height={size}
    >
      <Path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
      />
    </Svg>
  )
}

const BoldIcon = ({ size = 24, color = 'black' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      width={size}
      height={size}
    >
      <Path
        strokeLinejoin="round"
        d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
      />
    </Svg>
  )
}

const UnderlineIcon = ({ size = 24, color = 'black' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      width={size}
      height={size}
    >
      <Path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.995 3.744v7.5a6 6 0 1 1-12 0v-7.5m-2.25 16.502h16.5"
      />
    </Svg>
  )
}

const AlignCenterIcon = ({ size = 24, color = 'black' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke={color}
      width={size}
      height={size}
    >
      <Path
        d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75Z" // Top bar
      />
      <Path
        d="M5.75 8a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" // Middle shorter bar
      />
      <Path
        d="M2 12.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" // Bottom bar
      />
    </Svg>
  )
}
