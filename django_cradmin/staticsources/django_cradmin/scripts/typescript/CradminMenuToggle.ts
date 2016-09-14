

export class CradminMenuToggle {
  activeMap = {};
  styleToggleElementGroups = {};

  constructor(private clickableAttribute:string="cradmin_menutoggle_clickable",
              private toggleStyleAttribute:string="cradmin_menutoggle_activestyle",
              private groupIdAttribute:string="cradmin_menutoggle_groupid") {
    this.addClickListeners();
    this.getToggleElements();
  }

  getToggleElements() {
    let elements: Element[] = Array.from(document.querySelectorAll(`[${this.toggleStyleAttribute}]`));
    for (let element of elements) {
      let nodeDescriptor = {
        node: element,
        value: element.attributes.getNamedItem(this.toggleStyleAttribute).nodeValue
      };
      let groupName = element.attributes.getNamedItem(this.groupIdAttribute).nodeValue;
      if (!this.styleToggleElementGroups[groupName]){
        this.styleToggleElementGroups[groupName] = [];
      }
      this.styleToggleElementGroups[groupName].push(nodeDescriptor);
    }
  }

  getGroupIdForClickable(clickable:Element) {
    return clickable.attributes.getNamedItem(this.groupIdAttribute).nodeValue;
  }

  addClickListeners() {
    let clickables = Array.from(document.querySelectorAll(`[${this.clickableAttribute}]`));
    for (let clickable of clickables) {
      this.activeMap[this.getGroupIdForClickable(clickable)] = false;
      clickable.addEventListener('click', (event:Event) => {
        this.toggleAction(event, clickable);
      });
    }
  }

  toggleAction = (event:Event, clickable:Element) => {
    let groupId = this.getGroupIdForClickable(clickable);
    this.activeMap[groupId] = !this.activeMap[groupId];

    for (let element of this.styleToggleElementGroups[groupId]) {
      if (this.activeMap[groupId]){
        element.node.classList.add(element.value);
      } else{
        element.node.classList.remove(element.value);
      }
    }
  }
}

