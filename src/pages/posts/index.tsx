import {
  Box,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiShow, BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  usePostsQuery,
  useDeletePostMutation,
  Post,
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

function PostHome() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: posts, isLoading, isFetching } = usePostsQuery(page);
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (id: string) => {
    await deletePost(id).unwrap();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box maxW="container.lg" m="auto" pt="10">
      <Button as={Link} to={"/posts/new"}>
        Add Post
      </Button>

      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts?.data.map(({ id, title, created_at, status }, index) => (
            <Tr key={id}>
              <Td>{index + 1}</Td>
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
      <Box my="10">
        <Button
          isLoading={isLoading}
          onClick={() => setPage(page + 1)}
          disabled={page >= posts?.total_pages!}
        >
          Load More
        </Button>
      </Box>
    </Box>
  );
}

export default PostHome;
