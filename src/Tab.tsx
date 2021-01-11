import { Box, Icon, HStack, VStack, Text } from '@chakra-ui/react'
import { HiHome } from 'react-icons/hi'
import { VscHome } from 'react-icons/vsc'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { BsPeopleFill, BsPeople } from 'react-icons/bs'
import { MouseEventHandler } from 'react'
import { IconType } from 'react-icons'
import { Link } from 'react-router-dom'
import { Path } from './App'

const blue = "#0178D4"
const grey = "#6E6E6E"
const maxWidth = "800px"

type ButtonProps = {
  path: Path,
  icon: IconType,
  iconAlt: IconType,
  link: Path
}

function Button({ path, icon, iconAlt, link }: ButtonProps) {
  const selected = path === link
  const text = uppercase(link)
  const color = selected ? blue : grey
  const onClick: MouseEventHandler = e => {
    //TODO: ripples
  }

  return (
    <Link to={link}>
      <VStack className="onethird" spacing={0} cursor="pointer" onClick={onClick}>
        <Icon as={selected ? icon : iconAlt} w={7} h={7} color={color} />
        <Text fontSize="xs" color={color}>{text}</Text>
      </VStack>
    </Link>
  )

  function uppercase(text: string) {
    text = text.replace("/", "")
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}

type TabProps = {
  path: Path
}

export default function Tab({ path }: TabProps) {
  return (
    <Box pos="fixed" bottom="0" w="100%" p="0.5rem" boxShadow="0 0 10px rgba(0,0,0,0.10)" bg="white" >
      <HStack justify="space-evenly" m="auto" maxW={maxWidth} >
        <Button path={path} icon={HiHome} iconAlt={VscHome} link={Path.HOME} />
        <Button path={path} icon={AiFillStar} iconAlt={AiOutlineStar} link={Path.FAVORITES} />
        <Button path={path} icon={BsPeopleFill} iconAlt={BsPeople} link={Path.SHARED} />
      </HStack>
    </Box >
  )
}