import { Workbox } from "workbox-window";

let wb;

if (
  "serviceWorker" in navigator &&
  process.env.NODE_ENV === "production" &&
  !process.env.VUE_APP_NO_PWA
) {
  wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.register();
} else {
  wb = null;
}

export default wb;
