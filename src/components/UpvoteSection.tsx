import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { ShortPostFragment, useVoteMutation, VoteMutationVariables } from "../generated/graphql";

interface UpvoteSectionProps {
  post: ShortPostFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [{ fetching }, upvote] = useVoteMutation();
  const [{ fetching: downvoting }, downvote] = useVoteMutation()
  return (
    <Box pr={2}>
      <IconButton
        aria-label="upvote"
        icon={<ArrowUpIcon size="24px" />}
        onClick={() => {
          upvote({ value: 1, postId: post.id })
        }}
        isLoading={fetching}

      ></IconButton>
      <Text textAlign="center">{post.points}</Text>
      <IconButton
        aria-label="downvote"
        icon={<ArrowDownIcon size="24px" />}
        onClick={() => {
          downvote({ value: -1, postId: post.id })
        }}
        isLoading={downvoting}
      ></IconButton>
    </Box>
  );
};
