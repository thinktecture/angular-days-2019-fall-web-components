import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public ratings: Array<Rating>;

  ngOnInit(): void {
    this.ratings = new Array<Rating>();
    for (let i = 0; i < 10; i++) {
      const currentRating = new Rating();
      currentRating.maxRating = Math.floor(Math.random() * 15) + 5;
      currentRating.rating = Math.floor(Math.random() * currentRating.maxRating) + 1;
      this.ratings.push(currentRating);
    }
  }

  onRatingChanged(rating: CustomEvent) {
      console.log(rating.detail);
  }
}

export class Rating {
  public rating: number;
  public maxRating: number;
}
