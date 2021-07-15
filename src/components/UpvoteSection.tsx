import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { PostsQuery } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostsQuery["posts"][0];
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  return (
    <Box pr={2}>
      <IconButton
        aria-label="upvote"
        icon={<ArrowUpIcon size="24px" />}
      ></IconButton>
      <Text textAlign="center">{post.points}</Text>
      <IconButton
        aria-label="downvote"
        icon={<ArrowDownIcon size="24px" />}
      ></IconButton>
    </Box>
  );
};
