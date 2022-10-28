import { createSelector } from "@reduxjs/toolkit"

import { machinesPageRootSelector } from "pages/machinesPage/selectors"

const machineListRootSelector = createSelector(
  machinesPageRootSelector,
  ({ list }) => list
)

export const machineListSelector = createSelector(
  machineListRootSelector,
  ({ machinesList }) => (machinesList ? machinesList : [])
)

export const isLoadingSelector = createSelector(
  machineListRootSelector,
  ({ isLoading }) => isLoading
)

export const statusesSelector = createSelector(
  machineListRootSelector,
  ({ statuses }) => statuses
)

export const statusesListSelector = createSelector(
  machineListRootSelector,
  ({ statusesList }) => statusesList
)

export const subCategoriesSelector = createSelector(
  machineListRootSelector,
  ({ subCategories }) => subCategories
)

export const sitesSelector = createSelector(
  machineListRootSelector,
  ({ sites }) => sites
)

export const totalSelector = createSelector(
  machineListRootSelector,
  ({ total }) => total
)

export const brandsSelector = createSelector(
  machineListRootSelector,
  ({ brands }) => brands
)

export const modelsSelector = createSelector(
  machineListRootSelector,
  ({ models }) => models
)

export const selectedMachinesSelector = createSelector(
  machineListRootSelector,
  ({ selectedMachines }) => selectedMachines
)

export const machinesPageCountSelector = createSelector(
  machineListRootSelector,
  ({ page }) => page
)

export const scrollPositionSelector = createSelector(
  machineListRootSelector,
  ({ scrollPosition }) => scrollPosition
)

export const machineIdSelector = createSelector(
  machineListRootSelector,
  ({ machineId }) => machineId
)

export const updatedMachineSelector = createSelector(
  machineListRootSelector,
  ({ updatedMachine }) => updatedMachine
)

export const userListSelector = createSelector(
  machineListRootSelector,
  ({ usersList }) => usersList
)

export const machineSelector = createSelector(
  machineListRootSelector,
  ({ machine }) => machine
)
