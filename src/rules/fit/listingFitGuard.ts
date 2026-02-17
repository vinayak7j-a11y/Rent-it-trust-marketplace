export function hasCompleteFit(item: any): boolean {
  return (
    item.garmentChestCm &&
    item.garmentWaistCm &&
    item.garmentLengthCm &&
    item.stretchability &&
    item.fitType
  );
}
