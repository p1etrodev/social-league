import { ChampionsService } from '../services/champions.service';
import { ResolveFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const championIdResolver: ResolveFn<boolean> = async (route, state) => {
  const router = inject(Router);
  const champsService = inject(ChampionsService);
  const id = route.paramMap.get('id') as string;

  try {
    const result = await champsService.fetchFullChampion(id);
    if (id && result) {
      return true;
    } else {
      await router.navigate(['/404']);
      return false;
    }
  } catch (error) {
    console.error('Error fetching champion:', error);
    await router.navigate(['/404']);
    return false;
  }
};
