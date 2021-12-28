import { Box, Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Box w="container.lg" m="auto" pt="50">
      <HStack>
        <Button as={Link} to={"/posts/new"}>
          Add Post
        </Button>
        <Button as={Link} to={"/users/new"}>
          Add User
        </Button>
      </HStack>
    </Box>
  );
}

export default Home;
