import { versionServices } from './versions.services'
import { etapesServices } from './etapes.services'
import { etapeSlasServices } from './etapeSlas.services'
import { etapeDeliverablesServices } from './etapeDeliverables.services'

export const workflowServices = {
  ...versionServices,
  ...etapesServices,
  ...etapeSlasServices,
  ...etapeDeliverablesServices
}
