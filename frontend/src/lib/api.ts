import { apiClient } from "./axios";

export type Post = {
  id: string;
  createdAt: string;
  championId: string;
  content: string;
  responseOf: string | null;
  quoteOf: string | null;
  repostOf: string | null;
  responsesCount: number;
  quotesCount: number;
  repostsCount: number;
};

export type PostList = {
  posts: Post[];
  count: number;
};

export type ListParams = {
  limit?: number;
  offset?: number;
};

export type NewPostInput = {
  championId: string;
  content: string;
};

export type NewRepostInput = {
  championId: string;
};

export async function fetchPost(id: string): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/api/v1/posts/${id}`);
  return data;
}

export async function fetchPosts(params?: ListParams & { championId?: string }): Promise<PostList> {
  const { data } = await apiClient.get<PostList>("/api/v1/posts", { params });
  return data;
}

export async function fetchPostResponses(id: string, params?: ListParams): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/posts/${id}/responses`, { params });
  return data;
}

export async function fetchPostQuotes(id: string, params?: ListParams): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/posts/${id}/quotes`, { params });
  return data;
}

export async function fetchChampionPosts(
  championId: string,
  params?: ListParams,
): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/champions/${championId}/posts`, {
    params,
  });
  return data;
}

export async function fetchChampionResponses(
  championId: string,
  params?: ListParams,
): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/champions/${championId}/responses`, {
    params,
  });
  return data;
}

export async function fetchChampionQuotes(
  championId: string,
  params?: ListParams,
): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/champions/${championId}/quotes`, {
    params,
  });
  return data;
}

export async function fetchPostReposts(id: string, params?: ListParams): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/posts/${id}/reposts`, { params });
  return data;
}

export async function fetchChampionReposts(
  championId: string,
  params?: ListParams,
): Promise<PostList> {
  const { data } = await apiClient.get<PostList>(`/api/v1/champions/${championId}/reposts`, {
    params,
  });
  return data;
}

export async function createPost(input: NewPostInput): Promise<Post> {
  const { data } = await apiClient.post<Post>("/api/v1/posts", input);
  return data;
}

export async function createResponse(postId: string, input: NewPostInput): Promise<Post> {
  const { data } = await apiClient.post<Post>(`/api/v1/posts/${postId}/responses`, input);
  return data;
}

export async function createQuote(postId: string, input: NewPostInput): Promise<Post> {
  const { data } = await apiClient.post<Post>(`/api/v1/posts/${postId}/quotes`, input);
  return data;
}

export async function createRepost(postId: string, input: NewRepostInput): Promise<Post> {
  const { data } = await apiClient.post<Post>(`/api/v1/posts/${postId}/reposts`, input);
  return data;
}
