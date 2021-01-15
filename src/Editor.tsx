import React, { MouseEventHandler, useEffect, useRef, useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import * as _Quill from "quill";
import QuillCursors from "quill-cursors"
import { Quill as QuillEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { VStack, Icon, Box, HStack, Divider, Text } from "@chakra-ui/react"
import { IconType } from "react-icons"
import Sheet from "react-modal-sheet"
import { AiOutlineBold, AiOutlineCopy, AiOutlineItalic, AiOutlineShareAlt, AiOutlineStrikethrough, AiOutlineUnderline } from "react-icons/ai"
import { transform, style as styleType, copy } from "./Export"
import { Button as SheetButton } from "./New"
import { VscGitPullRequest, VscSettings } from "react-icons/vsc";
import { IoShareSocialOutline } from "react-icons/io5";

const blue = "#0178D4"
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
    if (editor) copy(editor)
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
  return <Icon as={icon} color={active ? blue : grey} onClick={onclick} className="unselectable" />
}

const modules = {
  cursors: true,
  toolbar: false,
  history: { userOnly: true },
}

type EditorProps = {
  id: string,
  open: boolean,
  setOpen: (open: boolean) => void
}

export default function Editor({ id, open, setOpen }: EditorProps) {
  const quillRef = useRef<ReactQuill>(null)
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState<Record<styleType, boolean>>({
    "bold": false,
    "italic": false,
    "underline": false,
    "strike": false
  })

  useEffect(() => {
    (window as any).edit = quillRef.current?.getEditor();
    (window as any).ref = quillRef;
  }, [quillRef])

  Quill.import("delta")
  Quill.register("modules/cursors", QuillCursors)

  return loading ? <></>
    : <>
      <VStack w="100%" h="100%" spacing="0">
        <Box w="100%">
          <HStack p="1rem">
            <Button icon={AiOutlineBold} active={style.bold} onclick={() => click("bold")} />
            <Button icon={AiOutlineItalic} active={style.italic} onclick={() => click("italic")} />
            <Button icon={AiOutlineUnderline} active={style.underline} onclick={() => click("underline")} />
            <Button icon={AiOutlineStrikethrough} active={style.strike} onclick={() => click("strike")} />
          </HStack>
        </Box>
        <ReactQuill
          ref={quillRef}
          placeholder="Compose your story here ..."
          theme="snow"
          modules={modules}
          defaultValue={"value"}
          onChange={onChange} />
      </VStack>
      <Bottom id={id} editor={quillRef.current?.getEditor()} open={open} setOpen={setOpen} />
    </>

  function click(type: styleType) {
    const editor = quillRef.current?.getEditor()
    if (!editor) return
    const newStyle = { ...style }
    const value = !style[type]
    const selection = editor.getSelection()
    if (selection) editor.removeFormat(selection.index, selection.length)
    editor.format(type, value)
    newStyle[type] = value
    setStyle(newStyle)
  }

  function onChange(
    content: string,
    delta: _Quill.Delta,
    source: _Quill.Sources,
    editor: UnprivilegedEditor
  ) {

  }
}