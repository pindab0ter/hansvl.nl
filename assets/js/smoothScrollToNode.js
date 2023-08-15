function smoothScrollToNode(id) {
  var elementToView = document.getElementById(id);
  elementToView.scrollIntoView({
    behavior: "smooth"
  });
}

const bouncingArrow = document.getElementById("bouncing-arrow");

if (bouncingArrow !== null) {
  bouncingArrow.onclick = (e) => {
    smoothScrollToNode("featured-blog");
    e.target.parentElement.remove();
  };
}
