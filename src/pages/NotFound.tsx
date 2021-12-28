import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box>
      <Button size="xs" onClick={() => navigate("/")}>
        Go Home
      </Button>
      <Heading>Oops, Not Found</Heading>
    </Box>
  );
}

export default NotFound;
