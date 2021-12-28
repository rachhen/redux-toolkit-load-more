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
import { CreateUserBody } from "../app/services/posts";

export type ChangeType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface UserFormProps<T> {
  values: T;
  submitText: string;
  error?: FetchBaseQueryError | SerializedError;
  isLoading?: boolean;
  onChange: (e: any) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function UserForm<T extends Partial<CreateUserBody>>(props: UserFormProps<T>) {
  const { values, submitText, isLoading, error, onChange, onSubmit } = props;

  const getError = (field: keyof Partial<CreateUserBody>) => {
    const isError = error && "status" in error && error.status === 400;

    if (isError && (error.data as T)[field]) {
      return (error.data as T)[field];
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="5">
        <HStack align="stretch">
          <FormControl isInvalid={!!getError("firstName")}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              name="firstName"
              onChange={onChange}
              value={values.firstName}
            />
            {!!getError("firstName") && (
              <Text fontSize="xs" color="red.500">
                {getError("firstName")}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!getError("lastName")}>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              name="lastName"
              onChange={onChange}
              value={values.lastName}
            />
            {!!getError("lastName") && (
              <Text fontSize="xs" color="red.500">
                {getError("lastName")}
              </Text>
            )}
          </FormControl>
        </HStack>
        <HStack align="stretch">
          <FormControl isInvalid={!!getError("username")}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              name="username"
              onChange={onChange}
              value={values.username}
            />
            {!!getError("username") && (
              <Text fontSize="xs" color="red.500">
                {getError("username")}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!getError("password")}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={onChange}
              value={values.password}
            />
            {!!getError("password") && (
              <Text fontSize="xs" color="red.500">
                {getError("password")}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={!!getError("email")}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              onChange={onChange}
              value={values.email}
            />
            {!!getError("email") && (
              <Text fontSize="xs" color="red.500">
                {getError("email")}
              </Text>
            )}
          </FormControl>
        </HStack>
        <FormControl isInvalid={!!getError("avatar")}>
          <FormLabel htmlFor="avatar">Avatar</FormLabel>
          <Textarea
            id="avatar"
            name="avatar"
            onChange={onChange}
            value={values.avatar}
          />
          {!!getError("avatar") && (
            <Text fontSize="xs" color="red.500">
              {getError("avatar")}
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
              <Radio value="1">Active</Radio>
              <Radio value="0">Inactive</Radio>
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

export default UserForm;
