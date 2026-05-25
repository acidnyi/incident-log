import { newE2EPage } from '@stencil/core/testing';

describe('incident-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<incident-editor></incident-editor>');

    const element = await page.find('incident-editor');
    expect(element).toHaveClass('hydrated');
  });
});
