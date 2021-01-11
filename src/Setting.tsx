import React from 'react'
import { Avatar, Box, Divider, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { VscAdd, VscExtensions } from 'react-icons/vsc'
import { IoArrowBackSharp } from 'react-icons/io5'
import { IoIosLogOut } from 'react-icons/io'
import { padding, maxWidth } from './Page'
import { useHistory } from 'react-router-dom'


function Topbar() {
  const blue = "#0079d4"
  const spacing = "1.75rem"
  const margin_bottom = "1.7rem"
  const history = useHistory()
  const [user] = useAuthState(firebase.auth())

  return (
    <VStack w="100%">
      {/* Top bar */}
      <Box bg={blue} w="100%" p={padding} paddingTop="1.3rem" paddingBottom="0.9rem"
        justify="space-between" maxW={maxWidth} m="auto">
        <HStack spacing={spacing}>
          <Icon as={IoArrowBackSharp} w={6} h={6} color="white" onClick={() => history.goBack()} />
          <Text color="white" fontSize="1.2rem" fontWeight="500">Setting</Text>
        </HStack>
      </Box>
      {/* Content */}
      <Box p="2rem" w="100%">
        <HStack spacing="2rem" mb="2rem">
          <Avatar size="md" src={user?.photoURL || ""} />
          <VStack align="left" spacing="0">
            <Text>{user?.displayName || "Guest"}</Text>
            <Text fontSize="0.8rem" color="GrayText">{user?.email || "Guest"}</Text>
          </VStack>
        </HStack>
        <Divider />
        <VStack align="left" p="1rem">
          <HStack spacing="2rem" mb={margin_bottom} onClick={() => login()}>
            <Icon as={VscAdd} w="8" h="8" color="grey" />
            <Text>{user?.isAnonymous ? "Add account" : "Change account"}</Text>
          </HStack>
          <HStack spacing="2rem" mb={margin_bottom} hidden={!!user?.isAnonymous} onClick={() => logout()}>
            <Icon as={IoIosLogOut} w="8" h="8" color="grey" />
            <Text>Logout</Text>
          </HStack>
          <HStack spacing="2rem" mb={margin_bottom} onClick={() => install()}>
            <Icon as={VscExtensions} w="8" h="8" color="grey" />
            <Text>Install app</Text>
          </HStack>
        </VStack>
      </Box>
    </VStack >
  )

  function login() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }

  function logout() {
    firebase.auth().signInAnonymously()
  }

  function install() {

  }
}

export default function Setting() {
  return (
    <VStack>
      <Topbar />
    </VStack>
  )
}