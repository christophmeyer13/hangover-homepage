/* eslint-env browser */

import View from "../View.js";

class LocationDetailReviews extends View {
  constructor() {
    super();
    this.location = JSON.parse(localStorage.getItem("locationDetail"));
  }

  setAverage() {
    this.element.querySelector(".average").innerHTML =
      this.location.average.toFixed(2) + "<small>/ 5</small>";
    let stars = this.element
      .querySelector(".rating-avg")
      .getElementsByTagName("button");
    for (let i = 0; i < stars.length; i++) {
      if (this.location.average >= i + 1) {
        stars[i].classList.add("btn-warning");
        stars[i].classList.remove("btn-grey");
        stars[i].classList.remove("btn-default");
      }
    }
  }

  setOverview() {
    let progressBars = this.element
        .querySelector(".rating-overview")
        .getElementsByClassName("progress-bar"),
      numbersCount = this.element
        .querySelector(".rating-overview")
        .getElementsByClassName("pull-right");
    for (let i = 5; i > 0; i--) {
      let reviewCount = this.location.rating.length,
        proportion = 0;
      for (let j = 0; j < this.location.rating.length; j++) {
        if (parseInt(this.location.rating[j].stars) === i) {
          proportion++;
        }
      }
      numbersCount[(i - 5) * -1].textContent = proportion;
      proportion = (proportion / reviewCount) * 100;
      progressBars[(i - 5) * -1].style.width = proportion + "%";
    }
  }

  showReviews() {
    let ratings = this.location.rating;

    ratings.sort(function (a, b) {
      let day = parseInt(a.date.split(".")[0]),
        month = parseInt(a.date.split(".")[1]),
        year = parseInt(a.date.split(".")[2]),
        aDate = new Date(year, month - 1, day, 0, 0, 0, 0),
        day1 = parseInt(b.date.split(".")[0]),
        month1 = parseInt(b.date.split(".")[1]),
        year1 = parseInt(b.date.split(".")[2]),
        bDate = new Date(year1, month1 - 1, day1, 0, 0, 0, 0);
      console.log(aDate, bDate, bDate - aDate, year, year1);
      return bDate - aDate;
    });

    for (let i = 0; i < ratings.length; i++) {
      let template = document.querySelector(".rating-template").innerHTML,
        item = document.createElement("div");
      item.innerHTML = template;
      item.querySelector(".img-rounded").src = ratings[i].img;
      item.querySelector(".review-block-name").textContent = ratings[i].name;
      item.querySelector(".review-block-date").textContent = ratings[i].date;
      let stars = item.getElementsByTagName("button");
      for (let j = 0; j < stars.length; j++) {
        if (ratings[i].stars >= j + 1) {
          stars[j].classList.add("btn-warning");
          stars[j].classList.remove("btn-grey");
          stars[j].classList.remove("btn-default");
        }
      }
      item.querySelector(".review-block-description").textContent =
        ratings[i].text;

      item = item.firstElementChild;
      this.element.querySelector(".user-reviews").appendChild(item);
      this.element
        .querySelector(".user-reviews")
        .appendChild(document.createElement("hr"));
    }
  }

  resetReviews() {
    this.element.querySelector(".user-reviews").innerHTML = "";
  }
}

export default LocationDetailReviews;
