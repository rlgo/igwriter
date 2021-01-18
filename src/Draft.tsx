import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBackSharp, IoEllipsisVerticalSharp } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import { padding, maxWidth } from './Page'
import firebase from "./fire";
import Editor from './Editor'
import { useDocumentData } from 'react-firebase-hooks/firestore'

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

  return (
    <VStack h="100vh" spacing="0">
      {/* @ts-ignore */}
      <Topbar name={data?.title} setOpen={setOpen} />
      <Editor id={id} open={open} setOpen={setOpen} />
    </VStack>
  )
}