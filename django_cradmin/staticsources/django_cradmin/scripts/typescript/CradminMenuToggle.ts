

export class CradminMenuToggle {
  active:boolean = false;
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

  addClickListeners() {
    let clickables = Array.from(document.querySelectorAll(`[${this.clickableAttribute}]`));
    for (let clickable of clickables) {
      clickable.addEventListener('click', this.toggleAction);
    }
  }

  toggleAction = (event:Event) => {
    this.active = !this.active;
    let groupId = event.srcElement.attributes.getNamedItem(this.groupIdAttribute).nodeValue;

    for (let element of this.styleToggleElementGroups[groupId]) {
      if (this.active){
        element.node.classList.add(element.value);
      } else{
        element.node.classList.remove(element.value);
      }
    }
  }
}

