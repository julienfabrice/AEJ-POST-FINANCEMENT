import { versionServices } from './versions.services'
import { etapesServices } from './etapes.services'

export const workflowServices = {
  ...versionServices,
  ...etapesServices
}
