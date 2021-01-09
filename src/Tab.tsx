import { Box, Icon, HStack, VStack, Text } from '@chakra-ui/react'
import { HiHome, HiOutlineHome } from 'react-icons/hi'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { BsPeopleFill, BsPeople } from 'react-icons/bs'
import React, { MouseEventHandler } from 'react'
import './Tab.css'
import { IconType } from 'react-icons'
import { navigateCb } from './App'

const blue = "#0178D4"
const grey = "#6E6E6E"

type ButtonProps = {
  text: string,
  icon: IconType,
  iconAlt: IconType,
  selected: boolean,
  click: MouseEventHandler
}

function Button({ text, icon, iconAlt, selected, click }: ButtonProps) {
  const color = selected ? blue : grey
  const onClick: MouseEventHandler = e => {
    //ripple
    click(e)
  }

  return (
    <VStack spacing={0} cursor="pointer" w="24%" onClick={onClick}>
      <Icon as={selected ? icon : iconAlt} w={7} h={7} color={color} />
      <Text fontSize="xs" color={color}>{text}</Text>
    </VStack>
  )
}

type TabProps = {
  navigate: navigateCb
}

export default function Tab({ navigate }: TabProps) {
  return (
    <Box pos="fixed" bottom="0" w="100%" p="0.5rem" boxShadow="0 0 20px rgba(0,0,0,0.16)" >
      <HStack justify={'space-evenly'}>
        <Button text="Home" icon={HiHome} iconAlt={HiOutlineHome} selected={true}
          click={() => { navigate("home") }} />
        <Button text="Favourites" icon={AiFillStar} iconAlt={AiOutlineStar} selected={false}
          click={() => { navigate("favorite") }} />
        <Button text="Shared" icon={BsPeopleFill} iconAlt={BsPeople} selected={false}
          click={() => { navigate("shared") }} />
      </HStack>
    </Box >
  )
}