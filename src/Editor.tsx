import React, { MouseEventHandler, useEffect, useRef, useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import * as _Quill from "quill";
import QuillCursors from "quill-cursors"
import { Quill as QuillEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { VStack, Icon, Box, HStack, Divider, Text, useToast } from "@chakra-ui/react"
import { IconType } from "react-icons"
import Sheet from "react-modal-sheet"
import { AiOutlineBold, AiOutlineCopy, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineUnderline } from "react-icons/ai"
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
  editor?: QuillEditor
}

function Bottom({ id, open, setOpen, editor }: BottomProps) {
  const margin = "2rem"
  const toast = useToast()

  return (
    <Sheet isOpen={open} snapPoints={[450]} onClose={() => setOpen(false)}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <VStack mt="1rem" align="left" spacing="1.4rem" color="GrayText">
            <Text ml={margin} mr={margin} fontWeight="500">File actions</Text>
            <Divider />
            <VStack pl={margin} pr={margin} align="left">
              <SheetButton click={copyClick} icon={AiOutlineCopy} text="Copy Text" />
              <SheetButton click={shareClick} icon={IoShareSocialOutline} text="Share with link" />
              <SheetButton click={versionClick} icon={VscGitPullRequest} text="Version History" />
              <SheetButton click={setup} icon={VscSettings} text="Page Setup" />
            </VStack>
          </VStack>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setOpen(false)} />
    </Sheet >
  )

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

    setOpen(false)
  }

  function versionClick() {

    setOpen(false)
  }

  function setup() {

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
  const [characterLimit, setCharacterLimit] = useState(0)

  useEffect(() => {
    (window as any).edit = quillRef.current?.getEditor();
    (window as any).ref = quillRef;
    if (!id || userLoading || !quillRef) return
    const editor = quillRef.current?.getEditor()
    const ydoc = new Y.Doc()
    const type = ydoc.getText(id)
    new IndexeddbPersistence(id, ydoc)
    const webrtcProvider = new WebrtcProvider(id, ydoc)
    webrtcProvider.connect()
    const websocketProvider = new WebsocketProvider("ws://localhost:1234", id, ydoc)
    websocketProvider.connect()
    new QuillBinding(type, editor, websocketProvider.awareness)
    websocketProvider.awareness.setLocalStateField('user', {
      name: user?.displayName,
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
      <Bottom id={id} editor={quillRef.current?.getEditor()} open={open} setOpen={setOpen} />
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
    setCharacter(length - 1)
    setWord(text.length > 0 ? text.split(" ").length : 0)
    if (characterLimit > 0 && length > characterLimit) {
      quillRef.current?.getEditor().deleteText(characterLimit, length)
    }
  }

  function onSelection(
    range: _Quill.RangeStatic,
    source: _Quill.Sources,
    editor: UnprivilegedEditor
  ) {
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