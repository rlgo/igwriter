import { useEffect, useRef, useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import * as _Quill from "quill";
import QuillCursors from "quill-cursors"
import 'react-quill/dist/quill.snow.css'

interface UnprivilegedEditor {
  getLength(): number;
  getText(index?: number, length?: number): string;
  getHTML(): string;
  getBounds(index: number, length?: number): _Quill.BoundsStatic;
  getSelection(focus?: boolean): _Quill.RangeStatic;
  getContents(index?: number, length?: number): _Quill.DeltaStatic;
}

type EditorProps = {
  id: string
}

const modules = {
  cursors: true,
  toolbar: false,
  history: { userOnly: true },
}

export default function Editor({ id }: EditorProps) {
  const [loading, setLoading] = useState(false)
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    const quillEditor = quillRef.current?.getEditor();
    (window as any).edit = quillEditor;
    (window as any).ref = quillRef;
  }, [quillRef])

  Quill.register("modules/cursors", QuillCursors)

  return loading ? <></>
    : <ReactQuill
      ref={quillRef}
      placeholder="Compose your story here ..."
      theme="snow"
      modules={modules}
      defaultValue={"value"}
      onChange={onChange} />

  function onChange(
    content: string,
    delta: _Quill.Delta,
    source: _Quill.Sources,
    editor: UnprivilegedEditor
  ) {

  }
}