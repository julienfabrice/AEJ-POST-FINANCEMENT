import { versionServices } from './versions.services'
import { etapesServices } from './etapes.services'
import { etapeSlasServices } from './etapeSlas.services'

export const workflowServices = {
  ...versionServices,
  ...etapesServices,
  ...etapeSlasServices
}
