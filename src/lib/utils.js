
export function toggleElement(element) {
    var menu = document.getElementById(element);
    if ( !(menu.style.display === "block")) {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
}