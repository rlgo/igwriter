import { Avatar, Box, Divider, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from 'react'
import { VscAdd, VscSearch } from 'react-icons/vsc'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { Path } from './App'
import firebase from "./fire";
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import New from './New';

export const padding = "1.1rem"
export const maxWidth = "800px"

type TopbarProps = {
  path: Path
}

function Topbar({ path }: TopbarProps) {
  const blue = "#0079d4"
  const spacing = "1.75rem"
  const [user, loading] = useAuthState(firebase.auth())
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box bg={blue} w="100%" p={padding} paddingTop="0.7rem" paddingBottom="0.7rem">
        <HStack justify="space-between" paddingTop="0.6rem" maxW={maxWidth} m="auto">
          <HStack spacing={spacing}>
            <Link to={Path.SETTING}>
              {loading
                ? <Box paddingTop="1px" paddingBottom="1px" paddingRight="8px"><Spinner color="white" /></Box>
                : <Avatar size="sm" src={user?.photoURL || ""} />}
            </Link>
            <Text color="white" fontSize="1.2rem" fontWeight="500">{uppercase(path)}</Text>
          </HStack>
          <HStack spacing={spacing}>
            <Icon as={VscAdd} w={6} h={6} color="white" onClick={() => setOpen(true)} />
            <Icon as={VscSearch} w={6} h={6} color="white" className="flip" />
          </HStack>
        </HStack>
      </Box>
      <New open={open} setOpen={setOpen} />
    </>
  )
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
  const [user] = useAuthState(firebase.auth())
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    if (!user) return
    let query = firebase.firestore().collection("drafts")
      .where("users", "array-contains", user.uid)
    if (path !== Path.HOME && path !== Path.RECENT) {
      query = query.where(Path.FAVORITES ? "favorite" : "shared", "==", true)
    }
    query.get().then(snapshot => setList(snapshot.docs))
  }, [user, active, path])

  return (
    <Box maxW={maxWidth} m="auto">
      <HStack justify="space-between">
        <Text mb="0.8rem" fontSize="0.8rem" fontWeight="500">{title}</Text>
        <Link to={path} hidden={!!active} >
          <Text mb="0.8rem" fontSize="0.8rem" fontWeight="500" cursor="pointer">See all</Text>
        </Link>
      </HStack>
      {list.length === 0
        ? <Hint type={path} />
        : <FileList list={list.slice(0, active ? list.length : 5)} />}
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

type ListProps = {
  list: any[]
}

function FileList({ list }: ListProps) {
  const history = useHistory()
  list = list.map(doc => ({ id: doc.id, ...doc.data() }))

  return (
    <Box>
      {list.map((draft, index) => (
        <Box mb="0.7rem" cursor="pointer" key={draft.id} onClick={() => open(draft.id)}>
          <HStack justify="space-between" mb="0.5rem">
            <HStack>
              <Icon viewBox="0 0 1024 1024" h="8" w="8" mr="1rem">
                <path d="M789.4 223.4h177.4v732.2c0 37.8-28.8 66.6-66.6 66.6H190.4c-37.8 0-66.6-28.8-66.6-66.6V68.4c0-37.8 28.8-66.6 66.6-66.6h554.7v177.4h44.5v44.2h-0.2z m-66.7-22.1V23.9H190.4c-24.5 0-44.5 20-44.5 44.5v887.2c0 24.5 20 44.5 44.5 44.5h709.8c24.5 0 44.5-20 44.5-44.5V245.5H767.3V201h-44.5l-0.1 0.3z" fill="#9FA0A6" p-id="5785"></path><path d="M212.5 889H878v44.5H212.5zM212.5 778.2H878v44.5H212.5zM212.5 667H878v44.5H212.5z" fill="#9FA0A6" p-id="5786"></path><path d="M101.7 112.6h354.9c24.5 0 44.5 20 44.5 44.5V512c0 24.5-20 44.5-44.5 44.5H101.7c-24.5 0-44.5-20-44.5-44.5V156.8c0-24.2 20-44.2 44.5-44.2z" fill="#05C1E0" p-id="5787"></path><path d="M254.3 459.9V271c0-3.9-3-7-7-7h-58.7c-3.9 0-7-3-7-7v-27.6c0-3.9 3-7 7-7h180.2c3.9 0 7 3 7 7V257c0 3.9-3 7-7 7h-58.4c-3.9 0-7 3-7 7v188.9c0 3.9-3 7-7 7H261c-3.7-0.3-6.7-3.3-6.7-7z" fill="#FFFFFF" p-id="5788"></path>
              </Icon>
              <VStack spacing="0" align="left">
                <Text >{draft.title}</Text>
                <Text color="GrayText" fontSize="0.8rem" >
                  {draft.words} words
                  <span> {dayjs(draft.last_open.toDate()).format("DD MMM YYYY")}</span>
                </Text>
              </VStack>
            </HStack>
            <Icon as={IoEllipsisVerticalSharp} color="GrayText" w="5" h="5" onClick={(e) => { option(draft.id); e.stopPropagation() }} />
          </HStack>
          <Divider hidden={index === list.length - 1} />
        </Box>
      ))}
    </Box>
  )

  function open(id: string) {
    history.push(Path.DRAFT + "/" + id)
  }

  function option(id: string) {
    console.log("option" + id)
  }
}

type PageProps = {
  path: Path
}

export default function Page({ path }: PageProps) {
  return (
    <VStack>
      <Topbar path={path} />
      <Box p={padding} w="100vw" pb="70px">
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