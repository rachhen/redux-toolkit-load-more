import {
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MdArrowBack, MdArrowForward, MdDeleteOutline } from "react-icons/md";
import { BiShow, BiEdit } from "react-icons/bi";
import {
  Post,
  useDeletePostMutation,
  usePostsQuery,
} from "../app/services/posts";
import { formatDate } from "../utils";

const getColorForStatus = (status: Post["status"]) => {
  return status === "draft"
    ? "gray"
    : status === "pending_review"
    ? "orange"
    : "green";
};

function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = +(searchParams.get("page") || 1);
  const { data: posts, isLoading, isFetching } = usePostsQuery(page);
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (id: string) => {
    await deletePost(id).unwrap();
  };

  if (isLoading) {
    return (
      <Center w="full" h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Box w="80%" m="auto" pt="50">
      <HStack>
        <Button as={Link} to={"/posts/new"}>
          Add Post
        </Button>
        <Button as={Link} to={"/posts"}>
          Posts
        </Button>
      </HStack>

      <Table>
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts?.data.map(({ id, title, created_at, status }) => (
            <Tr key={id}>
              <Td>{title}</Td>
              <Td>
                <Badge
                  ml="1"
                  fontSize="0.8em"
                  colorScheme={getColorForStatus(status)}
                >
                  {status}
                </Badge>
              </Td>
              <Td>{formatDate(created_at!)}</Td>
              <Td>
                <HStack>
                  <Button as={Link} to={`/posts/${id}`} size="xs">
                    <Icon as={BiShow} />
                  </Button>
                  <Button as={Link} to={`/posts/${id}/edit`} size="xs">
                    <Icon as={BiEdit} />
                  </Button>
                  <Button size="xs" onClick={() => handleDelete(id)}>
                    <Icon as={MdDeleteOutline} />
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <HStack mt="30">
        <Button
          onClick={() => navigate(`?page=${page - 1}`)}
          isLoading={isFetching}
          disabled={page === 1}
        >
          <Icon as={MdArrowBack} />
        </Button>
        <Button
          onClick={() => navigate(`?page=${page + 1}`)}
          isLoading={isFetching}
          disabled={page >= posts?.total_pages!}
        >
          <Icon as={MdArrowForward} />
        </Button>
        <Box>{`${page} / ${posts?.total_pages}`}</Box>
      </HStack>
    </Box>
  );
}

export default Home;
