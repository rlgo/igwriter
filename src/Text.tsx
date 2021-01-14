import * as Quill from "quill";
import { Quill as QuillEditor } from "react-quill"

type style = "bold" | "italic" | "underline" | "strike"

const actions: Record<style, (text: string) => string> = {
  "bold": bold,
  "italic": italic,
  "underline": underline,
  "strike": strike
}

export function transform(editor: QuillEditor, style: style) {
  const selection = editor.getSelection()
  const index = selection?.index || 0
  const length = selection?.length || 0
  const current = editor.getText(index, length)
  const text = actions[style](current)
  const delta = new Quill.Delta()
    .retain(index)
    .delete(length)
    .insert(text)
  editor.updateContents(delta)
}

const characters = "abcdefghijklmnopqrstuvwxyz"

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