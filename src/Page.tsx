import { Avatar, Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import { VscAdd, VscSearch } from 'react-icons/vsc'
import { Path } from './App'
import firebase from "./fire";

const padding = "1.1rem"
const maxWidth = "800px"

type TopbarProps = {
  path: Path
}

function Topbar({ path }: TopbarProps) {
  const blue = "#0079d4"
  const spacing = "1.75rem"
  const [user] = useAuthState(firebase.auth())

  return (
    <Box bg={blue} w="100%" p={padding} paddingTop="0.7rem" paddingBottom="0.7rem">
      <HStack justify="space-between" paddingTop="0.6rem" maxW={maxWidth} m="auto">
        <HStack spacing={spacing}>
          <Avatar size="sm" src={user?.photoURL || ""} />
          <Text color="white" fontSize="1.2rem" fontWeight="500">{uppercase(path)}</Text>
        </HStack>
        <HStack spacing={spacing}>
          <Icon as={VscAdd} w={6} h={6} color="white" onClick={() => login()} />
          <Icon as={VscSearch} w={6} h={6} color="white" className="flip" />
        </HStack>
      </HStack>
    </Box >
  )

  function login() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    // firebase.auth().signOut();
  }
}

type FilesProps = {
  path: Path
}

function Files({ path }: FilesProps) {
  const titles = {
    [Path.HOME]: "Recent Files",
    [Path.FAVORITES]: "Favorites Files",
    [Path.SHARED]: "Shared Files"
  }
  const title = titles[path]

  return (
    <Box maxW={maxWidth} m="auto">
      <Text mb="0.8rem">{title}</Text>
      <Hint type={path} />
      <br />
    </Box>
  )

  function Hint({ type }: { type: Path }) {
    const size = "0.75rem"
    const lightgrey = "#f8f8f8"
    const description = {
      [Path.HOME]: "You can start a new draft from scratch, or you can import texts from word documents, pdf or other sources.",
      [Path.FAVORITES]: "Tap the \u22EE icon next to your draft and mark any draft as favorite to access it faster in the future.",
      [Path.SHARED]: "Invite your friends or enemies to collaborate on the draft that you currently work on to boost productivity."
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
        <Files path={path} />
        {path === Path.HOME
          ? <><Files path={Path.FAVORITES} /> <Files path={Path.SHARED} /></>
          : <></>}
      </Box>
    </VStack>
  )
}

function uppercase(text: string) {
  text = text.replace("/", "")
  return text.charAt(0).toUpperCase() + text.slice(1)
}