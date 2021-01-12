import { Text, HStack, VStack, Icon, Divider } from "@chakra-ui/react";
import firebase from "firebase";
import React, { MouseEventHandler } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconType } from "react-icons";
import { AiOutlineFileText, AiOutlineFileWord, AiOutlineFilePdf, AiOutlineFileImage } from "react-icons/ai";
import Sheet from "react-modal-sheet";
import { useHistory } from "react-router-dom";
import { Path } from "./App";

type NewProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function New({ open, setOpen }: NewProps) {
  const history = useHistory()
  const [user] = useAuthState(firebase.auth())
  const margin = "2rem"

  return (
    <Sheet isOpen={open} snapPoints={[450]} onClose={() => setOpen(false)}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <VStack mt="1rem" align="left" spacing="1.4rem" color="GrayText">
            <Text ml={margin} mr={margin}>New Draft</Text>
            <Divider />
            <VStack pl={margin} pr={margin} align="left">
              <Button click={text} icon={AiOutlineFileText} text="Create empty draft" />
              <Button click={word} icon={AiOutlineFileWord} text="Import a Word document" />
              <Button click={pdf} icon={AiOutlineFilePdf} text="Import a PDF file" />
              <Button click={ocr} icon={AiOutlineFileImage} text="OCR an image" />
            </VStack>
          </VStack>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setOpen(false)} />
    </Sheet >
  )

  type ButtonProps = { click: MouseEventHandler, icon: IconType, text: string }

  function Button({ click, icon, text }: ButtonProps) {
    return (
      <HStack onClick={click} spacing="1.5rem" pt="1rem" pb="1rem">
        <Icon as={icon} w={6} h={6} />
        <Text>{text}</Text>
      </HStack>
    )
  }

  function text() {
    setOpen(false)
    add("")
  }

  function word() {

  }

  function pdf() {

  }

  function ocr() {

  }

  async function add(text: string) {
    if (!user) return

    firebase.firestore().collection("drafts").add({
      title: "Untitled",
      users: [user.uid],
      words: 0,
      last_open: new Date()
    })
    const unsubscribe = firebase.firestore().collection("drafts")
      .where("users", "array-contains", user.uid)
      .onSnapshot(snapshot => {
        unsubscribe()
        const last = snapshot.docs.pop()
        history.push(Path.DRAFT + "/" + last?.id)
      })
  }
}