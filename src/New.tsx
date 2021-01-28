import { Text, HStack, VStack, Icon, Divider, useToast } from "@chakra-ui/react";
import firebase from "firebase";
import React, { MouseEventHandler, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconType } from "react-icons";
import { AiOutlineFileText, AiOutlineFileWord, AiOutlineFilePdf, AiOutlineFileImage } from "react-icons/ai";
import Sheet from "react-modal-sheet";
import { useHistory } from "react-router-dom";
import { Path } from "./App";
import { useFilePicker } from "react-sage";
import { duration } from "./Setting";
import { createWorker } from "tesseract.js";

type ButtonProps = {
  click: MouseEventHandler,
  icon: IconType,
  text: string,
  hidden?: boolean
}

export function Button({ click, icon, text, hidden }: ButtonProps) {
  return (
    <HStack onClick={click} spacing="1.5rem" pt="1rem" pb="1rem" cursor="pointer" hidden={hidden}>
      <Icon as={icon} w={6} h={6} />
      <Text>{text}</Text>
    </HStack>
  )
}

type NewProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function New({ open, setOpen }: NewProps) {
  const history = useHistory()
  const [user] = useAuthState(firebase.auth())
  const margin = "2rem"
  const { files, onClick, errors, HiddenFileInput } = useFilePicker({ maxFileSize: 10 })
  const toast = useToast()

  useEffect(() => {
    const file = files ? files[0] : null
    if (file) {
      const extension = file.name.split(".").pop() || ""
      if (["png", "jpg", "bmp"].includes(extension)) ocr(file)
      if (["doc", "docx", "pdf"].includes(extension)) wordPdf(file)
    }
  }, [files])

  useEffect(() => {
    if (errors.hasInvalidFileSize) {
      toast({
        title: "File too large",
        status: "error",
        duration: duration,
        isClosable: true
      })
    }
  }, [errors, toast])

  return (
    <Sheet isOpen={open} snapPoints={[450]} onClose={() => setOpen(false)}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <VStack mt="1rem" align="left" spacing="1.4rem" color="GrayText">
            <Text ml={margin} mr={margin} fontWeight="500">New Draft</Text>
            <Divider />
            <VStack pl={margin} pr={margin} align="left">
              <Button click={text} icon={AiOutlineFileText} text="Create an empty draft" />
              <Button click={onClick} icon={AiOutlineFileWord} text="Import a Word document" />
              <Button click={onClick} icon={AiOutlineFilePdf} text="Import a PDF file" />
              <Button click={onClick} icon={AiOutlineFileImage} text="OCR an image" />
              <HiddenFileInput accept=".docx, .pdf, .bmp, .jpg, .png" multiple={false} />
            </VStack>
          </VStack>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setOpen(false)} />
    </Sheet >
  )

  function text() {
    setOpen(false)
    add("")
  }

  function loading() {
    toast({
      title: "Importing...",
      status: "info",
      isClosable: false,
      duration: null
    })
  }

  async function ocr(file: File) {
    loading()
    setOpen(false)
    const worker = createWorker({
      logger: m => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file);
    console.log(text);
    add(text)
    toast.closeAll()
    await worker.terminate();
  }

  async function wordPdf(file: File) {
    loading()
    setOpen(false)
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("https://rlgo.duckdns.org/yjs-file", {
      method: "POST",
      body: formData,
    }).catch(error => console.log(error))

    if (response) {
      const text = await response.text()
      console.log(text)
      add(text)
      toast.closeAll()
    } else {
      toast.closeAll()
    }
  }

  async function add(text: string) {
    if (!user) return

    firebase.firestore().collection("drafts").add({
      title: "Untitled",
      users: [user.uid],
      words: 0,
      last_open: new Date(),
      versions: [],
      init: text
    }).then(() => {
      const unsubscribe = firebase.firestore().collection("drafts")
        .where("users", "array-contains", user.uid)
        .onSnapshot(snapshot => {
          unsubscribe()
          const last = snapshot.docs.shift()
          history.push(Path.DRAFT + "/" + last?.id)
        })
    })
  }
}