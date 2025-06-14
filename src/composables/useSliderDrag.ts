import { ref } from 'vue';

export function useSliderDrag(cardWidth: any, slideCount: any, current: any) {
  const isDragging = ref(false);
  const startCoord = ref(0);
  const currentCoord = ref(0);
  const dragOffset = ref(0);

  const getEventX = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const onDragStart = (e: MouseEvent | TouchEvent) => {
    let target: EventTarget | null =
      'touches' in e ? e.touches[0].target : e.target;

    if (cardWidth.value === 0) return;
    if (
      target instanceof HTMLElement &&
      (['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(
        target.tagName
      ) ||
        target.hasAttribute('tabindex'))
    ) {
      return;
    }

    isDragging.value = true;
    startCoord.value = getEventX(e);
    currentCoord.value = startCoord.value;
    dragOffset.value = 0;

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  };

  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    if ('preventDefault' in e) e.preventDefault?.();

    currentCoord.value = getEventX(e);
    dragOffset.value = currentCoord.value - startCoord.value;
  };

  const onDragEnd = () => {
    if (!isDragging.value) return;

    const offset = dragOffset.value;
    const width = cardWidth.value;

    isDragging.value = false;

    let nextIndex = current.value;
    if (Math.abs(offset) > width / 4) {
      const slidesMoved = Math.round(Math.abs(offset) / width);

      if (offset < 0 && current.value < slideCount.value - 1) {
        nextIndex = Math.min(current.value + slidesMoved, slideCount.value - 1);
      } else if (offset > 0 && current.value > 0) {
        nextIndex = Math.max(current.value - slidesMoved, 0);
      }

      current.value = nextIndex;
    }

    dragOffset.value = 0;

    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  };

  return {
    isDragging,
    dragOffset,
    onDragStart,
    onDragMove,
    onDragEnd,
  };
}
