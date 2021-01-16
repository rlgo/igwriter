import { toast } from "@chakra-ui/react";
import * as Quill from "quill";
import { Quill as QuillEditor } from "react-quill"

export type Style = "bold" | "italic" | "underline" | "strike"

const actions: Record<Style, (text: string) => string> = {
  "bold": bold,
  "italic": italic,
  "underline": underline,
  "strike": strike
}

export function copy(editor: QuillEditor) {
  const contents = editor.getContents()
  const text = contents.map(op => {
    const attr = op.attributes
    const keys = Object.keys(attr || {})
    const key = keys[0] as Style
    return key ? actions[key](op.insert) : op.insert
  }).join()
  debugger
  return navigator.clipboard.writeText(text)
}

const characters = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function bold(text: string) {
  const bolds = "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"
  let result = ""
  for (const c of text) {
    const index = characters.indexOf(c)
    result += index !== -1 ? bolds.charAt(index) : c
  }
  return result
}

function italic(text: string) {
  return ""
}

function underline(text: string) {
  return ""
}

function strike(text: string) {
  return ""
}