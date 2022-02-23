import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "id": "1",
    "nr": "11",
    "soll": "10",
    "now": "5",
    "miss": "5",
    "defekt": "1",
    "todo": "2",
    "check": "",
    "okay": "1",
    "aufgabe": "Sattel Säubern, Farbe drauf",
    "soll_zeit": "11.12.17 12:03"  
  };

// stationen
  constructor() {
    let items = [
      {
        "id": "3",
        "nr": "11",
        "soll": "10",
        "now": "5",
        "miss": "5",
        "defekt": "1",
        "todo": "2",
        "check": "",
        "okay": "1",
        "aufgabe": "Sattel Säubern, Farbe drauf",
        "soll_zeit": "11.12.17 12:03"
      },
      {
        "id": "2",
        "nr": "12",
        "soll": "15",
        "now": "5",
        "miss": "10",
        "defekt": "1",
        "todo": "",
        "check": "2",
        "okay": "1",
        "aufgabe": "Lenker Säubern, Farbe drauf",
        "soll_zeit": "12.12.17 12:03"
      },
      {
        "id": "1",
        "nr": "13",
        "soll": "5",
        "now": "2",
        "miss": "3",
        "defekt": "1",
        "todo": "1",
        "check": "2",
        "okay": "1",
        "aufgabe": "Sattel Säubern, Farbe drauf",
        "soll_zeit": "13.12.17 12:03"
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

 /* defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };


  constructor() {
    let items = [
      {
        "name": "Burt Bear",
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "Burt is a Bear."
      },
      {
        "name": "Charlie Cheetah",
        "profilePic": "assets/img/speakers/cheetah.jpg",
        "about": "Charlie is a Cheetah."
      },
      {
        "name": "Donald Duck",
        "profilePic": "assets/img/speakers/duck.jpg",
        "about": "Donald is a Duck."
      },
      {
        "name": "Eva Eagle",
        "profilePic": "assets/img/speakers/eagle.jpg",
        "about": "Eva is an Eagle."
      },
      {
        "name": "Ellie Elephant",
        "profilePic": "assets/img/speakers/elephant.jpg",
        "about": "Ellie is an Elephant."
      },
      {
        "name": "Molly Mouse",
        "profilePic": "assets/img/speakers/mouse.jpg",
        "about": "Molly is a Mouse."
      },
      {
        "name": "Paul Puppy",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "about": "Paul is a Puppy."
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }
*/
  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
