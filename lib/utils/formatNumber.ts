export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}
