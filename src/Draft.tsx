import { Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export default function Draft() {
  const { id } = useParams<{ id: string }>()

  return (
    <Text>{id}</Text>
  )
}