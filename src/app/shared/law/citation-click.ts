/**
 * True for a plain left click on a citation link: the law panel opens. With Ctrl, Cmd, Shift
 * or Alt, or with another button, the browser follows the link (new tab, new window).
 */
export function isPlainClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
}
