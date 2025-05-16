export function hexStringToHexValue(hexString) {
  if (typeof hexString !== 'string' || !/^#?[0-9a-fA-F]{6}$/.test(hexString)) {
    throw new Error(`Invalid hex string: ${hexString}`);
  }
  return parseInt(hexString.replace('#', ''), 16);
}
