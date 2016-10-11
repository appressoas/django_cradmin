export class CradminTabController {
  activeMap = {};
  tabMap = {};

  constructor(private tabsAttribute:string="cradmin_tabs",
              private panelActiveCssClass:string="tabs__panel--active",
              private panelAttribute:string="cradmin_tabs_panel",
              private tabActiveCssClass:string="tabs__tab--active",
              private tabAttribute:string="cradmin_tabs_tab") {
    this.buildTabMap();
  }

  buildTab(tabElement:Element) {
    let panelElements: Element[] = Array.from(tabElement.querySelectorAll(`[${this.panelAttribute}]`));
    let tabElements: Element[] = Array.from(tabElement.querySelectorAll(`[${this.tabAttribute}]`));
    let tabgroup:any = {
      panelElements: panelElements,
      tabElements: tabElements,
    };

    for (let panelElement of panelElements) {
      let isActive:boolean = panelElement.classList.contains(this.panelActiveCssClass);
      if(panelElement.attributes.hasOwnProperty('id')) {
        let domId:string = panelElement.attributes.getNamedItem('id').nodeValue;
        // console.log('domId:', domId);
        // console.log('isActive:', isActive);
        this.tabMap[domId] = tabgroup;
        if(isActive) {
          tabgroup.activePanelElement = panelElement;
        }
      } else {
        console.warn(
          `Found ${this.panelAttribute} on an element without an ` +
          `ID. Aborting setup for then entire cradmin_tabs. Element:`, panelElement);
      }
    }

    for (let tabElement of tabElements) {
      let isActive:boolean = tabElement.classList.contains(this.tabActiveCssClass);
      if(isActive) {
        tabgroup.activeTabElement = tabElement;
      }
      tabElement.addEventListener('click', (event:Event) => {
        this.activateTab(event, tabElement);
      });
    }
  }

  buildTabMap() {
    let tabElements: Element[] = Array.from(document.querySelectorAll(`[${this.tabsAttribute}]`));
    for (let tabElement of tabElements) {
      this.buildTab(tabElement);
    }
  }

  activateTab = (event:Event, tabElement:Element) => {
    event.preventDefault();
    let panelDomId = tabElement.attributes.getNamedItem('href').nodeValue.substring(1);
    let panelElement = document.getElementById(panelDomId);
    let tabgroup = this.tabMap[panelDomId];
    tabgroup.activeTabElement.classList.remove(this.tabActiveCssClass);
    tabgroup.activePanelElement.classList.remove(this.panelActiveCssClass);
    tabElement.classList.add(this.tabActiveCssClass);
    panelElement.classList.add(this.panelActiveCssClass);
    tabgroup.activeTabElement = tabElement;
    tabgroup.activePanelElement = panelElement;
  }
}
