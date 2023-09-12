"use client"
import { Box, Flex, IconButton, Input, InputGroup, InputRightAddon, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useDisclosure, Button, Image, Link } from "@chakra-ui/react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React from "react";
import { DLResult } from '@tobyg74/tiktok-api-dl/lib/types/index'

export default function Home() {
  const [data, setData] = React.useState<DLResult | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>()
  const inputRef = React.createRef<HTMLInputElement>();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const URL = inputRef.current!.value;
    const response = await fetch('/api/getInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ URL })
    });

    if (!response.ok) {
      toast({
        title: "Error",
        description: "Internal Server Error",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    const data = await response.json();

    setData(data);

    if (data.status == "error") {
      toast({
        title: "Error",
        description: data.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
      return;
    }

    onOpen();
  };

  return (
    <Box h="100%" px={10}>
      <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Box w={"100dvh"}>
          <Box textAlign={"center"}>
            <Text fontSize={"4xl"} fontWeight={"bold"}>Tiked</Text>
          </Box>
          <Box marginTop={4}>
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <Input variant={"filled"} placeholder="Enter Tiktok Video Link" ref={inputRef} />
                <InputRightAddon padding={0}>
                  <IconButton roundedLeft={"0"} aria-label="Download" colorScheme="teal" icon={<FileDownloadIcon />} type="submit" />
                </InputRightAddon>
              </InputGroup>
            </form>
          </Box>
        </Box>
      </Flex>
      <Box>
        <AlertDialog isOpen={isOpen} onClose={onClose} size={"3xl"} leastDestructiveRef={cancelRef}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
                <Text>Download File</Text>
              </AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                {data && data?.result?.type == "video" && (
                  <>
                    <Flex gap={3}>
                      <Image src={String(data?.result?.cover)} alt={String(data?.result?.id)} w={"30%"} />
                      <Box>
                        <Text>
                          {data?.result?.description}
                        </Text>
                        <Link href={String(data?.result.video)} download target="_blank">
                          <Button colorScheme="teal" mt={7} w="full">Download</Button>
                        </Link>
                      </Box>
                    </Flex>
                  </>
                )}
                {data && data?.result?.type === "image" && (
                  <Flex justifyContent="center" alignItems="center">
                    <Flex
                      flexWrap="wrap"
                      gridGap="20px" // Adjust the gap between grid items as needed
                      maxWidth="800px" // Limit the maximum width of the grid container
                    >
                      {data.result?.images?.map((event, index) => (
                        <Box key={index} width="calc(50% - 10px)" position="relative">
                          <Image
                            src={event}
                            alt={String(index)}
                            width="100%"
                            height="auto"
                            objectFit="cover"
                          />
                          <Link href={event} download target="_blank" position="absolute" bottom="10px" right="10px">
                            <Button size="sm" colorScheme="teal">Download</Button>
                          </Link>
                        </Box>
                      ))}
                    </Flex>
                  </Flex>
                )}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Box textAlign={"center"}>
                  <Button onClick={onClose}>Close</Button>
                </Box>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  )
}
