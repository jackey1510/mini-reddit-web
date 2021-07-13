import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";

import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import NextLink from "next/link";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { creatUrqlClient } from "../utils/createUrqlClient";

interface createPostProps {}

const createPost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          await createPost({ input: values });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="title"
            ></InputField>
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="type your post here"
                label="body"
              ></InputField>
            </Box>
            <Flex>
              <NextLink href="/forgot-password">
                <Link mt={4} ml={"auto"}>
                  Forget Password?
                </Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(creatUrqlClient)(createPost);
