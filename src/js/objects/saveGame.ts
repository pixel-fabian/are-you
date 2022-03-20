export default class SaveGame {
  private oCollection = {
    books: false,
    clover: false,
    ghost: false,
    heart: false,
    hole: false,
    oldone: false,
    photo_d: false,
    player_1: false,
    player_2: false,
    player_3: false,
    portal: false,
    unknown: true,
  };

  constructor() {
    this.load();
  }

  addItem(item) {
    console.log('item', item);

    if (item in this.oCollection) {
      this.oCollection[item] = true;
      this.save();
      console.log(this);
    }
  }

  getItems() {
    return this.oCollection;
  }

  save() {
    localStorage.setItem('collection', JSON.stringify(this.oCollection));
  }

  load() {
    if (JSON.parse(localStorage.getItem('collection'))) {
      this.oCollection = JSON.parse(localStorage.getItem('collection'));
    }
  }
}
