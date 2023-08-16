const copyHeadingLink = (clipboard) => {
  const deeplink = "link";
  const deeplinks = document.querySelectorAll(`.${deeplink}`);
  if (deeplinks) {
    document.addEventListener("click", (event) => {
      const target = event.target;
      const parent = target.nodeName === "svg"
        ? target.parentNode
        : target.parentNode.parentNode;
      if ((target && containsClass(target, deeplink)) || containsClass(parent, deeplink)) {
        event.preventDefault();
        const newLink = target.href !== undefined
          ? target.href
          : parent.href;
        clipboard.writeText(newLink).then();
      }
    });
  }
};


copyHeadingLink(navigator.clipboard);

