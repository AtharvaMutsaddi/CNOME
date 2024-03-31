import * as XXH from 'xxhashjs'; 

export default function generateHash(data: string): string {
  const hash = XXH.h32(0xabcd); // Initialize with seed 0xabcd
  hash.update(data);
  return hash.digest().toString(16); // Convert to hexadecimal string
}