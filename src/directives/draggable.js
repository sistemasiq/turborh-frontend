// src/directives/draggable.js
export const vDraggable = {
  mounted(el) {
    el.style.position = "absolute";
    el.style.cursor = "move";

    el.onmousedown = function (event) {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return;
      }

      const shiftX = event.clientX - el.getBoundingClientRect().left;
      const shiftY = event.clientY - el.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        let newX = pageX - shiftX;
        let newY = pageY - shiftY;

        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;

        const elementWidth = el.offsetWidth;
        const elementHeight = el.offsetHeight;


        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + elementWidth > screenWidth) newX = screenWidth - elementWidth;
        if (newY + elementHeight > screenHeight) newY = screenHeight - elementHeight;

        el.style.left = newX + "px";
        el.style.top = newY + "px";
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener("mousemove", onMouseMove);

      el.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        el.onmouseup = null;
      };
    };

    el.ondragstart = function () {
      return false;
    };
  },
};
