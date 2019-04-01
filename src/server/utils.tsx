import { Bundle } from "react-loadable/webpack";

const manifest = require("../../public/manifest.json");

export const getVendorBundlesFromManifest = (allBundles: string[]) =>
    allBundles
        .filter((bundle) => bundle.startsWith("vendor") && bundle.endsWith("js"))
        .map((bundle) => {
            return `<script src="${bundle}"></script>`;
        })
        .join("\n");

export const getStylesBundles = (allBundles: Bundle[]) =>
    allBundles
        .filter((bundle) => bundle.file.endsWith(".css"))
        .map((bundle) => {
            return `<link rel="stylesheet" href=${bundle.file}>`;
        })
        .join("\n");

export const getJSBundles = (allBundles: Bundle[]) =>
    allBundles
        .filter((bundle) => bundle.file.endsWith(".js"))
        .map((bundle) => {
            return `<script src="${bundle.file}"></script>`;
        })
        .join("\n");

export const serviceWorkerScript = `<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
</script>
<link rel="manifest" href="/sw_manifest.json">`;

export const isFileCompressed = (url: string, extension: string) => {
    const urlSplit = (url + extension).split("/");
    const fileName = urlSplit[urlSplit.length - 1];

    return !!manifest[fileName];
};
