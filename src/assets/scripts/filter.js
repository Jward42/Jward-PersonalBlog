function setupTagFiltering(pillSelector, cardSelector) {
  const tagPills = document.querySelectorAll(pillSelector);
  const cards = document.querySelectorAll(cardSelector);
  let activeTag = null;

  const setPillState = (pill, isActive) => {
    pill.dataset.active = isActive ? 'true' : 'false';
    pill.classList.toggle('bg-neutral-900', isActive);
    pill.classList.toggle('text-white', isActive);
    pill.classList.toggle('border-neutral-900', isActive);
    pill.classList.toggle('text-neutral-600', !isActive);
  };

  const refreshCards = () => {
    cards.forEach((card) => {
      const cardTags = (card.dataset.tags || '').split(',').filter(Boolean);
      const isVisible = !activeTag || cardTags.includes(activeTag);
      card.toggleAttribute('hidden', !isVisible);
    });
  };

  tagPills.forEach((pill) => {
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      const clickedTag = pill.dataset.tag;

      activeTag = activeTag === clickedTag ? null : clickedTag;

      tagPills.forEach((tagPill) => {
        setPillState(tagPill, tagPill.dataset.tag === activeTag);
      });

      refreshCards();
    });
  });
}

export default setupTagFiltering;
