import { createItemIntent } from './itemService';
import { updateItemState } from './itemStateService';
import { ItemState } from '../../domain/enums';

async function test() {
  const item = await createItemIntent({
    ownerId: 'owner-123',
    category: 'wedding_wear',
    gender: 'men',
    size: 'L',
    fabric: 'silk',
    wearLevel: 'light_use',
    zone: 'indore-central',
  });

  console.log('Initial state:', item.state);

  await updateItemState(item.id, ItemState.AT_HUB);
  await updateItemState(item.id, ItemState.VERIFIED);

  console.log('Moved to VERIFIED');
}

test();
