export type Post = {
  id: string;
  created_at: string;
  champion_id: string;
  response_of?: string;
  repost_of?: string;
  quote_of?: string;
  content: string;
  responses_count: { count: number }[];
  quotes_count: { count: number }[];
};

export type NewPost = Pick<Post, 'created_at' | 'champion_id' | 'content'>;

export type NewResponse = Pick<
  Post,
  'created_at' | 'champion_id' | 'content' | 'response_of'
>;

export type NewQuote = Pick<
  Post,
  'created_at' | 'champion_id' | 'content' | 'quote_of'
>;
