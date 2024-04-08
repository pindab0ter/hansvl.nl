export default function smoothScrollToNode(id: string): void {
  const elementToView: HTMLElement = document.getElementById(id);
  elementToView?.scrollIntoView({
    behavior: "smooth",
  });
}
