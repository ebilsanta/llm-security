import { useState, useEffect, useRef } from 'react'
import { SkeletonText, Container, Box, Input, Button, HStack, VStack, Text, Flex} from "@chakra-ui/react"
import ChatBubble from './ChatBubble'
import { ChatAPI } from '../api/ChatAPI'

export default function ChatBox(props) { 
  const [messages, setMessages] = useState([{sender: 'bot', msg: 'Hello, what would you like to do today?'}])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef(null);
  const handleInputChange = (e) => {
    setInput(e.target.value)
  }
  const handleClearMessages = () => {
    setMessages([{sender: 'bot', msg: 'Hello, what would you like to do today?'}])
  }
  const handleSendMessage = () => {
    setMessages(messages => [...messages, {sender: 'user', msg: input}])
    setIsLoading(true);
    setInput('')
    ChatAPI.sendMessage(input)
      .then((data) => {
        const query = JSON.parse(data.message.function_call.arguments).query
        const result = data.result
        setMessages(messages => [...messages, {sender: 'bot', msg: "The query is: " + query}, {sender: 'bot', msg: "The result is: \n" + result}])
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err)
        console.log('hello')
        setMessages(messages => [...messages, {sender: 'bot', msg: "Sorry, I didn't understand that."}])})
      .finally(() => {setIsLoading(false)})
  }
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      buttonRef.current.click();
    }
  }
  // useEffect(() => {
    
  // }, [])
  
  return (
    <Container centerContent h="90vh" display="flex" flexDirection="column" justifyContent="flex-end" position="relative">
      <Flex justifyContent='space-between' align='end' minWidth="800px">
        <Text fontSize="2xl" paddingLeft="16px" fontWeight="bold" marginBottom="10px">SQL Assistant</Text>
        <Button colorScheme="red" size="md" onClick={handleClearMessages}>Clear Messages</Button>
      </Flex>
      <Box padding='1' minWidth="800px" flex="1" overflowY="auto">
        <VStack> 
          {messages.map((msg, i) => <ChatBubble key={i} sender={msg.sender} msg={msg.msg} />)}
          {
            isLoading &&  <SkeletonText noOfLines={3} skeletonHeight='2' width='400px' spacing='4' alignSelf='flex-start'/>
          }
        </VStack>
      </Box>
      <Box width="800px" position="sticky" bottom="0" marginTop="10px">
        <HStack>
          <Input placeholder="Type here..." flex="1" value={input} onKeyDown={handleKeyDown} onChange={handleInputChange}/>
          <Button colorScheme="teal" size="md" ref={buttonRef} onClick={handleSendMessage}>Send</Button>
        </HStack>
      </Box>
    </Container>
  )

}

