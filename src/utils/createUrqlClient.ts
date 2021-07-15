import { VoteMutationVariables } from "./../generated/graphql";
import { stringifyVariables } from "@urql/core";
import Router from "next/router";
import { dedupExchange, fetchExchange, Exchange } from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import { gql } from "@urql/core";

const cursorPagination = (): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    let hasNext = true;

    const results: string[] = [];

    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolveFieldByKey(
        entityKey,
        fieldInfo.fieldKey
      ) as string;
      const data = cache.resolve(key, "posts") as string[];
      const hasMore = !cache.resolve(key, "hasMore");
      if (!hasMore) {
        hasNext = hasMore as boolean;
      }
      results.push(...data);
    });

    const obj = {
      __typename: "PaginatedPosts",
      hasNext,
      posts: results,
    };

    return obj;
  };
};

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

export const creatUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          vote: (_result, args, cache, _info) => {
            const { postId, value } = args as VoteMutationVariables;
            const data: {
              id: number;
              points?: number;
            } | null = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                }
              `,
              { id: postId }
            );
            if (data) {
              const newPoints = data.points! + value;
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    text
                  }
                `,
                { id: postId, points: newPoints }
              );
            }
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) return query;
                return { me: result.login.user };
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) return query;
                return { me: result.register.user };
              }
            );
          },
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return { me: null };
              }
            );
          },
          createPost: (_result, _args, cache, _info) => {
            const allFields = cache.inspectFields("Query");
            const fieldInfos = allFields.filter((f) => f.fieldName === "posts");
            fieldInfos.forEach((fieldInfo) =>
              cache.invalidate("Query", "posts", fieldInfo.arguments || {})
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include" as const,
  },
});
