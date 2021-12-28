import { FormEvent, useEffect, useState } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import PostForm, { ChangeType } from "../../components/PostForm";
import {
  UpdatePostBody,
  usePostQuery,
  useUpdatePostMutation,
} from "../../app/services/posts";
import Loading from "../../components/Loading";

function PostEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { data: post, isLoading } = usePostQuery(params.id!);
  const [updatePost, { isLoading: createIsLoading, error }] =
    useUpdatePostMutation();
  const [values, setValues] = useState<UpdatePostBody>({ id: params.id! });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updatePost(values).unwrap();
    navigate("/");
  };

  const onChange = (e: ChangeType) => {
    setValues((prev) => ({ ...prev, ...{ [e.target.name]: e.target.value } }));
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      title: post?.title,
      author: post?.author,
      content: post?.content,
      status: post?.status,
    }));
  }, [post, params]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box w="50%" m="auto" mt="50">
      <Button size="xs" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Heading mb="5">Update Post</Heading>
      <PostForm<UpdatePostBody>
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

export default PostEdit;
