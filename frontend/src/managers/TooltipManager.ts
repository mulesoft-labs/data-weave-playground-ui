class TooltipManager {
  static instance;

  constructor() {
    this.refresh();
  }

  refresh() {
    if (TooltipManager.instance) {
      // clear previous tooltips
      TooltipManager.instance.destroyAll();
    }
    // create tooltips
    TooltipManager.instance = window['tippy']('.tippy[title]');
  }
}

export default TooltipManager;
