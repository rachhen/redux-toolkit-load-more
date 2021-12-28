import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreatePostBody,
  PostError,
  postStatuses,
  useAddPostMutation,
} from "../../app/services/posts";
import PostForm, { ChangeType } from "../../components/PostForm";

function PostCreate() {
  const navigate = useNavigate();
  const [createPost, { isLoading, error }] = useAddPostMutation();
  const [post, setPost] = useState<CreatePostBody>({
    title: "",
    author: "",
    content: "",
    status: "draft",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost(post).unwrap();
    navigate(-1);
  };

  const onChange = (e: ChangeType) => {
    setPost((prev) => ({ ...prev, ...{ [e.target.name]: e.target.value } }));
  };

  return (
    <Box w="50%" m="auto" mt="50">
      <Button size="xs" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Heading mb="5">Create Post</Heading>
      <PostForm<CreatePostBody>
        values={post}
        error={error}
        submitText="Create"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
    </Box>
  );
}

export default PostCreate;
