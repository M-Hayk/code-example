import { CONSTANTS } from "config"

export const normalizeMachinesList = (data) =>
  data.map((machine) => {
    const ads = machine?.ads ? machine.ads.filter((ad) => ad) : []
    const availableTemplateNames = Object.values(
      CONSTANTS.TEMPLATES.SUBCATEGORY
    )
    const isDefaultTemplate = !availableTemplateNames.includes(
      machine.templateName
    )

    return {
      ...machine,
      ads,
      pictures: (machine.pictures || []).filter((picture) => picture),
      templateName: isDefaultTemplate
        ? CONSTANTS.TEMPLATES.SUBCATEGORY.TRANSPORTATION
        : machine.templateName,
    }
  })

export const normalizeSubCategoriesOptions = (data) =>
  data.map(({ name }) => name)

export const normalizeStatusOptions = (data) =>
  data
    .map(({ status }) => status)
    // The toggle all exception is removed from the response and hardcoded on the page for better control
    .filter(
      (status) => status !== CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
    )
