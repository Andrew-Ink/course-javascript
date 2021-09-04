/*global ymaps*/

export default class InteractiveMap {
  constructor(idMap, onClick, onClickcluster) {
    this.idMap = idMap;
    this.onClick = onClick;
    this.onClickcluster = onClickcluster;
  }

  async init() {
    await this.scriptAdding();
    await this.ymapsLoad();
    this.ymapsInit();
  }

  scriptAdding() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src =
        'https://api-maps.yandex.ru/2.1/?apikey=5a4c2cfe-31f1-4007-af4e-11db22b6954b&lang=ru_RU';
      document.body.append(script);
      script.addEventListener('load', resolve);
    });
  }

  ymapsLoad() {
    return new Promise((resolve) => {
      ymaps.ready(resolve);
    });
  }

  ymapsInit() {
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
      // clusterBalloonContentLayout: 'cluster#balloonCarousel',
      // clusterBalloonPagerVisible: true,
    });
    this.clusterer.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
      // this.onClickcluster(coords);
    });
    this.map = new ymaps.Map(this.idMap, {
      center: [51.65, 39.22],
      zoom: 12,
    });
    this.map.events.add('click', (e) => this.onClick(e.get('coords')));
    this.map.geoObjects.add(this.clusterer);
  }

  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }

  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }

  closeBalloon() {
    this.map.balloon.close();
  }

  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e) => {
      e.stopPropagation();
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    });
    this.clusterer.add(placemark);
  }

  async getAddress(coords) {
    const geocode = await new ymaps.geocode(coords);
    const address = geocode.geoObjects.get(0).getAddressLine();
    return address;
  }
}
