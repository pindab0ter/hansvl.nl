export default function copyHeadingLink(element, event) {
  event.preventDefault();
  navigator.clipboard.writeText(element.href).then();
}
