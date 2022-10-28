import { CONSTANTS } from "config"

import { MachineListItemPartsTemplate } from "./machineListItemPartsTemplate"
import { MachineListItemForestryTemplate } from "./machineListItemForestryTemplate"
import { MachineListItemTransportationTemplate } from "./machineListItemTransportationTemplate"
import { MachineListItemAgricultureTemplate } from "./machineListItemAgricultureTemplate"

export const templates = {
  [CONSTANTS.TEMPLATES.SUBCATEGORY.PARTS]: MachineListItemPartsTemplate,
  [CONSTANTS.TEMPLATES.SUBCATEGORY.FORESTRY]: MachineListItemForestryTemplate,
  [CONSTANTS.TEMPLATES.SUBCATEGORY.AGRICULTURE]:
    MachineListItemAgricultureTemplate,
  [CONSTANTS.TEMPLATES.SUBCATEGORY.TRANSPORTATION]:
    MachineListItemTransportationTemplate,
}
