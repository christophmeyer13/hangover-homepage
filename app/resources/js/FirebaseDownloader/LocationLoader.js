/* eslint-env browser */

import { locationConverter } from "./Location.js";
import { Event, Observable } from "../utils/Observable.js";
import { database } from "./Database.js";

class LocationLoader extends Observable {
  constructor() {
    super();
    this.locations = [];
  }

  async downloadLocations() {
    let locations = [];
    await database
      .collection("Locations")
      .withConverter(locationConverter)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let currLocation = doc.data();
          currLocation.addId(doc.id);
          locations.push(currLocation);
        });
      });
    // let downloadEvent = new Event("locationDL", { locations: locations });
    // this.notifyAll(downloadEvent);
    return locations;
  }

  async getRatings(locationID) {
    let ratings = [];
    await database
      .collection("Locations")
      .doc(locationID)
      .collection("Rating")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let currRating = {
            stars: parseFloat(doc.data().ratingStars),
            text: doc.data().ratingText,
            date: doc.data().ratingDate,
            name: doc.data().userName,
            img: doc.data().userImg,
            liked: doc.data().liked,
            disliked: doc.data().disliked,
            id: doc.id,
          };
          ratings.push(currRating);
        });
      });
    // let downloadEvent = new Event("locationDL", { locations: locations });
    // this.notifyAll(downloadEvent);
    return ratings;
  }

  async getLocations() {
    this.locations = await this.downloadLocations();
    for (let i = 0; i < this.locations.length; i++) {
      this.locations[i].addRatings(await this.getRatings(this.locations[i].id));
    }
    return this.locations;
  }

  pushReview(id, stars, text, date) {
    let userName = JSON.parse(localStorage.getItem("user")).name,
      img = JSON.parse(localStorage.getItem("user")).img;
    database
      .collection(`Locations/${id}/Rating`)
      .doc()
      .set({
        ratingDate: date,
        ratingStars: stars,
        ratingText: text,
        userName: userName,
        userImg: img,
        liked: 0,
        disliked: 0,
      })
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushReviewLike(locationID, reviewID, likes) {
    database
      .collection(`Locations/${locationID}/Rating`)
      .doc(reviewID)
      .set(
        {
          liked: likes + 1,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushReviewDislike(locationID, reviewID, dislikes) {
    database
      .collection(`Locations/${locationID}/Rating`)
      .doc(reviewID)
      .set(
        {
          disliked: dislikes + 1,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushViews(id, views) {
    database
      .collection(`Locations`)
      .doc(id)
      .set(
        {
          watched: views + 1,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushSaved(id, flag, saved) {
    let newVal = saved;
    if (flag) {
      newVal += 1;
    } else {
      newVal -= 1;
    }
    database
      .collection(`Locations`)
      .doc(id)
      .set(
        {
          saved: newVal,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushPicture(id, url, text) {
    console.log(url);
    database
      .collection(`Locations/${id}/Pics`)
      .doc()
      .set({
        url: url,
        text: text,
        liked: 0,
        disliked: 0,
      })
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushLike(locationID, pictureID, likes) {
    database
      .collection(`Locations/${locationID}/Pics`)
      .doc(pictureID)
      .set(
        {
          liked: likes + 1,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  pushDislike(locationID, pictureID, dislikes) {
    database
      .collection(`Locations/${locationID}/Pics`)
      .doc(pictureID)
      .set(
        {
          disliked: dislikes + 1,
        },
        { merge: true }
      )
      .then(function () {
        console.log("Doc written...");
      });
  }

  async getPictures(locationID) {
    let pictures = [];
    await database
      .collection("Locations")
      .doc(locationID)
      .collection("Pics")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let currPicture = {
            url: doc.data().url,
            text: doc.data().text,
            liked: doc.data().liked,
            disliked: doc.data().disliked,
            id: doc.id,
          };
          pictures.push(currPicture);
        });
      });
    return pictures;
  }
}

export default new LocationLoader();
