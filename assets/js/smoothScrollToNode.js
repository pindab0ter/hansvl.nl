function smoothScrollToNode(id) {
  const elementToView = document.getElementById(id);
  elementToView?.scrollIntoView({
    behavior: "smooth"
  });
}

const bouncingArrow = document.getElementById("bouncing-arrow");
bouncingArrow?.addEventListener("click", () => {
  smoothScrollToNode("featured-blog");
});
