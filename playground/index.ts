import { glimage } from '../src/glimage';

const input = document.querySelector('input');
const img = document.querySelector('img');

input.addEventListener('change', async (e) => {
  const { files } = e.target as HTMLInputElement;
  const [src] = await glimage(files);
  img.src = src;
});
