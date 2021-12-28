import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  HStack,
  Radio,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { ChangeEvent, FormEvent } from "react";
import {
  CreatePostBody,
  PostError,
  postStatuses,
  UpdatePostBody,
} from "../app/services/posts";

export type ChangeType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface PostFormProps<T> {
  values: T;
  submitText: string;
  error?: FetchBaseQueryError | SerializedError;
  isLoading?: boolean;
  onChange: (e: any) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function PostForm<T extends CreatePostBody | UpdatePostBody>(
  props: PostFormProps<T>
) {
  const { values, submitText, isLoading, error, onChange, onSubmit } = props;

  const getError = (field: keyof PostError) => {
    const isError = error && "status" in error && error.status === 400;

    if (isError && (error.data as PostError)[field]) {
      return (error.data as PostError)[field];
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="5">
        <FormControl isInvalid={!!getError("title")}>
          <FormLabel htmlFor="title">TItle</FormLabel>
          <Input
            id="title"
            name="title"
            onChange={onChange}
            value={values.title}
          />
          {!!getError("title") && (
            <Text fontSize="xs" color="red.500">
              {getError("title")}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!getError("author")}>
          <FormLabel htmlFor="author">Author</FormLabel>
          <Input
            id="author"
            name="author"
            onChange={onChange}
            value={values.author}
          />
          {!!getError("author") && (
            <Text fontSize="xs" color="red.500">
              {getError("author")}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!getError("content")}>
          <FormLabel htmlFor="content">Content</FormLabel>
          <Textarea
            id="content"
            name="content"
            onChange={onChange}
            value={values.content}
          />
          {!!getError("content") && (
            <Text fontSize="xs" color="red.500">
              {getError("content")}
            </Text>
          )}
        </FormControl>
        <FormControl
          isInvalid={!!getError("status")}
          as="fieldset"
          onChange={(e) => onChange?.(e as any)}
        >
          <FormLabel as="legend">Status</FormLabel>
          <RadioGroup name="status" value={values.status}>
            <HStack spacing="24px">
              {postStatuses.map((item) => (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
          {!!getError("status") && (
            <Text fontSize="xs" color="red.500">
              {getError("status")}
            </Text>
          )}
        </FormControl>
        <Box>
          <Button type="submit" isLoading={isLoading}>
            {submitText}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}

export default PostForm;
