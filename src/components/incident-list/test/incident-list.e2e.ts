import { newE2EPage } from '@stencil/core/testing';

describe('incident-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<incident-list></incident-list>');

    const element = await page.find('incident-list');
    expect(element).toHaveClass('hydrated');
  });
});
