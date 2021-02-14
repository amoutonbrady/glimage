# `imagine`

A minimalistic, dependency free library to merge multiple images into one.

<img src=".github/demo.gif">

## Why?

The specific use case case that led to the making of this library is to be able to create a single image from many for idendity documents upload.
Say you have to upload the recto and verso of your idenditity paper but your backend only accept a single file. This is where `imagine` comes in handy.

=> [a] + [b] = [ab]

## Installation

```bash
# npm
$ npm install imagine

# pnpm
$ pnpm add imagine

# yarn
$ yarn add imagine
```

## Usage

```js
import { imagine } from 'imagine';

const img = document.querySelector('img');
const input = document.querySelector('input');

input.addEventListener('change', async (e) => {
  const { files } = e.target;

  const [src, blob] = await imagine(files, {
    direction: 'vertical',
    gap: 100,
    color: 'red',
  });

  img.src = src;

  uploadImage(blob);
});
```

## API

### imagine(sources: string[] | FileList, options?: Partial<Options>): Promise<[string, Blob]>

`imagine` takes a list of strings (which should be a list of URLs) or a `FileList` which is what `e.target.files` returns on an input of type file.

### options

Type: `Object`

List of options to pass as a second argument to `imagine`

#### options.gap

Type: `number`
Default: 0

A number indicating the gap (in pixels) between each images.

#### options.direction

Type: `'horizontal' | 'vertical'`
Default: 'horizontal'

A string indicating in which direction the image are going to be glued together.

#### options.type

Type: `string & ('image/jpeg' | 'image/png' | 'image/webp')`
Default: 'image/png'

A string indicating the image format.

#### options.quality

Type: `number`
Default: 0.92

A number between **0 and 1** indicating the image quality to use for image formats that use lossy compression such as image/jpeg and image/webp.

#### options.color

Type: `string | CanvasGradient | CanvasPattern`

A string, canvas gradient or canvas pattern used to fill the background.
There is no default.

## Contribute

- Fork the repo.
- Clone the repo. locally
- Run `pnpm install` (you might need to install [pnpm](https://pnpm.js.org/) first)
- Run `pnpm dev`
- Open `localhost:3000` and do your changes to [src/imagine.ts](./src/index.ts)
- Commit & push
- Make a PR

## Prior work

- [merge-images][https://github.com/lukechilds/merge-images] - A library to merge and compose images on top of each other. `imagine` is inspired by it.
