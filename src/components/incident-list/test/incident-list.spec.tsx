import { newSpecPage } from '@stencil/core/testing';
import { IncidentList } from '../incident-list';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from '../../../api/incident-log/models';
import fetchMock from 'jest-fetch-mock';


describe('incident-list', () => {
  const sampleIncidents: Incident[] = [
    {
      id: 'INC-001',
      incidentType: 'Security breach',
      location: 'Oddelenie urgentného príjmu',
      occurredAt: new Date('2024-02-03T12:00:00Z'),
      description: 'Neoprávnený vstup do zabezpečenej zóny.',
      severity: IncidentSeverity.Vysok,
      status: IncidentStatus.Nov,
      attachments: [],
      investigationReport: '',
      notes: '',
    },
    {
      id: 'INC-002',
      incidentType: 'Patient fall',
      location: 'Chodba B',
      occurredAt: new Date('2024-02-03T13:00:00Z'),
      description: 'Pád pacienta bez vážneho zranenia.',
      severity: IncidentSeverity.Stredn,
      status: IncidentStatus.VRieen,
      attachments: [],
      investigationReport: '',
      notes: '',
    },
  ];

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('renders sample incidents', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleIncidents));

    const page = await newSpecPage({
      components: [IncidentList],
      html: `<incident-list api-base="http://test/api"></incident-list>`,
    });

    await page.waitForChanges();

    const incidentList = page.rootInstance as IncidentList;
    const expectedIncidents = incidentList?.incidents?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(expectedIncidents).toEqual(sampleIncidents.length);
    expect(items.length).toEqual(expectedIncidents);
  });

  it('renders error message on network issues', async () => {
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const page = await newSpecPage({
      components: [IncidentList],
      html: `<incident-list api-base="http://test/api"></incident-list>`,
    });

    await page.waitForChanges();

    const incidentList = page.rootInstance as IncidentList;
    const expectedIncidents = incidentList?.incidents?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedIncidents).toEqual(0);
    expect(items.length).toEqual(expectedIncidents);
  });
});
