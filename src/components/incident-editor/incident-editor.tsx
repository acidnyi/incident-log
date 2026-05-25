import { Component, Host, Prop, h, EventEmitter, Event, State } from '@stencil/core';
import '@material/web/textfield/filled-text-field';
import '@material/web/select/filled-select';
import '@material/web/select/select-option';
import '@material/web/icon/icon';
import '@material/web/divider/divider';
import '@material/web/button/filled-button';
import '@material/web/button/filled-tonal-button';
import '@material/web/button/outlined-button';

import {
  Configuration,
  Incident,
  IncidentLogApi,
  IncidentType,
  IncidentTypesApi,
} from '../../api/incident-log';

@Component({
  tag: 'incident-editor',
  styleUrl: 'incident-editor.css',
  shadow: true,
})
export class IncidentEditor {
  @Prop() entryId!: string;
  @Prop() apiBase: string = '/api';

  @Event({ eventName: 'editor-closed' })
  editorClosed!: EventEmitter<string>;

  @State() entry?: Incident;
  @State() errorMessage?: string;
  @State() isValid = false;
  @State() incidentTypes: IncidentType[] = [];

  private formElement!: HTMLFormElement;

  componentWillLoad() {
    this.getIncidentAsync();
    this.getIncidentTypes();
  }

  private async getIncidentAsync(): Promise<Incident | undefined> {
    if (!this.entryId || this.entryId === '@new') {
      this.entry = {
        id: this.generateIncidentId(),
        incidentType: '',
        location: '',
        occurredAt: new Date(),
        description: '',
        severity: 'Nízka' as any,
        status: 'Nový' as any,
        attachments: [],
        investigationReport: '',
        notes: '',
      };

      this.isValid = false;
      return undefined;
    }

    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const incidentLogApi = new IncidentLogApi(configuration);

      const response = await incidentLogApi.getIncidentRaw({
        incidentId: this.entryId,
      });

      if (response.raw.status < 299) {
        this.entry = await response.value();
        this.isValid = true;
      } else {
        this.errorMessage = `Nie je možné načítať incident: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Nie je možné načítať incident: ${err.message || 'unknown'}`;
    }

    return undefined;
  }

  private async getIncidentTypes(): Promise<IncidentType[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const incidentTypesApi = new IncidentTypesApi(configuration);

      const response = await incidentTypesApi.getIncidentTypesRaw();

      if (response.raw.status < 299) {
        this.incidentTypes = await response.value();
      }
    } catch (err: any) {
      // no strong dependency on incident types
    }

