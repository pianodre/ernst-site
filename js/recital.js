const overlay = document.getElementById("popupOverlay");
const closePopupButton = document.getElementById("closePopup");
const popupTitle = document.getElementById("popupTitle");
const popupBody = document.getElementById("popupBody");

const iconButtons = document.querySelectorAll(".icon-button");

iconButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const title = button.dataset.title || `Temp ${index + 1} Title`;
    const body = button.dataset.body || `Temp ${index + 1} Body`;

    popupTitle.textContent = title;
    popupBody.innerHTML = body;

    const popupCard = document.querySelector(".popupCard");
    
    overlay.style.display = "flex";
    
    requestAnimationFrame(() => {
      let anchorElement;
      
      if (index < 3) {
        anchorElement = document.getElementById("anchor-first-half");
      } else {
        anchorElement = document.getElementById("anchor-second-half");
      }
      
      if (anchorElement) {
        const anchorRect = anchorElement.getBoundingClientRect();
        const popupHeight = popupCard.offsetHeight;
        
        const anchorCenter = anchorRect.top + (anchorRect.height / 2);
        let topPosition = anchorCenter + window.scrollY - (popupHeight / 2);
        
        if (index >= 3) {
          topPosition -= 200;
        }
        
        const minTop = window.scrollY + 20;
        const maxTop = window.scrollY + window.innerHeight - popupHeight - 20;
        
        topPosition = Math.max(minTop, Math.min(topPosition, maxTop));
        
        popupCard.style.marginTop = `${topPosition}px`;
      }
    });
  });
});

closePopupButton.addEventListener("click", () => {
  overlay.style.display = "none";
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});
