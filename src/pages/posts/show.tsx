import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Post,
  useDeletePostMutation,
  usePostQuery,
} from "../../app/services/posts";
import Loading from "../../components/Loading";
import { formatDate } from "../../utils";

const getColorForStatus = (status: Post["status"]) => {
  return status === "draft"
    ? "gray"
    : status === "pending_review"
    ? "orange"
    : "green";
};

function PostShow() {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePostQuery(params.id!);
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async () => {
    if (!confirm("Want to delete this post?")) {
      return false;
    }
    await deletePost(params.id!).unwrap();
    navigate("/posts");
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
    <Box w="50%" m="auto" mt="50">
      <Button size="xs" onClick={() => navigate("/")}>
        Back
      </Button>
      <Heading>{data?.title}</Heading>
      <HStack pt="1">
        <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
          By {data?.author} at {formatDate(data?.created_at!)}
        </Text>
        <Badge colorScheme={getColorForStatus(data?.status!)}>
          {data?.status}
        </Badge>
      </HStack>

      <Text mt="5">{data?.content}</Text>
      <HStack mt="5">
        <Button as={Link} size="xs" to={`/posts/${params.id}/edit`}>
          Edit
        </Button>
        <Button colorScheme="red" size="xs" onClick={handleDelete}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
}

export default PostShow;
