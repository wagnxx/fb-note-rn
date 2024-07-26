import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Drawer, TextInput as PaperTextInput, TouchableRipple, useTheme } from 'react-native-paper'
import { ArrowRightIcon, CheckIcon, EyeSlashIcon, XMarkIcon } from 'react-native-heroicons/outline'

import tw from 'twrnc'
import { Folder, createFolder, getFolders } from '@/service/basic'

const { width, height } = Dimensions.get('window')

function genId() {
  let id = 10
  return () => {
    id++
    return id
  }
}
const getId = genId()

export default function FolderManage({ style, closeDrawer }) {
  const navigation = useNavigation()
  const theme = useTheme()

  const [showNewDrawer, setshowNewDrawer] = useState(false)

  const [folders, setFolders] = useState<Folder[]>([])

  const itemWidth = (width - 16 * 2 - 20 * 2) / 3

  const itemStyle = [
    {
      width: itemWidth,
      height: itemWidth * 1.53,
      // padding: 16,
      paddingBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    tw`bg-gray-200 items-center justify-end`,
  ]
  const itemTextStyle = [tw`text-gray-400`]

  const selections = [
    {
      container: 'rgb(229 231 235)',
      textColor: 'rgb(156 163 175)',
    },
    {
      container: theme.colors.primary,
      textColor: theme.colors.onPrimary,
    },
    {
      container: theme.colors.primaryContainer,
      textColor: theme.colors.onPrimaryContainer,
    },
    {
      container: theme.colors.secondary,
      textColor: theme.colors.onSecondary,
    },
    {
      container: theme.colors.secondaryContainer,
      textColor: theme.colors.onSecondaryContainer,
    },
    {
      container: theme.colors.tertiary,
      textColor: theme.colors.onTertiary,
    },
    {
      container: theme.colors.tertiaryContainer,
      textColor: theme.colors.onTertiaryContainer,
    },
  ]
  const [selectedBgIndex, setselectedBgIndex] = useState(0)
  const [newFolderValue, setNewFolderValue] = useState<string>('')

  const createNewFolder = () => {
    const selectedItem = selections[selectedBgIndex]

    if (newFolderValue.length < 3) {
      Alert.alert('warning', 'new folder name should grade than 3 charts')
      return
    }

    createFolder({ name: newFolderValue, ...selectedItem })
      .then(res => {
        if (res) {
          Alert.alert('warning', 'create success.')
          setNewFolderValue('')
          setshowNewDrawer(false)
          refreshPage()
        } else {
          Alert.alert('warning', 'create failed.')
        }
      })
      .then(err => {
        console.log('create err:::', err)
      })
  }

  const refreshPage = () => {
    getFolders().then(res => {
      if (res) {
        setFolders(res)
        return
      }
      setFolders([])
    })
  }

  useEffect(() => {
    refreshPage()
  }, [])

  return (
    <>
      <Drawer.Section
        style={[style, tw`flex-col`, { height, backgroundColor: 'rgba(0,0,0,0.6)', width }]}
        showDivider={false}
      >
        {/* <View style={{ flexGrow: 1, flexBasis: 300, backgroundColor: 'rgba(0,0,0,0.6)' }} /> */}
        <View style={[{ minHeight: 200, maxHeight: 450 }, tw`bg-gray-100 px-2 pb-8 absolute bottom-0 rounded-t-xl`]}>
          <View style={tw`flex-row gap-8 px-4 py-3`}>
            <TouchableOpacity onPress={closeDrawer}>
              <XMarkIcon size={22} color={theme.colors.onBackground} />
            </TouchableOpacity>
            <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>Folders</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
            <View style={[tw`flex-row justify-start px-4 gap-5 flex-wrap py-2`, { width }]}>
              <TouchableRipple onPress={() => setshowNewDrawer(true)}>
                <View style={[itemStyle, tw`justify-center `, {}]}>
                  <Text style={itemTextStyle}>+</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => {}}>
                <View style={[itemStyle, tw`bg-blue-700 border-yellow-500`]}>
                  <Text style={itemTextStyle}>All NOTES</Text>
                </View>
              </TouchableRipple>
              {folders?.length > 0 &&
                folders.map((folder, index) => (
                  <TouchableRipple onPress={() => {}} key={index}>
                    <View style={[itemStyle, { backgroundColor: folder?.container || '' }]}>
                      <Text style={[itemTextStyle, { color: folder?.textColor || '' }]}>{folder.name}</Text>
                    </View>
                  </TouchableRipple>
                ))}
            </View>
            <View style={[tw`bg-white px-2 py-2 mx-2 mt-5 rounded-lg`]}>
              <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-row gap-2`}>
                  <EyeSlashIcon size={18} color={theme.colors.onBackground} />
                  <Text style={{ color: theme.colors.onBackground }}>隐藏笔记</Text>
                </View>
                <ArrowRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
              </View>
              <View style={tw`flex-row justify-between mt-4`}>
                <View style={tw`flex-row gap-2`}>
                  <EyeSlashIcon size={18} color={theme.colors.onBackground} />
                  <Text style={{ color: theme.colors.onBackground }}>最近删除</Text>
                </View>
                <ArrowRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* new folder input drawer */}
        {showNewDrawer && (
          <View style={[{ height: 500, width }, tw`bg-gray-100 px-2 pb-8 absolute bottom-0 rounded-t-xl`]}>
            <View style={[tw`p-2`]}>
              <View style={tw`flex-row justify-between items-center gap-8  py-3`}>
                <TouchableOpacity onPress={() => setshowNewDrawer(false)}>
                  <XMarkIcon size={22} color={theme.colors.onBackground} />
                </TouchableOpacity>
                <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>Create New Note</Text>
                <TouchableOpacity onPress={createNewFolder}>
                  <CheckIcon size={22} color={theme.colors.onBackground} />
                </TouchableOpacity>
              </View>
              <PaperTextInput
                placeholder="please enter."
                value={newFolderValue}
                onChangeText={text => setNewFolderValue(text)}
                style={[{ backgroundColor: '#fff' }, tw`rounded-sm`]}
              />

              <View style={tw`bg-white mt-4 p-3 rounded-lg`}>
                <View style={tw`justify-center items-center`}>
                  <TouchableRipple onPress={() => {}}>
                    <View style={[itemStyle, { backgroundColor: selections[selectedBgIndex].container }]}>
                      <Text style={[itemTextStyle, { color: selections[selectedBgIndex].textColor }]}>NOTES</Text>
                    </View>
                  </TouchableRipple>
                </View>

                <View style={tw`mt-4`}>
                  <Text style={[theme.fonts.labelMedium, { color: theme.colors.onBackground }]}>Pure Colors</Text>
                  <ScrollView horizontal>
                    <View style={tw`flex-row gap-4`}>
                      {selections.map((item, index) => (
                        <TouchableRipple
                          onPress={() => {
                            setselectedBgIndex(index)
                          }}
                          key={index}
                        >
                          <View
                            style={[
                              itemStyle,
                              tw`${selectedBgIndex === index ? 'border-yellow-500' : ''} `,
                              { backgroundColor: item.container, width: width * 0.22, height: width * 0.3 },
                            ]}
                          >
                            <Text style={[itemTextStyle, { color: item.textColor }]}>NOTES</Text>
                          </View>
                        </TouchableRipple>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        )}
      </Drawer.Section>
    </>
  )
}
const styles = StyleSheet.create({
  drawerItem: {
    padding: 16,
    backgroundColor: 'red',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
