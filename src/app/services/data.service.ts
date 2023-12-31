import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { Observable, Subject, map } from 'rxjs';
import { UtilityService } from './utility.service';
import { ApiResponse, Game, GameDetails, Publisher } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  rawGamesData!: Array<Game>;
  // gamesData!: Array<Game>;
  dataChanged: Subject<Game[]> = new Subject<Game[]>();

  constructor(
    private networkService: NetworkService,
    private utility: UtilityService
  ) {
    this.networkService
      .fetchData('metacrit')
      .subscribe((response: ApiResponse<Game>) => {
        this.rawGamesData = [...response.results];
        // this.gamesData = [...this.rawGamesData];
        // console.log(this.gamesData);
        // console.log(this.rawGamesData);
        this.dataChanged.next([...response.results]);
      });

    // this.networkService.getPlatformData(6).subscribe((response) => {
    //   console.log('Platform Data:');
    //   console.log(response);
    // });
  }

  filterData(sorting: string, search?: string) {
    this.networkService
      .fetchData(sorting, search)
      .subscribe((response: ApiResponse<Game>) => {
        this.rawGamesData = [...response.results];
        this.dataChanged.next(response.results);
      });
  }

  // changeGamesData(value: string) {
  //   this.gamesData = this.rawGamesData.filter((game) =>
  //     game.name.includes(value)
  //   );
  //   this.dataChanged.next([...this.gamesData]);
  // }

  // filterData(criteria: string) {
  //   let aux = [...this.rawGamesData];

  //   if (criteria === 'Name') {
  //     this.gamesData = this.utility.sortByName(aux);
  //   } else if (criteria === 'Released') {
  //     this.gamesData = this.utility.sortByReleaseData(aux);
  //   } else if (criteria === 'Added') {
  //     this.gamesData = this.utility.sortByAdded(aux);
  //   } else if (criteria === 'Updated') {
  //     this.gamesData = this.utility.sortByUpdateDate(aux);
  //   } else if (criteria === 'Rating') {
  //     this.gamesData = this.utility.sortByRating(aux);
  //   } else if (criteria === '') {
  //     this.gamesData = [...this.rawGamesData];
  //   }

  //   console.log(this.gamesData);

  //   this.dataChanged.next([...this.gamesData]);
  // }

  getGameById(id: number) {
    let gameData1 = this.rawGamesData.find((game) => game.id == id);

    return this.networkService.getPlatformData(id).pipe(
      map(
        (response: {
          description_raw: string;
          publishers: Publisher[];
          website: string;
        }) => {
          return {
            ...gameData1,
            description_raw: response.description_raw,
            publishers: response.publishers,
            website: response.website,
          };
        }
      )
    );

    // return { g1: gameData1, obs: this.networkService.getPlatformData(id) };
  }
}