    return this.incidentTypes || [
      {
        code: 'fallback',
        value: 'Neurčený typ incidentu',
        typicalSeverity: 'Nízka' as any,
        description: 'Fallback typ incidentu',
      },
    ];
  }

  private renderIncidentTypes() {
    let incidentTypes = this.incidentTypes || [];

    if (this.entry?.incidentType) {
      const index = incidentTypes.findIndex(
        incidentType => incidentType.value === this.entry.incidentType,
      );

      if (index < 0) {
        incidentTypes = [
          {
            code: this.entry.incidentType,
            value: this.entry.incidentType,
          },
          ...incidentTypes,
        ];
      }
    }

    return (
      <md-filled-select
        label="Typ incidentu"
        display-text={this.entry?.incidentType}
        required
        oninput={(ev: InputEvent) => this.handleIncidentType(ev)}
      >
        <md-icon slot="leading-icon">report</md-icon>

        {incidentTypes.map(incidentType => (
          <md-select-option
            value={incidentType.code}
            selected={incidentType.value === this.entry?.incidentType}
          >
            <div slot="headline">{incidentType.value}</div>
          </md-select-option>
        ))}
      </md-filled-select>
    );
  }

  private handleIncidentType(ev: InputEvent) {
    if (this.entry) {
      const code = this.handleInputEvent(ev);
      const incidentType = this.incidentTypes.find(item => item.code === code);

      if (incidentType) {
        this.entry.incidentType = incidentType.value;

        if (incidentType.typicalSeverity) {
          this.entry.severity = incidentType.typicalSeverity as any;
        }
      }
    }
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }

    return (
      <Host>
        <h2>Editor incidentu</h2>

        <div class="editor-card">
          <form ref={el => (this.formElement = el)} class="form-grid">
            <md-filled-text-field
              label="ID incidentu"
              required
              readOnly
              value={this.entry?.id}
            >
              <md-icon slot="leading-icon">tag</md-icon>
            </md-filled-text-field>

            {this.renderIncidentTypes()}

            <md-filled-text-field
              label="Miesto vzniku"
              required
              pattern=".*\S.*"
              value={this.entry?.location}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.location = this.handleInputEvent(ev);
                }
              }}
            >
              <md-icon slot="leading-icon">location_on</md-icon>
            </md-filled-text-field>

            <md-filled-text-field
              label="Dátum a čas vzniku"
              type="datetime-local"
              value={this.toDatetimeLocal(this.entry?.occurredAt)}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.occurredAt = new Date(this.handleInputEvent(ev));
                }
              }}
            >
              <md-icon slot="leading-icon">schedule</md-icon>
            </md-filled-text-field>

            <md-filled-select
              label="Úroveň závažnosti"
              value={this.entry?.severity}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.severity = this.handleInputEvent(ev) as any;
                }
              }}
            >
              <md-icon slot="leading-icon">priority_high</md-icon>
              <md-select-option value="Nízka">
                <div slot="headline">Nízka</div>
              </md-select-option>
              <md-select-option value="Stredná">
                <div slot="headline">Stredná</div>
              </md-select-option>
              <md-select-option value="Vysoká">
                <div slot="headline">Vysoká</div>
              </md-select-option>
              <md-select-option value="Kritická">
                <div slot="headline">Kritická</div>
              </md-select-option>
            </md-filled-select>

            <md-filled-select
              label="Stav riešenia"
              value={this.entry?.status}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.status = this.handleInputEvent(ev) as any;
                }
              }}
            >
              <md-icon slot="leading-icon">task_alt</md-icon>
              <md-select-option value="Nový">
                <div slot="headline">Nový</div>
              </md-select-option>
              <md-select-option value="V riešení">
                <div slot="headline">V riešení</div>
              </md-select-option>
              <md-select-option value="Uzatvorený">
                <div slot="headline">Uzatvorený</div>
              </md-select-option>
            </md-filled-select>

            <md-filled-text-field
              label="Prílohy"
              value={this.entry?.attachments?.join(', ')}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.attachments = this.handleInputEvent(ev)
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
                }
              }}
            >
              <md-icon slot="leading-icon">attach_file</md-icon>
            </md-filled-text-field>

            <md-filled-text-field
              class="full-width"
              label="Popis udalosti"
              type="textarea"
              required
              pattern=".*\S.*"
              value={this.entry?.description}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.description = this.handleInputEvent(ev);
                }
              }}
            >
              <md-icon slot="leading-icon">description</md-icon>
            </md-filled-text-field>

            <md-filled-text-field
              class="full-width"
              label="Vyšetrovacia správa"
              type="textarea"
              value={this.entry?.investigationReport}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.investigationReport = this.handleInputEvent(ev);
                }
              }}
            >
              <md-icon slot="leading-icon">article</md-icon>
            </md-filled-text-field>

            <md-filled-text-field
              class="full-width"
              label="Poznámky"
              type="textarea"
              value={this.entry?.notes}
              oninput={(ev: InputEvent) => {
                if (this.entry) {
                  this.entry.notes = this.handleInputEvent(ev);
                }
              }}
            >
              <md-icon slot="leading-icon">notes</md-icon>
            </md-filled-text-field>
          </form>

          <md-divider></md-divider>

          <div class="actions">
            <md-filled-tonal-button
              id="delete"
              disabled={!this.entry || this.entryId === '@new'}
              onClick={() => this.deleteEntry()}
            >
              <md-icon slot="icon">delete</md-icon>
              Zmazať
            </md-filled-tonal-button>

            <span class="stretch-fill"></span>

            <md-outlined-button
              id="cancel"
              onClick={() => this.editorClosed.emit('cancel')}
            >
              Zrušiť
            </md-outlined-button>

            <md-filled-button
              id="confirm"
              disabled={!this.entry}
              onClick={() => this.updateEntry()}
            >
              <md-icon slot="icon">save</md-icon>
              Uložiť
            </md-filled-button>
          </div>
        </div>
      </Host>
    );
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    this.validateForm('silent');
    return target.value;
  }

  private validateForm(mode: 'silent' | 'show-errors'): boolean {
    this.isValid = true;

    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i] as HTMLElement & {
        checkValidity?: () => boolean;
        reportValidity?: () => boolean;
      };

      let valid = true;

      if (mode === 'show-errors' && element.reportValidity) {
        valid = element.reportValidity();
      } else if (element.checkValidity) {
        valid = element.checkValidity();
      }

      this.isValid &&= valid;
    }

    return this.isValid;
  }

  private async updateEntry() {
    if (!this.entry || !this.validateForm('show-errors')) {
      return;
    }

    const incidentId =
      this.entryId && this.entryId !== '@new'
        ? this.entryId
        : this.entry.id || this.generateIncidentId();

    this.entry.id = incidentId;

    if (!incidentId) {
      this.errorMessage = 'Nie je možné uložiť incident: chýba ID incidentu';
      return;
    }

    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const incidentLogApi = new IncidentLogApi(configuration);

      const response =
        this.entryId === '@new'
          ? await incidentLogApi.createIncidentRaw({
            incident: this.entry,
          })
          : await incidentLogApi.updateIncidentRaw({
            incidentId,
            incident: this.entry,
          });

      if (response.raw.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Nie je možné uložiť incident: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Nie je možné uložiť incident: ${err.message || 'unknown'}`;
    }
  }

  private async deleteEntry() {
    const incidentId =
      this.entryId && this.entryId !== '@new'
        ? this.entryId
        : this.entry?.id;

    if (!incidentId) {
      this.errorMessage = 'Nie je možné zmazať incident: chýba ID incidentu';
      return;
    }

    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const incidentLogApi = new IncidentLogApi(configuration);

      const response = await incidentLogApi.deleteIncidentRaw({
        incidentId,
      });

      if (response.raw.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Nie je možné zmazať incident: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Nie je možné zmazať incident: ${err.message || 'unknown'}`;
    }
  }

  private toDatetimeLocal(value?: string | Date): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    return date.toISOString().slice(0, 16);
  }

  private generateIncidentId(): string {
    return `INC-${Date.now()}`;
  }
}

