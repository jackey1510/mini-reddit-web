import { withUrqlClient } from "next-urql";
import { creatUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { PostLayout } from "../components/PostLayout";
import NextLink from "../components/NextLink";
import {
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UpvoteSection } from "../components/UpvoteSection";

const Index = () => {
  const [variable, setVariable] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: variable.limit, cursor: variable.cursor },
  });

  console.log(variable);

  return (
    <PostLayout variant="large">
      <Flex>
        <Heading>Mini Reddit</Heading>
        <NextLink ml="auto" href="/create-post" body="Create Post"></NextLink>
      </Flex>

      {fetching && !data ? (
        <Stack>
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
        </Stack>
      ) : data && data.posts ? (
        <Stack>
          {data.posts.posts.map((post) => {
            return (
              <Flex
                alignItems="stretch"
                key={post.id}
                p={5}
                shadow="md"
                borderWidth="1px"
              >
                <UpvoteSection post={post} />
                <Box flex="auto" justifyContent="center" alignItems="center">
                  <Flex>
                    <Heading fontSize="xl">{post.title}</Heading>
                    <Text ml="auto" fontSize="medium">
                      by {post.creator.username}
                    </Text>
                  </Flex>

                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      ) : (
            <Flex key={0}>No Posts</Flex>
          )}
      {data && data.posts ? (
        <Flex>
          {" "}
          <Button
            my={8}
            mx="auto"
            onClick={() => {
              setVariable({
                cursor: data.posts.hasNext
                  ? data.posts.posts[data.posts.posts.length - 1]?.createdAt
                  : null,
                limit: variable.limit,
              });
            }}
            isLoading={fetching}
          >
            More Posts
          </Button>{" "}
        </Flex>
      ) : null}
    </PostLayout>
  );
};

export default withUrqlClient(creatUrqlClient, { ssr: true })(Index);
