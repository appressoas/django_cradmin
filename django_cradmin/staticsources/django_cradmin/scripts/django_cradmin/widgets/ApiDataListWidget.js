import HttpDjangoJsonRequest from 'ievv_jsbase/http/HttpDjangoJsonRequest';
import AbstractDataListWidget from "./AbstractDataListWidget";


export default class ApiDataListWidget extends AbstractDataListWidget {

  getDefaultConfig() {
    const defaultConfig = super.getDefaultConfig();
    defaultConfig.extraApiData = {};
    return defaultConfig;
  }

  get name() {
    return 'django_cradmin.widgets.ApiDataListWidget';
  }

  constructor(element, widgetInstanceId) {
    super(element, widgetInstanceId);
    if(!this.config.apiUrl) {
      throw new Error('apiUrl is a required config.');
    }
  }

  requestItemData(key) {
    return new Promise((resolve, reject) => {
      let url = this.config.apiUrl;
      if(!this.config.apiUrl.endsWith('/')) {
        url = `${url}/`;
      }
      url = `${url}${key}`;
      const request = new HttpDjangoJsonRequest(url);
      request.get()
        .then((response) => {
          resolve(response.bodydata);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  requestDataList(options) {
    return new Promise((resolve, reject) => {
      options = this.makeRequestDataListOptions(options);
      const request = new HttpDjangoJsonRequest(this.config.apiUrl);
      for (let attribute of Object.keys(this.config.extraApiData)) {
        request.urlParser.queryString.set(
          attribute, this.config.extraApiData[attribute]);
      }
      request.urlParser.queryString.set('search', options.searchString);
      request.get()
        .then((response) => {
          resolve(response.bodydata);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
