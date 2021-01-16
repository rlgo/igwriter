import { Avatar, Box, Divider, HStack, Icon, Text, useToast, VStack } from '@chakra-ui/react'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { VscAdd, VscExtensions } from 'react-icons/vsc'
import { IoArrowBackSharp } from 'react-icons/io5'
import { IoIosLogOut } from 'react-icons/io'
import { padding, maxWidth } from './Page'
import { Link } from 'react-router-dom'

export default function Topbar() {
  const duration = 2100
  const blue = "#0079d4"
  const spacing = "1.75rem"
  const margin_bottom = "1.7rem"
  const icon_size = 7
  const [user] = useAuthState(firebase.auth())
  const pwa = (window as any).pwa
  const toast = useToast()

  return (
    <VStack w="100vw">
      {/* Top bar */}
      <Box bg={blue} w="100%" p={padding} paddingTop="1.3rem" paddingBottom="0.9rem">
        <HStack spacing={spacing} maxW={maxWidth} m="auto">
          <Link to="/">
            <Icon as={IoArrowBackSharp} w={6} h={6} color="white" />
          </Link>
          <Text color="white" fontSize="1.2rem" fontWeight="500">Settings</Text>
        </HStack>
      </Box>
      {/* Content */}
      <Box p="2rem" w="100%" maxW={maxWidth}>
        {/* User info */}
        <HStack spacing="2rem" mb="2rem">
          <Avatar size="md" src={user?.photoURL || ""} />
          <VStack align="left" spacing="0">
            <Text>{user?.displayName || "Guest"}</Text>
            <Text fontSize="0.8rem" color="GrayText">{user?.email || "Guest"}</Text>
          </VStack>
        </HStack>
        <Divider />
        {/* Buttons */}
        <VStack align="left" p="1rem" cursor="pointer">
          <HStack spacing="2rem" mb={margin_bottom} onClick={() => login()}>
            <Icon as={VscAdd} w={icon_size} h={icon_size} color="grey" />
            <Text>{user?.isAnonymous ? "Add account" : "Change account"}</Text>
          </HStack>
          <HStack spacing="2rem" mb={margin_bottom} hidden={!!user?.isAnonymous} onClick={() => logout()}>
            <Icon as={IoIosLogOut} w={icon_size} h={icon_size} color="grey" />
            <Text>Logout</Text>
          </HStack>
          <HStack spacing="2rem" mb={margin_bottom} hidden={!pwa} onClick={() => install()}>
            <Icon as={VscExtensions} w={icon_size} h={icon_size} color="grey" />
            <Text>Install app</Text>
          </HStack>
        </VStack>
      </Box>
    </VStack >
  )

  function login() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => toast({
        title: "Login Successfully",
        description: "You are now login as " + firebase.auth().currentUser?.displayName,
        status: "success",
        duration: duration,
        isClosable: true
      }))
      .catch(() => toast({
        title: "Login failed",
        description: "Something wrong. Please try again",
        status: "error",
        duration: duration,
        isClosable: true
      }))
  }

  function logout() {
    firebase.auth().signInAnonymously()
      .then(() => toast({
        title: "Logout Successfully",
        description: "You are now in guest mode",
        status: "info",
        duration: duration,
        isClosable: true
      }))
  }

  function install() {
    if (!!pwa) pwa.prompt()
  }
}