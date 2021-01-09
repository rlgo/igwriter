import { Box } from '@chakra-ui/react'
import React from 'react'
import { Path } from './App'

type PageProps = {
  path: Path
}

export default function Page({ path }: PageProps) {
  return (
    <Box>{uppercase(path)}</Box>
  )
}

function uppercase(text: string) {
  text = text.replace("/", "")
  return text.charAt(0).toUpperCase() + text.slice(1)
}