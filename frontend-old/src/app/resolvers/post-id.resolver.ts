import { ResolveFn, Router } from '@angular/router';

import { SupaService } from '../services/supa.service';
import { inject } from '@angular/core';

export const postIdResolver: ResolveFn<boolean> = async (route, state) => {
  const router = inject(Router);
  const supaService = inject(SupaService);
  const id = route.paramMap.get('id') as string;

  try {
    const result = await supaService.fetchSinglePost(id);
    if (id && result) {
      return true;
    } else {
      await router.navigate(['/404']);
      return false;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    await router.navigate(['/404']);
    return false;
  }
};
