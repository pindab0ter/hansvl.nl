export default function smoothScrollToNode(id) {
  const elementToView = document.getElementById(id);
  elementToView?.scrollIntoView({
    behavior: "smooth",
  });
}
