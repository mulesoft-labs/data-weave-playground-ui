class GlyphManager {
  private interval: NodeJS.Timer;
  private listeners: { el: Element; callback: () => void }[] = [];

  add(id: string, message: string, callback: () => void) {
    this.clear();

    // wait for DOM elements to exist
    this.interval = setInterval(() => {
      const glyphElements = document.querySelectorAll(`.${id}`);
      if (glyphElements.length) {
        // setup tooltip related stuff
        for (let i = 0; i < glyphElements.length; i++) {
          const glyph = glyphElements[i];
          glyph.setAttribute('title', message);
          // register event listener
          glyph.addEventListener('click', callback);
          this.listeners.push({
            el: glyph,
            callback
          });
        }

        // update tooltip manager
        window['TooltipManager'].refresh();

        // stop looking for elements
        clearInterval(this.interval);
      }
    }, 100);
  }

  clear() {
    if (this.interval) clearInterval(this.interval);

    this.listeners.forEach(entry => {
      entry.el.removeEventListener('onClick', entry.callback);
    });
  }
}

export default GlyphManager;
