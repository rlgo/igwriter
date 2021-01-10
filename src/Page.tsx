import { Avatar, Box, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import { VscAdd, VscSearch } from 'react-icons/vsc'
import { Path } from './App'
import firebase from "./fire";
import { Link } from 'react-router-dom';

const padding = "1.1rem"
const maxWidth = "800px"

type TopbarProps = {
  path: Path
}

function Topbar({ path }: TopbarProps) {
  const blue = "#0079d4"
  const spacing = "1.75rem"
  const [user, loading] = useAuthState(firebase.auth())

  return (
    <Box bg={blue} w="100%" p={padding} paddingTop="0.7rem" paddingBottom="0.7rem">
      <HStack justify="space-between" paddingTop="0.6rem" maxW={maxWidth} m="auto">
        <HStack spacing={spacing}>
          {loading
            ? <Box paddingTop="1px" paddingBottom="1px" paddingRight="8px"><Spinner color="white" /></Box>
            : <Avatar size="sm" src={user?.photoURL || ""} />}
          <Text color="white" fontSize="1.2rem" fontWeight="500">{uppercase(path)}</Text>
        </HStack>
        <HStack spacing={spacing}>
          <Icon as={VscAdd} w={6} h={6} color="white" onClick={add} />
          <Icon as={VscSearch} w={6} h={6} color="white" className="flip" />
        </HStack>
      </HStack>
    </Box >
  )

  async function add() {
    firebase.auth().signOut()
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }
}

type FilesProps = {
  path: Path
  active?: boolean
}

function Files({ path, active }: FilesProps) {
  const titles: { [key: string]: string } = {
    [Path.RECENT]: "Recent Files",
    [Path.FAVORITES]: "Favorites Files",
    [Path.SHARED]: "Shared Files"
  }
  const title = titles[path] || ""

  return (
    <Box maxW={maxWidth} m="auto">
      <HStack justify="space-between">
        <Text mb="0.8rem" fontSize="0.8rem" fontWeight="500">{title}</Text>
        <Link to={path} hidden={!!active} >
          <Text mb="0.8rem" fontSize="0.8rem" fontWeight="500" cursor="pointer">See all</Text>
        </Link>
      </HStack>
      <Hint type={path} />
      <br />
    </Box>
  )

  function Hint({ type }: { type: Path }) {
    const size = "0.75rem"
    const lightgrey = "#f8f8f8"
    const description: { [key: string]: string } = {
      [Path.RECENT]: "You can start a new draft from scratch, or you can import texts from word documents, pdf or other sources.",
      [Path.FAVORITES]: "Tap the \u22EE icon next to your draft and mark any draft as favorite to access it faster in the future.",
      [Path.SHARED]: "Invite your friends or enemies to collaborate on the draft that you currently work on to boost productivity.",
    }
    return <Box fontSize={size} color="GrayText" m="auto" bg={lightgrey} p={padding} rounded="md">
      {description[type]}</Box>
  }
}

type PageProps = {
  path: Path
}

export default function Page({ path }: PageProps) {
  return (
    <VStack>
      <Topbar path={path} />
      <Box p={padding} w="100vw">
        {path === Path.HOME
          ? <>
            <Files path={Path.RECENT} />
            <Files path={Path.FAVORITES} />
            <Files path={Path.SHARED} />
          </>
          : <Files path={path} active />}
      </Box>
    </VStack>
  )
}

function uppercase(text: string) {
  text = text.replace("/", "")
  return text.charAt(0).toUpperCase() + text.slice(1)
}