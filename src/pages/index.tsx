import { withUrqlClient } from "next-urql";
import { creatUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { PostLayout } from "../components/PostLayout";
import NextLink from "../components/NextLink";
import { Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {

  const [variable, setVariable] = useState({ limit: 10, cursor: null as null | string });
  const [{ data, fetching }] = usePostsQuery({ variables: { limit: variable.limit, cursor: variable.cursor } });

  console.log(variable)

  return (
    <PostLayout variant="large">
      <Flex>
        <Heading>Mini Reddit</Heading>
        <NextLink ml="auto" href="/create-post" body="Create Post"></NextLink>
      </Flex>

      {fetching && !data ? (
        <div>loading...</div>
      ) : (data && data.posts ?
        (<Stack>
          {data.posts.map((post) => {
            console.log(post)

            return (
              <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.text_snippet}</Text>
              </Box>
            )
          }
          )}
        </Stack>
        ) : (<Flex key={0}>No Posts</Flex>)

        )}
      {data && data.posts ? <Flex> <Button my={8} mx="auto" onClick={() => {
        console.log(data.posts)
        setVariable({ cursor: data.posts[data.posts.length - 1]?.created_at, limit: variable.limit })
      }}>More Posts</Button> </Flex> : null}
    </PostLayout>
  );
};

export default withUrqlClient(creatUrqlClient, { ssr: true })(Index);
