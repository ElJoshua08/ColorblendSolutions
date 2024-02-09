const topicList = document.querySelector(".topics");

window.addEventListener("wheel", (e) => {
  let movementX = e.deltaY / 2

  topicList.scrollBy(movementX, 0);
});
