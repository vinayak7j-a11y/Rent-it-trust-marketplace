import { applyCooldown } from './cooldownService';
import { runCooldownRelease } from '../../jobs/cooldownReleaseJob';

async function test() {
  const itemId = 'test-item-id';

  const until = await applyCooldown(itemId);
  console.log('Cooldown until:', until);

  await runCooldownRelease();
}

test(); 
