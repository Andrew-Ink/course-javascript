import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap(
      'map',
      this.onClick.bind(this),
      this.onClickcluster.bind(this)
    );
    this.map.init().then(this.onInit.bind(this));
  }

  onInit() {
    const coords = this.callApi('coords');
    for (const item of coords) {
      this.map.createPlacemark(item);
    }
    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }

  callApi(method, body) {
    const storage = localStorage;
    const data = storage.data ? JSON.parse(storage.data) : [];

    if (method === 'add') {
      data.push(body);
      storage.data = JSON.stringify(data);
    }

    if (method === 'coords') {
      const coords = [];
      for (let i = 0; i < data.length; i++) {
        coords.push(data[i].coords);
      }
      return coords;
    }

    if (method === 'list') {
      const res = [];
      for (const obj of data) {
        if (obj.coords[0] === body[0] && obj.coords[1] === body[1]) {
          res.push(obj.review);
        }
      }
      return res;
    }
  }

  createForm(coords, reviews, address) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewAddres = root.querySelector('.review-addres');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);
    reviewAddres.innerText = address;

    const review = this.createReviews(reviews);

    reviewList.append(review);
    return root;
  }

  createReviews(reviews) {
    const review = document.createElement('div');
    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `
      <div>
        <b>${item.name}</b> ${item.place} ${item.data}
      </div>
      <div>${item.text}</div>
      `;
      review.append(div);
    }
    return review;
  }

  async onClick(coords) {
    try {
      this.map.openBalloon(coords, 'Загрузка...');
      const address = await this.map.getAddress(coords);
      const list = this.callApi('list', coords);

      const form = this.createForm(coords, list, address);

      this.map.setBalloonContent(form.innerHTML);
      this.map.openBalloon(coords, form.innerHTML);
    } catch (e) {
      const formError = document.querySelector('.form-error');
      formError.innerText = e.message;
    }
  }

  onClickcluster(coords) {
    const reviews = coords.map((coord) => {
      const list = this.callApi('list', coord);
      return list;
    });
    const review = this.createReviews(reviews);
    this.map.setBalloonContent(review.innerHTML);
    this.map.openBalloon(coords, review.innerHTML);
    console.log(review.innerHTML);
  }

  onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const currentData = this.getDate();
      const data = {
        coords,
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value,
          data: currentData,
        },
      };

      try {
        this.callApi('add', data);
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (e) {
        const formError = document.querySelector('.form-error');
        formError.innerText = e.message;
      }
    }
  }

  getDate() {
    const date = new Date();
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const yaer = date.getFullYear();
    return `${day}.${month}.${yaer}`;
  }
}
