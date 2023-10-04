import { useState, useEffect } from 'react'
import { Card, CardBody, Container, Box, Text } from "@chakra-ui/react"

export default function ChatBubble({sender, msg}) { 
  const alignment = sender === 'bot' ? 'start' : 'end'
  return (
    <Card alignSelf={alignment}>
      <CardBody>
        <Text align="center">{msg}</Text>
      </CardBody>
    </Card>
  )

}

