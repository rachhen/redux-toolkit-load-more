import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteUserMutation, useUserQuery } from "../../app/services/posts";
import Loading from "../../components/Loading";

function UserShow() {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUserQuery(params.id!);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!confirm("Want to delete this user?")) {
      return false;
    }
    await deleteUser(params.id!).unwrap();
    navigate("/users");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error && "status" in error && error.status === 400) {
    return (
      <Center w="full" h="100vh">
        {(error.data as any).message}
      </Center>
    );
  }

  return (
    <Box maxW="container.lg" m="auto" mt="10">
      <Box mb="5">
        <Button size="xs" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <VStack align="stretch">
        <HStack>
          <Text fontWeight="bold">ID: </Text>
          <Text>{data?.id}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">First Name: </Text>
          <Text>{data?.firstName}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Last Name: </Text>
          <Text>{data?.lastName}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Username: </Text>
          <Text>{data?.username}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Email: </Text>
          <Text>{data?.email}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="bold">Status: </Text>
          <Badge colorScheme={data?.status === 1 ? "green" : "red"}>
            {data?.status === 1 ? "Active" : "Inactive"}
          </Badge>
        </HStack>
      </VStack>
      <HStack mt="5">
        <Button as={Link} size="xs" to={`/users/${params.id}/edit`}>
          Edit
        </Button>
        <Button colorScheme="red" size="xs" onClick={handleDelete}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
}

export default UserShow;
