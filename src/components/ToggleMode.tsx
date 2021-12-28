import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, useColorMode } from "@chakra-ui/react";

function ToggleMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box pos="absolute" top={0} right={0}>
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Box>
  );
}

export default ToggleMode;
