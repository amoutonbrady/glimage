import { imagine } from '../src/imagine';

const input = document.querySelector('input');
const img = document.querySelector('img');

input.addEventListener('change', async (e) => {
  const { files } = e.target as HTMLInputElement;
  const [src] = await imagine(files);
  img.src = src;
});
