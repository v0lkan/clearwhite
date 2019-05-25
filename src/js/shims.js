/*
 *  Clearwhite: Lesson notes, clarified.
 *
 *  Clearwhite is a “Zero to Hero” project:
 *  https://clearwhite.zerotohero.dev/
 *
 *  MIT Licensed—see LICENSE.md
 */

const tick = fn =>
  window.requestAnimationFrame
    ? window.requestAnimationFrame(fn)
    : setTimeout(fn, 17);

export { tick };