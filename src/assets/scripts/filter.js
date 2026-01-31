
function setupTagFiltering(pillSelector, cardSelector) {
  const tagPills = document.querySelectorAll(pillSelector);
  const cards = document.querySelectorAll(cardSelector);
  let activeTag = null;

  tagPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedTag = pill.textContent.trim().substring(1);

      if (activeTag === clickedTag) {
        // Deactivate filter
        activeTag = null;
        pill.classList.remove('bg-blue-500', 'text-white');
        pill.classList.add('bg-gray-200', 'text-gray-700');
        cards.forEach(card => {
          card.style.display = 'block';
        });
      } else {
        // Activate filter
        if (activeTag) {
          const activePill = document.querySelector(`${pillSelector}[data-tag="${activeTag}"]`);
          if (activePill) {
            activePill.classList.remove('bg-blue-500', 'text-white');
            activePill.classList.add('bg-gray-200', 'text-gray-700');
          }
        }
        activeTag = clickedTag;
        pill.classList.add('bg-blue-500', 'text-white');
        pill.classList.remove('bg-gray-200', 'text-gray-700');

        cards.forEach(card => {
          const cardTags = card.dataset.tags.split(',');
          if (cardTags.includes(activeTag)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });
}

export default setupTagFiltering;
