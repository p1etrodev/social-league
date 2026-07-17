import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { Champion, PartialChampion } from 'src/models/champion.model';
import { Injectable, inject } from '@angular/core';

import { CacheService } from './cache.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChampionsService {
  private httpClient = inject(HttpClient);
  private cacheService = inject(CacheService);

  search = '';
  champions = new Array<PartialChampion>();
  selectedChampion!: PartialChampion;

  private readySubject = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean> = this.readySubject.asObservable();
  version!: string;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.fetchVersion()
      .then(() =>
        this.fetchChampions().then((champions) => {
          this.champions = champions;
          const cachedCurrentChampion = this.cacheService.get([
            'champions',
            'current',
          ]);
          if (cachedCurrentChampion) {
            this.selectedChampion = cachedCurrentChampion;
          } else {
            this.setSelectedChampion(this.champions[0]);
          }
        })
      )
      .then(() => this.readySubject.next(true));
  }

  private async fetchVersion() {
    const url = 'https://ddragon.leagueoflegends.com/realms/las.json';
    const response: any = await firstValueFrom(this.httpClient.get(url));
    const newVersion = response.dd as string;

    const cacheKeys = ['version'];
    const cachedVersion = this.cacheService.get(cacheKeys);
    if (newVersion !== cachedVersion) {
      console.info('New DataDragon version found. Clearing cache...');
      this.cacheService.clear();
      this.cacheService.set(cacheKeys, newVersion);
      this.version = newVersion;
    } else if (cachedVersion) {
      this.version = cachedVersion;
      return;
    }
  }
  private async fetchChampions() {
    const cacheKeys = ['champions', 'partials'];
    const cachedChampions = this.cacheService.get(cacheKeys);
    if (cachedChampions) return cachedChampions as Champion[];
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/es_AR/champion.json`;
    const response = this.httpClient.get(url).pipe(
      map((res: any) => {
        const champions = Object.values(res.data).map((champInfo) =>
          this.parseChampionInfo(champInfo)
        );
        this.cacheService.set(cacheKeys, champions);
        return champions as Champion[];
      })
    );
    return await firstValueFrom(response);
  }

  async fetchFullChampion(championId: string) {
    const cacheKeys = ['champions', 'full', championId];
    const cachedChampion = this.cacheService.get(cacheKeys);
    if (cachedChampion) return cachedChampion as Champion;
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/es_AR/champion/${championId}.json`;
    const { data }: any = await firstValueFrom(this.httpClient.get(url));
    const champInfo = this.parseChampionInfo(data[championId]);
    this.cacheService.set(cacheKeys, champInfo);
    return champInfo;
  }

  private parseChampionInfo(champInfo: any) {
    return {
      ...champInfo,
      skins: champInfo.skins?.slice(1).map((e: any): number => e.num),
    } as Champion;
  }

  setSelectedChampion(champion: PartialChampion): void {
    this.selectedChampion = champion;
    this.cacheService.set(['champions', 'current'], champion);
  }

  getIcon(championId: string) {
    const cacheKeys = ['assets', championId, 'icon'];
    const cachedUrl = this.cacheService.get(cacheKeys);
    if (cachedUrl) return cachedUrl as string;
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${championId}.png`;
    this.cacheService.set(cacheKeys, url);
    return url;
  }

  getLoading(championId: string) {
    const cacheKeys = ['assets', championId, 'loading'];
    const cachedUrl = this.cacheService.get(cacheKeys);
    if (cachedUrl) return cachedUrl as string;
    const url = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`;
    this.cacheService.set(cacheKeys, url);
    return url;
  }

  getSplash(championId: string, skinNumber: number = 0) {
    const cacheKeys = ['assets', championId, 'splashes', skinNumber.toString()];
    const cachedUrl = this.cacheService.get(cacheKeys);
    if (cachedUrl) return cachedUrl as string;
    const url = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNumber}.jpg`;
    this.cacheService.set(cacheKeys, url);
    return url;
  }

  getSpell(
    championId: string,
    type: 'spell' | 'passive' = 'spell',
    skill: string
  ) {
    const cacheKeys = ['assets', championId, 'skillIcons', skill];
    const cachedUrl = this.cacheService.get(cacheKeys);
    if (cachedUrl) return cachedUrl as string;
    const url = `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/${type}/${skill}`;
    this.cacheService.set(cacheKeys, url);
    return url;
  }

  get filteredChampions() {
    const rawSearch = this.search.replace(/\s/, '\\s');
    const pattern = new RegExp(`(${rawSearch})`, 'i');
    return this.champions.filter((e) => pattern.test(e.name));
  }

  get championClasses() {
    const cacheKeys = ['champions', 'classes'];
    const cachedClasses = this.cacheService.get(cacheKeys);
    if (cachedClasses) return cachedClasses as string[];
    const classes = this.champions.flatMap((e) => e.tags);
    const uniqueClassesSet = new Set(classes);
    const uniqueClasses = Array.from(uniqueClassesSet) as string[];
    this.cacheService.set(cacheKeys, uniqueClasses);
    return uniqueClasses;
  }
}
