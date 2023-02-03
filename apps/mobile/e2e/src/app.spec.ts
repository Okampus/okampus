import { device, element, by, expect } from 'detox';

describe('mobile', () => {
  beforeEach(async () => {
    // await device.reloadReactNative();
    await device.launchApp();
  });

  it('should display welcome message', async () => {
    await expect(element(by.id('heading'))).toHaveText('Welcome mobile 👋');
  });
});
