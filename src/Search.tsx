import { Box, HStack, Icon, Input, InputGroup, InputLeftAddon, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import React, { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, useHistory } from "react-router-dom";
import { Path } from "./App";
import firebase from "./fire";
import { padding, maxWidth } from './Page'


export default function Search(uid: string) {
  const history = useHistory()
  const [user] = useAuthState(firebase.auth())
  const ref = firebase.firestore().collection("drafts")
    .where("users", "array-contains", user?.uid)
  const [value, setValue] = useState("")
  const [snapshot, loading] = useCollection(ref)
  const [results, setResults] = useState([])
  const fuse = useMemo(() => new Fuse([], {
    keys: [
      "title",
    ]
  }), [])

  useEffect(() => {
    if (!loading) {
      const titles = snapshot.docs.map((doc: any) => ({
        title: doc.data().title,
        lastOpen: dayjs(doc.data().last_open.toDate()).format("DD MMM YYYY"),
        id: doc.id
      }))
      fuse.setCollection(titles)
    }
  }, [snapshot, loading, fuse])

  useEffect(() => {
    if (value.length > 0) {
      const temp = fuse.search(value).map(res => res.item)
      setResults(temp)
    }
  }, [value, fuse])

  const searchChange: ChangeEventHandler = event => {
    //@ts-ignore
    setValue(event.target.value)
  }

  return (
    <Box w="100%" padding={padding}>
      <VStack maxW={maxWidth} m="auto">
        <HStack w="100%" justify="center">
          <InputGroup>
            <InputLeftAddon>
              <Link to="/">
                <Icon as={IoArrowBackSharp} w={6} h={6} />
              </Link>
            </InputLeftAddon>
            <Input value={value} placeholder="Search your drafts" onChange={searchChange} />
          </InputGroup>
        </HStack>
        <VStack pt={padding} pb={padding} w="100%">
          {value === ""
            ? <Hint />
            : <>
              {results.length === 0
                ? <Empty />
                : <Box w="100%" p={padding}>
                  {results.map(result => (
                    // @ts-ignore
                    <Box mb="0.7rem" cursor="pointer" key={result.id} onClick={() => open(result.id)}>
                      <HStack justify="space-between" mb="0.5rem">
                        <HStack>
                          <Icon viewBox="0 0 1024 1024" h="8" w="8" mr="1rem">
                            <path d="M789.4 223.4h177.4v732.2c0 37.8-28.8 66.6-66.6 66.6H190.4c-37.8 0-66.6-28.8-66.6-66.6V68.4c0-37.8 28.8-66.6 66.6-66.6h554.7v177.4h44.5v44.2h-0.2z m-66.7-22.1V23.9H190.4c-24.5 0-44.5 20-44.5 44.5v887.2c0 24.5 20 44.5 44.5 44.5h709.8c24.5 0 44.5-20 44.5-44.5V245.5H767.3V201h-44.5l-0.1 0.3z" fill="#9FA0A6" p-id="5785"></path><path d="M212.5 889H878v44.5H212.5zM212.5 778.2H878v44.5H212.5zM212.5 667H878v44.5H212.5z" fill="#9FA0A6" p-id="5786"></path><path d="M101.7 112.6h354.9c24.5 0 44.5 20 44.5 44.5V512c0 24.5-20 44.5-44.5 44.5H101.7c-24.5 0-44.5-20-44.5-44.5V156.8c0-24.2 20-44.2 44.5-44.2z" fill="#05C1E0" p-id="5787"></path><path d="M254.3 459.9V271c0-3.9-3-7-7-7h-58.7c-3.9 0-7-3-7-7v-27.6c0-3.9 3-7 7-7h180.2c3.9 0 7 3 7 7V257c0 3.9-3 7-7 7h-58.4c-3.9 0-7 3-7 7v188.9c0 3.9-3 7-7 7H261c-3.7-0.3-6.7-3.3-6.7-7z" fill="#FFFFFF" p-id="5788"></path>
                          </Icon>
                          <VStack spacing="0" align="left">
                            {/* @ts-ignore */}
                            <Text>{result.title}</Text>
                            <Text color="GrayText" fontSize="0.8rem" >
                              {/* <span>{draft.words} words</span> */}
                              {/* @ts-ignore */}
                              <span> {result.lastOpen}</span>
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </Box>}
            </>}
        </VStack>
      </VStack>
    </Box>
  )

  function open(id: string) {
    history.push(Path.DRAFT + "/" + id)
  }
}

function Hint() {
  const size = "0.85rem"
  const lightgrey = "#f8f8f8"
  return <Box fontSize={size} color="GrayText" m="auto" bg={lightgrey} p={padding} rounded="md" w="100%">
    You can fuzzy search your drafts here
  </Box>
}

function Empty() {
  const size = "0.85rem"
  const lightgrey = "#f8f8f8"
  return <Box fontSize={size} color="GrayText" m="auto" bg={lightgrey} p={padding} rounded="md" w="100%">
    No search results, try other words
  </Box>
}

