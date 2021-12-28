import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages";
import PostCreate from "./pages/posts/create";
import PostShow from "./pages/posts/show";
import PostEdit from "./pages/posts/edit";
import NotFound from "./pages/NotFound";
import ToggleMode from "./components/ToggleMode";
import PostHome from "./pages/posts";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostHome />} />
          <Route path="/posts/:id" element={<PostShow />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/posts/new" element={<PostCreate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToggleMode />
    </ChakraProvider>
  );
}

export default App;
