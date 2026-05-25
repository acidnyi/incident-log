import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Configuration, IncidentLogApi, Incident } from '../../api/incident-log';

@Component({
  tag: 'incident-list',
  styleUrl: 'incident-list.css',
  shadow: true,
})
export class IncidentList {
  @Event({ eventName: 'entry-clicked' })
  entryClicked!: EventEmitter<string>;

  @Prop() apiBase: string = '/api';

  @State() incidents: Incident[] = [];
  @State() errorMessage?: string;

  private async getIncidentsAsync(): Promise<Incident[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const incidentLogApi = new IncidentLogApi(configuration);
      const response = await incidentLogApi.getIncidentsRaw();

      if (response.raw.status < 299) {
        return await response.value();
      }

      this.errorMessage = `Cannot retrieve list of incidents: ${response.raw.statusText}`;
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of incidents: ${err.message || 'unknown'}`;
    }

    return [];
  }

  private archiveIncident(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.incidents = this.incidents.filter(incident => incident.id !== id);
  }

  async componentWillLoad() {
    this.incidents = await this.getIncidentsAsync();
  }

  render() {
    return (
      <Host>
        <h2>Hlásenie incidentov a bezpečnostných udalostí</h2>

        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          <md-list>
            {this.incidents.map(incident => (
              <md-list-item onClick={() => this.entryClicked.emit(incident.id)}>
                <md-icon slot="start">report</md-icon>

                <div slot="headline">
                  {incident.id} – {incident.incidentType}
                </div>

                <div slot="supporting-text" class="incident-details">
                  <div><strong>Miesto:</strong> {incident.location}</div>
                  <div><strong>Dátum a čas:</strong> {new Date(incident.occurredAt).toLocaleString()}</div>
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
                  onClick={(event: MouseEvent) => this.archiveIncident(incident.id, event)}
                >
                  Archivovať
                </md-filled-button>
              </md-list-item>
            ))}
          </md-list>
        )}
      </Host>
    );
  }
}