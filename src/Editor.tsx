import React, { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import * as _Quill from "quill";
import QuillCursors from "quill-cursors"
import { Quill as QuillEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { VStack, Icon, Box, HStack, Divider, Text, useToast, Input, Switch, Button as CButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { IconType } from "react-icons"
import Sheet from "react-modal-sheet"
import { AiOutlineBold, AiOutlineCopy, AiOutlineEdit, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineUnderline } from "react-icons/ai"
import { copy } from "./Export"
import { Button as SheetButton } from "./New"
import { VscGitPullRequest, VscSettings } from "react-icons/vsc";
import { IoShareSocialOutline } from "react-icons/io5";
import { maxWidth } from "./Page";
import { duration } from "./Setting";
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { QuillBinding } from 'y-quill'
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "./fire";
import { useDocumentData } from "react-firebase-hooks/firestore";

const grey = "#6E6E6E"

interface UnprivilegedEditor {
  getLength(): number;
  getText(index?: number, length?: number): string;
  getHTML(): string;
  getBounds(index: number, length?: number): _Quill.BoundsStatic;
  getSelection(focus?: boolean): _Quill.RangeStatic;
  getContents(index?: number, length?: number): _Quill.DeltaStatic;
}

type BottomProps = {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
  editor?: QuillEditor,
  limit?: number,
  limitHard?: boolean
}

function Bottom({ id, open, setOpen, editor, limit, limitHard }: BottomProps) {
  const margin = "2rem"
  const marginLarge = "4rem"
  const toast = useToast()
  const [page, setPage] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [characterLimit, setCharacterLimit] = useState(limit)
  const [hardLimit, setHardLimit] = useState(limitHard)
  const [renameModal, setRenameModal] = useState(false)
  const characterRef = useRef(null)
  const hardRef = useRef(null)
  const nameRef = useRef(null)

  const limitChange: ChangeEventHandler = event => {
    //@ts-ignore
    const value: number = event.target.value
    setCharacterLimit(value)
    if (value > 0 && value < 1000000)
      setInvalid(false)
    else setInvalid(true)
  }

  const hardlimitChange: ChangeEventHandler = event => {
    //@ts-ignore
    const value: boolean = event.target.checked
    setHardLimit(value)
  }

  return (
    <>
      <Sheet isOpen={open} snapPoints={[450]} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <VStack mt="1rem" align="left" spacing="1.4rem" color="GrayText">
              <Text ml={margin} mr={margin} fontWeight="500">File actions</Text>
              <Divider />
              <VStack pl={margin} pr={margin} align="left">
                <SheetButton click={copyClick} icon={AiOutlineCopy} text="Copy Text" />
                <SheetButton click={renameClick} icon={AiOutlineEdit} text="Rename Title" />
                <SheetButton hidden={!navigator.share} click={shareClick} icon={IoShareSocialOutline} text="Share with link" />
                <SheetButton click={versionClick} icon={VscGitPullRequest} text="Version History" />
                <SheetButton click={setupClick} icon={VscSettings} text="Page Setup" />
              </VStack>
            </VStack>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet >
      <Sheet isOpen={page} snapPoints={[450]} onClose={() => setPage(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <VStack mt="1rem" align="left" spacing="1.4rem" color="GrayText">
              <Text ml={margin} mr={margin} fontWeight="500">Page setup</Text>
              <Divider />
              <VStack pl={margin} pr={marginLarge} align="left" fontSize="1rem" spacing={margin}>
                <HStack spacing={marginLarge}>
                  <Text w="30%">Character Limit</Text>
                  <Input ref={characterRef} isInvalid={invalid} size="sm" defaultValue={characterLimit} type="number" onChange={limitChange} w="50%" />
                </HStack>
                <HStack spacing={marginLarge}>
                  <Text w="30%">Hard Limit</Text>
                  <Switch ref={hardRef} defaultChecked={hardLimit} onChange={hardlimitChange} />
                </HStack>
                <CButton colorScheme="blue" onClick={applyClick}>Apply</CButton>
              </VStack>
            </VStack>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setPage(false)} />
      </Sheet>
      <Modal isCentered={true} isOpen={renameModal} onClose={() => setRenameModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Draft</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input ref={nameRef} placeholder="Draft title" />
          </ModalBody>
          <ModalFooter>
            <CButton colorScheme="blue" mr={3} onClick={() => renameApplyClick()}>
              Apply
            </CButton>
            <CButton variant="ghost" onClick={() => setRenameModal(false)}>Cancel</CButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

  function applyClick() {
    if (invalid) {
      return toast({
        title: "Invalid input",
        duration: duration,
        isClosable: true,
        status: "error"
      })
    }
    //@ts-ignore
    let character = characterRef?.current.value
    //@ts-ignore
    const hard = hardRef?.current.checked
    firebase.firestore().collection("drafts").doc(id).update({
      characterLimit: character,
      hardLimit: hard
    })
    setPage(false)
  }

  function copyClick() {
    if (editor) {
      copy(editor).then(() => {
        toast({
          title: "Text Copied",
          status: "success",
          duration: duration,
          isClosable: true
        })
      })
    }
    setOpen(false)
  }

  function shareClick() {
    navigator.share({
      title: "Edit collaboratively at igwriter",
      url: window.location.href
    }).then(() => {
      firebase.firestore().collection("drafts").doc(id).update({
        shared: true
      })
    })
    setOpen(false)
  }

  function renameClick() {
    setOpen(false)
    setRenameModal(true)
  }

  function renameApplyClick() {
    if (nameRef) {
      // @ts-ignore
      const name = nameRef.current?.value
      if (name.length > 0) {
        firebase.firestore().collection("drafts").doc(id).update({
          title: name
        })
      } else return
    }
    setRenameModal(false)
  }

  function versionClick() {

    setOpen(false)
  }

  function setupClick() {
    setPage(true)
    setOpen(false)
  }
}

type ButtonProps = {
  icon: IconType,
  active: boolean
  onclick: MouseEventHandler
}

function Button({ icon, active, onclick }: ButtonProps) {
  const horizontal = "0.4rem"
  const vertical = "0.2rem"
  return (
    <Box pr={horizontal} pl={horizontal} pt={vertical} pb={vertical} bg={active ? "#6e6e6e" : "transparent"} borderRadius="4px">
      <Icon as={icon} color={active ? "white" : grey} onClick={onclick} className="unselectable" />
    </Box>
  )
}

const modules = {
  cursors: true,
  toolbar: false,
  history: { userOnly: true },
}

type Style = "bold" | "italic" | "underline" | "strike" | "none"

type EditorProps = {
  id: string,
  open: boolean,
  setOpen: (open: boolean) => void,
}

export default function Editor({ id, open, setOpen }: EditorProps) {
  const quillRef = useRef<ReactQuill>(null)
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState<Style>("none")
  const [character, setCharacter] = useState(0)
  const [word, setWord] = useState(0)
  const [user, userLoading] = useAuthState(firebase.auth())
  const [data] = useDocumentData(firebase.firestore().collection("drafts").doc(id))

  useEffect(() => {
    (window as any).edit = quillRef.current?.getEditor();
    (window as any).ref = quillRef;
    if (!id || userLoading || !quillRef || !user) return

    const editor = quillRef.current?.getEditor()
    const ydoc = new Y.Doc()
    const type = ydoc.getText(id)
    const name = user?.isAnonymous ? "Guest" : user?.displayName
    new IndexeddbPersistence(id, ydoc)
    const websocketProvider = new WebsocketProvider("ws://rlgo.duckdns.org:6393", id, ydoc)
    websocketProvider.connect()
    const webrtcProvider = new WebrtcProvider(id, ydoc)
    webrtcProvider.connect()
    new QuillBinding(type, editor, websocketProvider.awareness)
    websocketProvider.awareness.setLocalStateField('user', {
      name: name,
      color: 'blue'
    })

    return () => {
      if (webrtcProvider.connected)
        webrtcProvider.disconnect()
      webrtcProvider.destroy()
      if (websocketProvider.wsconnected)
        websocketProvider.disconnect()
      websocketProvider.destroy()
    }
  }, [quillRef, id, user, userLoading])

  useEffect(() => {
    if (user) {
      firebase.firestore().collection("drafts").doc(id).update({
        users: firebase.firestore.FieldValue.arrayUnion(user.uid)
      })
    }
  }, [id, user])

  Quill.import("delta")
  Quill.register("modules/cursors", QuillCursors)

  return loading ? <></>
    : <>
      <VStack maxW={maxWidth} w="100%" h="100%" spacing="0">
        <HStack w="100%" justify="space-between">
          <HStack p="0.5rem" pb="0" spacing="0">
            <Button icon={AiOutlineBold} active={style === "bold"} onclick={() => click("bold")} />
            <Button icon={AiOutlineItalic} active={style === "italic"} onclick={() => click("italic")} />
            <Button icon={AiOutlineUnderline} active={style === "underline"} onclick={() => click("underline")} />
            <Button icon={AiOutlineStrikethrough} active={style === "strike"} onclick={() => click("strike")} />
          </HStack>
          <HStack color={grey} mr="1rem" fontSize="0.9rem">
            <Text>{character} characters</Text>
            <Text>{word} words</Text>
          </HStack>
        </HStack>
        <ReactQuill
          ref={quillRef}
          placeholder="Compose your story here ..."
          theme="snow"
          modules={modules}
          defaultValue=""
          onChangeSelection={onSelection}
          onChange={onChange} />
      </VStack>
      {/* @ts-ignore */}
      <Bottom id={id} editor={quillRef.current?.getEditor()} open={open} setOpen={setOpen} characterLimit={data?.characterLimit} limitHard={data?.hardLimit} />
    </>

  function click(type: Style) {
    const editor = quillRef.current?.getEditor()
    if (!editor) return
    if (style === type) {
      editor.format(style, false)
      setStyle("none")
    } else {
      editor.format(style, false)
      editor.format(type, true)
      setStyle(type)
    }
  }

  function onChange(
    content: string,
    delta: _Quill.Delta,
    source: _Quill.Sources,
    editor: UnprivilegedEditor
  ) {
    const text = editor.getText().trim()
    const length = editor.getLength()
    //@ts-ignore
    const characterLimit = data?.characterLimit
    setCharacter(length - 1)
    setWord(text.length > 0 ? text.split(" ").length : 0)
    if (characterLimit && characterLimit > 0 && length > characterLimit) {
      quillRef.current?.getEditor().deleteText(characterLimit, length)
    }
  }

  function onSelection(
    range: _Quill.RangeStatic,
    source: _Quill.Sources,
    editor: UnprivilegedEditor
  ) {
    if (open) return
    const formats = quillRef.current?.getEditor().getFormat()
    const keys = Object.keys(formats || {})
    if (keys.length > 0) {
      keys.forEach((val) => {
        const style = val as Style
        console.log(style)
        setStyle(style)
      })
    } else {
      setStyle("none")
    }
  }
}