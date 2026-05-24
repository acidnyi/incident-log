import { newSpecPage } from '@stencil/core/testing';
import { IncidentList } from '../incident-list';

describe('incident-list', () => {
  it('renders incident items', async () => {
    const page = await newSpecPage({
      components: [IncidentList],
      html: `<incident-list></incident-list>`,
    });

    const incidentList = page.rootInstance as IncidentList;
    const expectedIncidents = incidentList?.incidents?.length;

    const items = page.root?.shadowRoot?.querySelectorAll('md-list-item');
    expect(items?.length).toEqual(expectedIncidents);

  });
});
