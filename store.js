/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  machinesList: [],
  total: 0,
  isLoading: false,
  updatedMachine: null,
  machineId: null,
  statuses: [],
  statusesList: [],
  subCategories: [],
  machine: null,
  sites: [],
  brands: [],
  models: [],
  freeText: "",
  selectedMachines: [],
  page: 1,
  scrollPosition: 0,
  usersList: [],
}

export const { reducer, actions } = createSlice({
  name: "machineList",
  initialState,
  reducers: {
    setList: (state, { payload }) => {
      state.machinesList = payload
    },
    setTotal: (state, { payload }) => {
      state.total = payload
    },
    setBrands: (state, { payload }) => {
      state.brands = payload
    },
    setFreeText: (state, { payload }) => {
      state.freeText = payload
    },
    setModels: (state, { payload }) => {
      state.models = payload
    },
    pushList: (state, { payload }) => {
      state.machinesList = [...state.machinesList, ...payload]
    },
    setMachinesPage: (state, { payload }) => {
      state.page = payload
    },
    createMachineAd: (state, { payload }) => {
      state.machinesList = state.machinesList.map((machine) => {
        if (machine.id === payload.machineID) {
          return {
            ...machine,
            ads: [...machine.ads, payload],
          }
        }

        return machine
      })
    },
    setMachineAd: (state, { payload }) => {
      state.machinesList = state.machinesList.map((machine) => {
        if (machine.id === payload.machineID) {
          return {
            ...machine,
            ads: [
              ...machine.ads.map((ad) =>
                ad.siteCode === payload.siteCode ? payload : ad
              ),
            ],
          }
        }

        return machine
      })
    },
    deleteMachineAd: (state, { payload: { adId, machineId } }) => {
      state.machinesList = state.machinesList.map((machine) => {
        if (machine.id === machineId) {
          return {
            ...machine,
            ads: [...machine.ads.filter(({ id }) => id !== adId)],
          }
        }

        return machine
      })
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload
    },
    setStatuses: (state, { payload }) => {
      state.statuses = payload
    },
    setStatusesList: (state, { payload }) => {
      state.statusesList = payload
    },
    setSubCategories: (state, { payload }) => {
      state.subCategories = payload
    },
    setSites: (state, { payload }) => {
      state.sites = payload
    },
    setSelectedMachines: (state, { payload }) => {
      state.selectedMachines = payload
    },
    setClearSelectedMachines: (state) => {
      state.selectedMachines = []
    },
    setMachinesPageScrollPosition: (state, { payload }) => {
      state.scrollPosition = payload
    },
    setMachineId: (state, { payload }) => {
      state.machineId = payload
    },
    setUpdatedMachine: (state, { payload }) => {
      state.updatedMachine = payload
    },
    setUsersList: (state, { payload }) => {
      state.usersList = payload
    },
    setMachine: (state, { payload }) => {
      state.machine = payload
    },
    reset: () => initialState,
  },
})
