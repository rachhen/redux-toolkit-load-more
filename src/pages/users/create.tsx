import { Box, Button, Heading } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUserBody, useAddUserMutation } from "../../app/services/posts";
import UserForm, { ChangeType } from "../../components/UserForm";

function UserCreate() {
  const navigate = useNavigate();
  const [createUser, { isLoading, error }] = useAddUserMutation();
  const [values, setUsers] = useState<CreateUserBody>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    avatar: "",
    status: "1",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(values);
    await createUser(values).unwrap();
    navigate("/users");
  };

  const onChange = (e: ChangeType) => {
    setUsers((prev) => ({ ...prev, ...{ [e.target.name]: e.target.value } }));
  };

  return (
    <Box maxW="container.lg" m="auto" mt="10">
      <Button size="xs" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Heading mb="5">Create User</Heading>
      <UserForm<CreateUserBody>
        values={values}
        error={error}
        submitText="Create"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
    </Box>
  );
}

export default UserCreate;
