import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import { padding, maxWidth } from './Page'
import firebase from "./fire";
import Editor from './Editor'

type TopbarProps = {
  name: string,
  setName: (name: string) => void
  setOpen: (open: boolean) => void
}

function Topbar({ name, setName }: TopbarProps) {
  const blue = "#0079d4"
  const spacing = "0.75rem"
  const ref = useRef<HTMLParagraphElement>(null)

  return (
    <Box bg={blue} w="100%" p={padding} paddingTop="1.3rem" paddingBottom="0.9rem">
      <HStack spacing={spacing} maxW={maxWidth} m="auto">
        <Link to="/">
          <Icon as={IoArrowBackSharp} w={6} h={6} color="white" />
        </Link>
        <Text color="white" fontSize="1.2rem" fontWeight="500" contentEditable="true"
          pl="1rem" pr="1rem" ref={ref} onBlur={blur} suppressContentEditableWarning={true}>
          {name}
        </Text>
      </HStack>
    </Box>
  )

  function blur() {
    const name = ref?.current?.textContent
    setName(name || "")
  }
}

export default function Draft() {
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState("")
  const [open, setOpen] = useState(true)

  firebase.firestore().collection("drafts").doc(id).get()
    .then(doc => {
      setName(doc.data()?.title || "")
    })

  return (
    <VStack h="100vh" spacing="0">
      <Topbar name={name} setName={rename} setOpen={setOpen} />
      <Editor id={id} open={open} setOpen={setOpen} />
    </VStack>
  )

  function rename(name: string) {
    firebase.firestore().collection("drafts").doc(id).update({
      "title": name
    })
    setName(name)
  }
}