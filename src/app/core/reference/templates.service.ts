import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';

import type {
  DocumentForm,
  DocumentTemplate,
  TemplateGroup,
  TemplateLibrary,
} from '../content/content.models';

/** The document templates (deeds, powers of attorney, declarations), by group. */
@Service()
export class TemplatesService {
  readonly resource = httpResource<TemplateLibrary>(() => 'data/templates.json');

  /** The groups in their order, each with its templates. Empty groups are left out. */
  readonly groups = computed<{ group: TemplateGroup; templates: DocumentTemplate[] }[]>(() => {
    if (!this.resource.hasValue()) return [];
    const { groups, templates } = this.resource.value();
    return groups
      .map((group) => ({ group, templates: templates.filter((t) => t.group === group.id) }))
      .filter(({ templates: list }) => list.length > 0);
  });

  template(id: string): DocumentTemplate | undefined {
    return this.resource.hasValue()
      ? this.resource.value().templates.find((template) => template.id === id)
      : undefined;
  }

  /** The printed form of a template, if it has one. */
  form(template: DocumentTemplate): DocumentForm | undefined {
    if (!template.form || !this.resource.hasValue()) return undefined;
    return this.resource.value().forms.find((form) => form.id === template.form);
  }
}
