import { newSpecPage } from '@stencil/core/testing';
import { IncidentEditor } from '../incident-editor';

describe('incident-editor', () => {
  it('buttons shall be of different type', async () => {
    const page = await newSpecPage({
      components: [IncidentEditor],
      html: `<incident-editor entry-id="@new"></incident-editor>`,
    });

    let items: any = page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);

    items = page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);

    items = page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });
});