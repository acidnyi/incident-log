import { newE2EPage } from '@stencil/core/testing';

describe('incident-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<incident-app></incident-app>');

    const element = await page.find('incident-app');
    expect(element).toHaveClass('hydrated');
  });
});
