import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiShow, BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDeleteUserMutation, useUsersQuery } from "../../app/services/posts";
import { formatDate } from "../../utils";

function UserHome() {
  const [page, setPage] = useState(1);
  const { data: users, isLoading, isFetching } = useUsersQuery(page);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    await deleteUser(id).unwrap();
  };

  return (
    <Box maxW="container.lg" m="auto" mt="10">
      <Button as={Link} to={"/users/new"}>
        Add User
      </Button>

      <Table variant="unstyled">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users?.data.map(
            ({ id, firstName, lastName, created_at, status }, index) => (
              <Tr key={id}>
                <Td>{index + 1}</Td>
                <Td>{firstName}</Td>
                <Td>{lastName}</Td>
                <Td>
                  <Badge colorScheme={status === 1 ? "green" : "red"}>
                    {status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>{formatDate(created_at)}</Td>
                <Td>
                  <HStack>
                    <Button as={Link} to={`/users/${id}`} size="xs">
                      <Icon as={BiShow} />
                    </Button>
                    <Button as={Link} to={`/users/${id}/edit`} size="xs">
                      <Icon as={BiEdit} />
                    </Button>
                    <Button size="xs" onClick={() => handleDelete(id)}>
                      <Icon as={MdDeleteOutline} />
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
      <Box my="10">
        <Button
          isLoading={isLoading}
          onClick={() => setPage(page + 1)}
          disabled={page >= users?.total_pages!}
        >
          Load More
        </Button>
      </Box>
    </Box>
  );
}

export default UserHome;
