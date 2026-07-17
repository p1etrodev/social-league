import { Injectable, inject } from '@angular/core';
import { NewPost, NewQuote, NewResponse, Post } from 'src/models/post.model';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  private supa: SupabaseClient;
  private postsTableName = 'posts_v2';
  private postColumns = `*,
        responses_count:posts_v2!response_of(count),
        quotes_count:posts_v2!quote_of(count)`;

  newPosts = 0;

  constructor() {
    this.supa = createClient(
      'https://icogdobvfvtlawbtcoes.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb2dkb2J2ZnZ0bGF3YnRjb2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NTA3NzQsImV4cCI6MjA0ODMyNjc3NH0.9oXo9UZZRWXhQdV-610fNyWgUIAr6-Yj6YmR_pCSZLI'
    );
    this.supa
      .channel('new_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: this.postsTableName },
        () => this.newPosts++
      )
      .subscribe();
  }

  async fetchPosts(championId?: string) {
    const query = this.supa
      .from('posts_v2')
      .select(this.postColumns, { count: 'exact' })
      .order('created_at', { ascending: true });
    if (championId) {
      query.eq('champion_id', championId);
    }
    const response: any = await query;
    const data = { posts: response.data as Post[], count: response.count || 0 };
    return data;
  }

  async fetchResponses(id: string, _for: 'champion' | 'post') {
    const query = this.supa
      .from(this.postsTableName)
      .select(this.postColumns, { count: 'exact' })
      .filter('response_of', 'not.is', null)
      .order('created_at', { ascending: true });
    switch (_for) {
      case 'champion':
        query.eq('champion_id', id);
        break;
      case 'post':
        query.eq('response_of', id);
        break;
    }
    const response: any = await query;
    const data = {
      responses: response.data as Post[],
      count: response.count || 0,
    };
    return data;
  }

  async fetchQuotes(id: string, _for: 'champion' | 'post') {
    const query = this.supa
      .from(this.postsTableName)
      .select(this.postColumns, { count: 'exact' })
      .filter('quote_of', 'not.is', null)
      .order('created_at', { ascending: true });
    switch (_for) {
      case 'champion':
        query.eq('champion_id', id);
        break;
      case 'post':
        query.eq('quote_of', id);
        break;
    }
    const response: any = await query;
    const data = {
      quotes: response.data as Post[],
      count: response.count || 0,
    };
    return data;
  }

  async fetchSinglePost(id: string) {
    return await this.supa
      .from(this.postsTableName)
      .select(this.postColumns)
      .eq('id', id)
      .maybeSingle()
      .then((response: any) => response.data as Post);
  }

  async addPost(newPost: NewPost) {
    return this.supa
      .from(this.postsTableName)
      .insert(newPost)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }

  async addResponse(newResponse: NewResponse) {
    return await this.supa
      .from(this.postsTableName)
      .insert(newResponse)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }

  async addQuote(newQuote: NewQuote) {
    return await this.supa
      .from(this.postsTableName)
      .insert(newQuote)
      .select(this.postColumns)
      .single()
      .then((response: any) => response.data as Post);
  }
}
