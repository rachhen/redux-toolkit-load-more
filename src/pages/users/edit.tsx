import { Box, Button, Heading } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreateUserBody,
  useUpdateUserMutation,
  useUserQuery,
} from "../../app/services/posts";
import Loading from "../../components/Loading";
import UserForm, { ChangeType } from "../../components/UserForm";

function UserEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { data: user, isLoading } = useUserQuery(params.id!);
  const [updatePost, { isLoading: createIsLoading, error }] =
    useUpdateUserMutation();
  const [values, setValues] = useState<
    Partial<CreateUserBody> & { id: string }
  >({
    id: params.id!,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updatePost(values).unwrap();
    navigate(-1);
  };

  const onChange = (e: ChangeType) => {
    setValues((prev) => ({ ...prev, ...{ [e.target.name]: e.target.value } }));
  };

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        email: user.email,
        avatar: user.avatar,
        status: user.status.toString(),
      }));
    }
  }, [user, params]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box w="50%" m="auto" mt="50">
      <Button size="xs" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Heading mb="5">Update User</Heading>
      <UserForm<Partial<CreateUserBody>>
        values={values}
        error={error}
        submitText="Update"
        isLoading={createIsLoading}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
    </Box>
  );
}

export default UserEdit;
