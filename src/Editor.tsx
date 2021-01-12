import { useState } from "react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

type EditorProps = {
  id: string
}

export default function Editor({ id }: EditorProps) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  return loading ? <></>
    : <ReactQuill theme="snow" defaultValue={value} onChange={setValue} />
}