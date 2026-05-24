import { newSpecPage } from '@stencil/core/testing';
import { IncidentList } from '../incident-list';

describe('incident-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IncidentList],
      html: `<incident-list></incident-list>`,
    });
    expect(page.root).toEqualHtml(`
      <incident-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </incident-list>
    `);
  });
});
