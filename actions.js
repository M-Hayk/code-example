/* eslint-disable */

import {
  adsApi,
  clientsApi,
  machinesApi,
  subCategoriesApi,
  searchApi,
  usersApi,
} from "api"

import { actions } from "./store"
import {
  normalizeMachinesList,
  normalizeSubCategoriesOptions,
  normalizeStatusOptions,
} from "./normalizers"
import { denormalizeFilters } from "./denormalizers"

const replaceNullWithArray = (data) => data.map(elem => ({
  ...elem,
  ads: Array.isArray(elem.ads) ? elem.ads : [],
  pictures: Array.isArray(elem.pictures) ? elem.pictures : []
}))

export const fetchMachines = (filter, page, rows) => async (dispatch) => {
  dispatch(actions.setIsLoading(true))

  dispatch(actions.setList([]))

  const denormalizedFilters = denormalizeFilters(filter)
  const {
    data: { data, total },
  } = await machinesApi.listMachines({ ...denormalizedFilters, page, rows })
  const items = normalizeMachinesList(data)

  dispatch(actions.setList(items))
  dispatch(actions.setTotal(total))

  dispatch(actions.setIsLoading(false))
}

export const fetchAndPushToMachines = (filter, page, rows, isDetailed) => async (
  dispatch
) => {
  dispatch(actions.setIsLoading(true))

  const denormalizedFilters = denormalizeFilters(filter)
  const getSearchData = isDetailed ? machinesApi.listMachines : searchApi.getFreeText

  const {
    data: { data, total },
  } = await getSearchData({ ...denormalizedFilters, page, rows })

  const items = replaceNullWithArray(normalizeMachinesList(data))

  dispatch(actions.pushList(items))
  dispatch(actions.setTotal(total))

  dispatch(actions.setIsLoading(false))
}

export const fetchMachineStatuses = (clientId) => async (dispatch) => {
  const { data: fetchedStatuses } = await machinesApi.listMachineStatuses(clientId)

  const normalizedStatuses = normalizeStatusOptions(fetchedStatuses)

  dispatch(actions.setStatuses(normalizedStatuses))
}

export const fetchedMachineStatusesList = (clientId) => async (dispatch) => {
  const { data: fetchedStatuses } = await machinesApi.listMachineStatuses(clientId)
  dispatch(actions.setStatusesList(fetchedStatuses))
}

export const fetchBrands = (category, status) => async (dispatch) => {
  const { data: fetchedBrands } = await searchApi.getBrands({
    category,
    status,
  })

  dispatch(actions.setBrands(fetchedBrands))
}

// new version of search code down below, comment out if required
export const fetchFreeText = (filter, page, rows) => async (dispatch) => {
  dispatch(actions.setIsLoading(true))

  const {
    data: { data, total },
  } = await searchApi.getFreeText({
    ...denormalizeFilters(filter),
    page,
    rows
  })

  const modifiedData = !!data.length ?  replaceNullWithArray(data) : []

  dispatch(actions.setTotal(total))
  dispatch(actions.setList(modifiedData))
  dispatch(actions.setIsLoading(false))
}

export const fetchModels = (brand, category, status) => async (dispatch) => {
  const { data: fetchedModels } = await searchApi.getModels({
    brand,
    category,
    status,
  })

  dispatch(actions.setModels(fetchedModels))
}

export const fetchClientSubCategories = () => async (dispatch) => {
  const {
    data: fetchedSubcategories,
  } = await subCategoriesApi.listClientSubCategories()

  const normalizedSubCategoriesOptions = normalizeSubCategoriesOptions(
    fetchedSubcategories
  )

  dispatch(actions.setSubCategories(normalizedSubCategoriesOptions))
}

export const findAdvertiserSitesByClient = (clientId) => async (dispatch) => {
  const { data: fetchedSites } = await clientsApi.findAdvertiserSitesByClient(
    clientId
  )
  dispatch(actions.setSites(fetchedSites))
}

export const createAd = (ad) => async (dispatch) => {
  dispatch(actions.createMachineAd(ad))

  const {
    data: { id },
  } = await adsApi.createAd(ad)

  dispatch(actions.setMachineAd({ ...ad, id }))
}

export const deleteAd = (existingAd, machineId) => async (dispatch) => {
  dispatch(
    actions.deleteMachineAd({
      adId: existingAd.id,
      machineId,
    })
  )

  await adsApi.deleteAd(existingAd.id)
}

export const selectMachines = (id = []) => (dispatch) => {
  dispatch(actions.setSelectedMachines(id))
}

export const clearSelectedMachines = (id = []) => (dispatch) => {
  dispatch(actions.setClearSelectedMachines(id))
}
export const machinesPageCount = (count) => (dispatch) => {
  dispatch(actions.setMachinesPage(count))
}

export const scrollPosition = (scroll) => (dispatch) => {
  dispatch(actions.setMachinesPageScrollPosition(scroll))
}

export const updateMachineId = (id) => async (dispatch) => {
  dispatch(actions.setMachineId(id))
}

export const getUpdatedMachine = (id) => async (dispatch) => {
  const {
    data: { data },
  } = await machinesApi.getMachineItem(id)
  dispatch(actions.setUpdatedMachine(data[0]))
}

export const updateMachinesList = (machines) => (dispatch) => {
  const items = normalizeMachinesList(machines)
  dispatch(actions.setList(items))
}

export const getUserList = () => async (dispatch) => {
  const { data: fetchedUsers } = await usersApi.listUsers()
  dispatch(actions.setUsersList(fetchedUsers))
}

export const updateMachine = (input) => async (dispatch) => {
   await machinesApi.getMachine(input.id)
    .then(({ data}) => machinesApi.updateMachine({...data, ...input}))
    .then(({ data }) => dispatch(actions.setUpdatedMachine(data)))
}

export const cloneMachine = (ids, filter, newPage, MAX_MACHINES_PER_CALL) => async (dispatch) => {
  const promise = []
  ids.forEach((id) => promise.push(
    () => {
      return machinesApi.cloneMachine(id)
    }
  ))
  await Promise.all(promise.map((p) => p()))
    .then((res) => {
      dispatch(fetchMachines(filter, newPage, MAX_MACHINES_PER_CALL))
    })
}
