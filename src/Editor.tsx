import { useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

type EditorProps = {
  id: string
}

export default function Editor({ id }: EditorProps) {
  const [value, setValue] = useState("")

  return (
    <ReactQuill theme="snow" value={value} onChange={setValue} />
  )
}