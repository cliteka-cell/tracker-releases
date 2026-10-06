// The one script on this site. It opens pictures larger and turns the landing page's grid of pictures into a carousel.
// It makes no requests, stores nothing and learns nothing about the visitor. Without it every picture still opens on its own.
(() => {
  "use strict";

  const make = (tag, attrs, text) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
    if (text) node.textContent = text;
    return node;
  };
  const zoomLinks = () => Array.from(document.querySelectorAll("a.zoom"));
  const captionOf = (link) => {
    const figure = link.closest("figure");
    const caption = figure && figure.querySelector("figcaption");
    const img = link.querySelector("img");
    return (caption ? caption.textContent : img ? img.alt : "").trim();
  };

  // ---- the viewer: one picture large, with the others on the page one step away ----
  let dialog = null;
  let lbImg = null;
  let lbCaption = null;
  let lbCount = null;
  let prevBtn = null;
  let nextBtn = null;
  let list = [];
  let at = 0;

  function show(index) {
    at = (index + list.length) % list.length;
    const link = list[at];
    const img = link.querySelector("img");
    lbImg.src = link.getAttribute("href");
    lbImg.alt = img ? img.alt : "";
    lbCaption.textContent = captionOf(link);
    lbCount.textContent = list.length > 1 ? `${at + 1} of ${list.length}` : "";
    prevBtn.hidden = nextBtn.hidden = list.length < 2;
  }

  function build() {
    dialog = make("dialog", { class: "lightbox", "aria-label": "Enlarged picture" });
    const close = make("button", { class: "lb-close", type: "button", "aria-label": "Close" }, "×");
    prevBtn = make("button", { class: "lb-prev", type: "button", "aria-label": "Previous picture" }, "‹");
    nextBtn = make("button", { class: "lb-next", type: "button", "aria-label": "Next picture" }, "›");
    const figure = make("figure", { class: "lb-figure" });
    lbImg = make("img", { alt: "" });
    lbCaption = make("figcaption");
    lbCount = make("div", { class: "lb-count" });
    figure.append(lbImg, lbCaption, lbCount);
    dialog.append(close, prevBtn, figure, nextBtn);
    document.body.append(dialog);
    close.addEventListener("click", () => dialog.close());
    prevBtn.addEventListener("click", () => show(at - 1));
    nextBtn.addEventListener("click", () => show(at + 1));
    // a click on the dark area around the picture closes it
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target === figure) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(at - 1);
      if (e.key === "ArrowRight") show(at + 1);
    });
    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  }

  function openViewer(link) {
    if (!dialog) build();
    list = zoomLinks();
    show(Math.max(0, list.indexOf(link)));
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (typeof HTMLDialogElement === "undefined") return; // an old browser just opens the picture itself
    const link = e.target.closest && e.target.closest("a.zoom");
    if (!link) return;
    e.preventDefault();
    openViewer(link);
  });

  // ---- the carousel: the picture in the middle, its neighbours fading away on both sides ----
  function carousel(root) {
    const slides = Array.from(root.children).filter((c) => c.tagName === "FIGURE");
    const n = slides.length;
    if (n < 3) return;
    root.classList.add("coverflow");
    root.setAttribute("role", "group");
    root.setAttribute("aria-roledescription", "carousel");

    const stage = make("div", { class: "cf-stage" });
    slides.forEach((slide, i) => {
      slide.classList.add("cf-slide");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${i + 1} of ${n}`);
      stage.append(slide);
    });
    const caption = make("p", { class: "cf-caption", "aria-live": "polite" });
    const controls = make("div", { class: "cf-controls" });
    const prev = make("button", { class: "cf-arrow", type: "button", "aria-label": "Previous picture" }, "‹");
    const next = make("button", { class: "cf-arrow", type: "button", "aria-label": "Next picture" }, "›");
    const dotsBox = make("div", { class: "cf-dots" });
    const dots = slides.map((_, i) => {
      const dot = make("button", { class: "cf-dot", type: "button", "aria-label": `Show picture ${i + 1} of ${n}` });
      dot.addEventListener("click", () => goTo(i));
      dotsBox.append(dot);
      return dot;
    });
    controls.append(prev, dotsBox, next);
    root.append(stage, caption, controls);

    let cur = 0;
    function update() {
      slides.forEach((slide, i) => {
        let d = (((i - cur) % n) + n) % n;
        if (d > n / 2) d -= n;
        slide.dataset.pos = Math.abs(d) <= 2 ? String(d) : "far";
        const centre = d === 0;
        if (centre) slide.removeAttribute("aria-hidden");
        else slide.setAttribute("aria-hidden", "true");
        const link = slide.querySelector("a.zoom");
        if (link) link.tabIndex = centre ? 0 : -1;
      });
      dots.forEach((dot, i) => (i === cur ? dot.setAttribute("aria-current", "true") : dot.removeAttribute("aria-current")));
      const link = slides[cur].querySelector("a.zoom");
      caption.textContent = link ? captionOf(link) : "";
    }
    function goTo(i) {
      cur = ((i % n) + n) % n;
      update();
    }
    prev.addEventListener("click", () => goTo(cur - 1));
    next.addEventListener("click", () => goTo(cur + 1));
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(cur - 1);
      if (e.key === "ArrowRight") goTo(cur + 1);
    });

    // a click on a neighbour brings it to the middle; a click on the middle one opens it large (the viewer's handler)
    let swipedAt = 0;
    stage.addEventListener("click", (e) => {
      if (Date.now() - swipedAt < 400) {
        e.preventDefault();
        return;
      }
      const slide = e.target.closest(".cf-slide");
      const pos = slide && slide.dataset.pos;
      if (pos === "-1" || pos === "1") {
        e.preventDefault();
        goTo(cur + Number(pos));
      }
    });
    let startX = null;
    stage.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
    });
    stage.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 45) {
        swipedAt = Date.now();
        goTo(cur + (dx < 0 ? 1 : -1));
      }
    });
    stage.addEventListener("pointercancel", () => {
      startX = null;
    });
    update();
  }

  document.querySelectorAll("[data-coverflow]").forEach(carousel);
})();
