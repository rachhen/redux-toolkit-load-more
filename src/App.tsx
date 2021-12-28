import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Header from "./components/Header";
// import ToggleMode from "./components/ToggleMode";

import Home from "./pages";
import PostCreate from "./pages/posts/create";
import PostShow from "./pages/posts/show";
import PostEdit from "./pages/posts/edit";
import NotFound from "./pages/NotFound";
import PostHome from "./pages/posts";
import UserHome from "./pages/users";
import UserShow from "./pages/users/show";
import UserEdit from "./pages/users/edit";
import UserCreate from "./pages/users/create";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostHome />} />
          <Route path="/posts/:id" element={<PostShow />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/posts/new" element={<PostCreate />} />
          <Route path="/users" element={<UserHome />} />
          <Route path="/users/:id" element={<UserShow />} />
          <Route path="/users/:id/edit" element={<UserEdit />} />
          <Route path="/users/new" element={<UserCreate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <ToggleMode /> */}
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
