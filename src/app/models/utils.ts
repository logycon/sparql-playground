
export class Guid {
  static newGuid() {
    // tslint:disable-next-line:only-arrow-functions
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // tslint:disable-next-line: one-variable-per-declaration no-bitwise
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
}

export class BrowserUtils {

  static copyToClipboard(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    const retval = document.execCommand('copy');
    selection.removeAllRanges();

    document.body.removeChild(textarea);
    return retval;
  }

  static addBackdrop(): void {
    let div = document.getElementById('backdrop');
    if (!div) {
      div = document.createElement('div');
      div.id = 'backdrop';
    }
    div.className = 'backdrop';
    document.body.appendChild(div);
  }

  static removeBackdrop(): void {
    const div = document.getElementById('backdrop');
    if (div) {
      document.body.removeChild(div);
    }
  }
}
