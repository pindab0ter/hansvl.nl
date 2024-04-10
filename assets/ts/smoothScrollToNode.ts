export default function smoothScrollToNode(id: string): void {
  const elementToView = document.getElementById(id);
  elementToView?.scrollIntoView({
    behavior: "smooth",
  });
}
