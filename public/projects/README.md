# Project images

Add each project's PNG, JPG, or WebP images to its matching folder (`project-01` through `project-06`). Then list the image paths in that project's `images` array in `src/app/components/about.js`.

Example for `public/projects/project-01/songfrontation-cover.png`:

```js
images: [
    { src: "/projects/project-01/songfrontation-cover.png", alt: "Songfrontation game screen" },
],
```

The first image is the main preview. Additional entries appear as selectable thumbnails. Use paths beginning with `/projects/...`; `public` is the web root and is not part of the URL.