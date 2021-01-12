import { Box, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { IoArrowBackSharp } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import { padding, maxWidth } from './Page'

function Topbar() {
  const blue = "#0079d4"
  const spacing = "1.75rem"

  return (
    <Box bg={blue} w="100%" p={padding} paddingTop="1.3rem" paddingBottom="0.9rem">
      <HStack spacing={spacing} maxW={maxWidth} m="auto">
        <Link to="/">
          <Icon as={IoArrowBackSharp} w={6} h={6} color="white" />
        </Link>
        <Text color="white" fontSize="1.2rem" fontWeight="500">Settings</Text>
      </HStack>
    </Box>
  )
}

export default function Draft() {
  const { id } = useParams<{ id: string }>()

  return (
    <VStack>
      <Text>{id}</Text>
    </VStack>
  )
}