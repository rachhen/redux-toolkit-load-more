import { Center, Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <Center w="full" h="100vh">
      <Spinner />
    </Center>
  );
}

export default Loading;
