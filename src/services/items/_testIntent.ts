import { createItemIntent } from './itemService';
import { getIntentItems } from './adminItemService';

async function test() {
  await createItemIntent({
    ownerId: 'owner-xyz',
    category: 'wedding',
    gender: 'men',
    size: 'L',
    fabric: 'silk',
    wearLevel: 'light',
    zone: 'indore',
  });

  const items = await getIntentItems();
  console.log('Intent items:', items.length);
}

test();