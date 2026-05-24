import { Component, Host, h, State } from '@stencil/core';
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/icon/icon'
import '@material/web/button/filled-button'

@Component({
  tag: 'incident-list',
  styleUrl: 'incident-list.css',
  shadow: true,
})
export class IncidentList {

  @State() incidents: any[] = [];


  private async getIncidentsAsync() {
    return await Promise.resolve([
      {
        id: 'INC-001',
        incidentType: 'Bezpečnostná udalosť',
        location: 'Urgentný príjem',
        occurredAt: new Date(),
        description: 'Neoprávnený vstup do vyhradenej zóny.',
        severity: 'Vysoká',
        status: 'Nový',
        attachments: ['kamera-zaznam.mp4'],
        investigationReport: '',
        notes: 'Incident čaká na preverenie.'
      },
      {
        id: 'INC-002',
        incidentType: 'Technický incident',
        location: 'Operačná sála 2',
        occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Výpadok monitorovacieho zariadenia počas prípravy zákroku.',
        severity: 'Stredná',
        status: 'V riešení',
        attachments: ['servisny-log.pdf'],
        investigationReport: 'Kontaktované technické oddelenie.',
        notes: 'Prebieha diagnostika zariadenia.'
      },
      {
        id: 'INC-003',
        incidentType: 'Pracovný úraz',
        location: 'Laboratórium',
        occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: 'Zamestnanec sa poranil pri manipulácii so sklom.',
        severity: 'Nízka',
        status: 'Uzatvorený',
        attachments: [],
        investigationReport: 'Poučenie zamestnanca bolo vykonané.',
        notes: 'Incident bol uzatvorený.'
      }
    ]);
  }

  private archiveIncident(id: string) {
    this.incidents = this.incidents.filter(incident => incident.id !== id);
  }

  async componentWillLoad() {
    this.incidents = await this.getIncidentsAsync();
  }

  render() {
    return (
      <Host>
        <h2>Hlásenie incidentov a bezpečnostných udalostí</h2>

        <md-list>
          {this.incidents.map(incident => (
            <md-list-item>
              <md-icon slot="start">report</md-icon>

              <div slot="headline">
                {incident.id} – {incident.incidentType}
              </div>

              <div slot="supporting-text" class="incident-details">
                <div><strong>Miesto:</strong> {incident.location}</div>
                <div><strong>Dátum a čas:</strong> {incident.occurredAt.toLocaleString()}</div>
                <div><strong>Závažnosť:</strong> {incident.severity}</div>
                <div><strong>Stav:</strong> {incident.status}</div>
                <div><strong>Prílohy:</strong> {incident.attachments?.join(', ') || 'Bez príloh'}</div>
                <div><strong>Vyšetrovacia správa:</strong> {incident.investigationReport || 'Zatiaľ nedoplnené'}</div>
                <div class="full-width"><strong>Popis udalosti:</strong> {incident.description}</div>
                <div class="full-width"><strong>Poznámky:</strong> {incident.notes || 'Bez poznámok'}</div>
              </div>

              <md-filled-button
                slot="end"
                class="archive-button"
                onClick={() => this.archiveIncident(incident.id)}
              >
                Archivovať
              </md-filled-button>
            </md-list-item>
          ))}
        </md-list>
      </Host>
    );
  }
}