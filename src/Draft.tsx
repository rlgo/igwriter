import { Box, HStack, Icon, Text, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { IoArrowBackSharp, IoEllipsisVerticalSharp } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import { padding, maxWidth } from './Page'
import firebase from "./fire";
import Editor from './Editor'
import { useDocumentData } from 'react-firebase-hooks/firestore'
// @ts-ignore
import useOnlineStatus from '@rehooks/online-status';
import { duration } from './Setting'
import debounce from "lodash.debounce";

type TopbarProps = {
  name: string,
  setOpen: (open: boolean) => void
}

function Topbar({ name, setOpen }: TopbarProps) {
  const blue = "#0079d4"
  const spacing = "0.75rem"

  return (
    <Box bg={blue} w="100%" p={padding} paddingTop="1.3rem" paddingBottom="0.9rem">
      <HStack justify="space-between" maxW={maxWidth} m="auto">
        <HStack spacing={spacing}  >
          <Link to="/">
            <Icon as={IoArrowBackSharp} w={6} h={6} color="white" />
          </Link>
          <Text color="white" fontSize="1.2rem" fontWeight="500" pl="1rem" pr="1rem" >
            {name}
          </Text>
        </HStack>
        <Icon as={IoEllipsisVerticalSharp} cursor="pointer" w={6} h={6} color="white" onClick={() => setOpen(true)} />
      </HStack>
    </Box>
  )
}

export default function Draft() {
  const { id } = useParams<{ id: string }>()
  const [open, setOpen] = useState(false)
  const [data] = useDocumentData(firebase.firestore().collection("drafts").doc(id))
  const toast = useToast()
  const online = useOnlineStatus();
  const [offlineBefore, setOfflineBefore] = useState(false)

  const offlineCb = useMemo(() => {
    const offline = () => {
      toast({
        title: "You are in offline mode",
        description: "Changes will not be saved to cloud",
        status: "info",
        isClosable: true
      })
    }
    return debounce(offline, 1000, { leading: true, trailing: false })
  }, [toast])

  useEffect(() => {
    if (online) {
      if (offlineBefore) {
        toast({
          title: "You are now online",
          duration: duration,
          status: "success",
          isClosable: true
        })
      }
      setOfflineBefore(false)
    } else {
      offlineCb()
      setOfflineBefore(true)
    }
  }, [toast, online, offlineBefore, offlineCb])

  return (
    <VStack h="100vh" spacing="0">
      {/* @ts-ignore */}
      <Topbar name={data?.title} setOpen={setOpen} />
      <Editor id={id} open={open} setOpen={setOpen} />
    </VStack>
  )
}