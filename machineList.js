import React, { useEffect, useState } from "react"
import ReactGA from "react-ga"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import MenuItem from "@material-ui/core/MenuItem"
import CheckCircle from "@material-ui/icons/CheckCircle"
import { useLastLocation } from "react-router-last-location"

import { translationsSelector } from "languages"
import { Text, Select, Button, IndeterminateSpinner } from "components"
import { clientSelector } from "authentication"
import { ArrowDropDownIcon } from "images"

import {
  fetchAndPushToMachines,
  fetchMachines,
  fetchFreeText,
  findAdvertiserSitesByClient,
  selectMachines,
  clearSelectedMachines,
  machinesPageCount,
  scrollPosition,
  getUpdatedMachine,
  updateMachinesList,
  getUserList,
  fetchedMachineStatusesList,
  cloneMachine,
} from "./actions"
import { FilterForm, MachineListItem } from "./components"
import {
  machineListSelector,
  isLoadingSelector,
  totalSelector,
  selectedMachinesSelector,
  machinesPageCountSelector,
  scrollPositionSelector,
  machineIdSelector,
  updatedMachineSelector,
  userListSelector,
  statusesListSelector,
} from "./selectors"

import {
  ListWrapper,
  ListTopBar,
  SortWrapper,
  Divider,
  ListBottomWrapper,
  SuccessMessage,
  FooterWrapper,
  Footer,
  FooterLeftSection,
  FooterRightSection,
  SelectWrapper,
  Actions,
} from "./styledComponents"

const MAX_MACHINES_PER_CALL = 30
const MAX_MACHINES = 120
const INITIAL_PAGE = 1
const INITIAL_FORM_VALUE = {
  category: [],
  brand: { brand: "" },
  model: { model: "" },
  status: [],
  vin: "",
}

export const MachineList = () => {
  const dispatch = useDispatch()
  const translations = useSelector(translationsSelector)
  const { state: locationState } = useLocation()
  const [filter, setFilter] = useState(INITIAL_FORM_VALUE)
  const [showActions, setShowActions] = useState(false)
  const [machineIds, setMachineIds] = useState([])
  const [checked, setChecked] = useState({})
  const client = useSelector(clientSelector)
  const machines = useSelector(machineListSelector)
  const usersList = useSelector(userListSelector)
  const machineId = useSelector(machineIdSelector)
  const statusOptions = useSelector(statusesListSelector)
  const updatedMachine = useSelector(updatedMachineSelector)
  const selectedMachinesId = useSelector(selectedMachinesSelector)
  const scrollPositon = useSelector(scrollPositionSelector)
  const total = useSelector(totalSelector)
  const isLoading = useSelector(isLoadingSelector)
  const pageCount = useSelector(machinesPageCountSelector)
  const history = useHistory()
  const location = useLocation()
  const lastLocation = useLastLocation()
  const isMaxMachines = machines.length >= MAX_MACHINES
  const showLoadMoreButton =
    !isLoading && !isMaxMachines && total > machines.length

  const handleFetchAndPushToMachines = () => {
    const newPage = pageCount + 1
    dispatch(machinesPageCount(newPage))
    if (!isLoading && !isMaxMachines) {
      dispatch(fetchAndPushToMachines(filter, newPage, MAX_MACHINES_PER_CALL))
    }
  }
  const resetPage = () => {
    dispatch(machinesPageCount(INITIAL_PAGE))
  }

  const clearSelection = () => {
    setMachineIds([])
    dispatch(clearSelectedMachines([]))
  }

  const createEmailOffer = () => {
    history.push("/email-offers/preview")
  }

  const generateQrCode = () => {
    history.push("/generate-QR-code")
  }

  const handleCloneMachine = () => {
    dispatch(
      cloneMachine(selectedMachinesId, filter, pageCount, MAX_MACHINES_PER_CALL)
    )
    setShowActions(!showActions)
    clearSelection()
  }

  const changeCheckbox = (id) => {
    ReactGA.event({
      category: "Machine list",
      action: "change checkbox",
    })
    if (!machineIds.length) {
      setMachineIds([id])
      setChecked({ [id]: true })
      dispatch(selectMachines([id]))
      return
    }
    let res = [...machineIds]
    const check = { ...checked }
    res.forEach((el) => {
      if (el === id) {
        delete check[id]
        res = res.filter((item) => item !== id)
      }
    })
    if (res.length === machineIds.length) {
      res.push(id)
    }
    setMachineIds(res)
    setChecked(check)
    dispatch(selectMachines(res))
  }

  const handleFilterOnChange = (newFilters, isDetailedSearch) => {
    ReactGA.event({
      category: "Machine list",
      action: "filter",
    })
    history.push({
      ...location,
      state: {
        ...locationState,
        showDeletedSuccessMessage: false,
      },
    })
    /*
      useEffect(..., [filter]) will not trigger if the user submits with the same filters
      again, therefor the search action must be run manually for this case
    */

    /*
      Code below is fetching data by calling initial API for show not filtered list
      without clearing filter values in form, it's removed so user will get same
      resaults on same filter search
    */

    // if (equals(filter, newFilters)) {
    //   dispatch(fetchMachines(filter, INITIAL_PAGE, MAX_MACHINES_PER_CALL))
    //   dispatch(findAdvertiserSitesByClient(client?.id))

    //   return
    // }

    dispatch(machinesPageCount(INITIAL_PAGE))

    if (isDetailedSearch) {
      dispatch(
        fetchMachines(
          newFilters,
          pageCount,
          MAX_MACHINES_PER_CALL,
          isDetailedSearch
        )
      )
    } else {
      dispatch(
        fetchFreeText(
          newFilters,
          pageCount,
          MAX_MACHINES_PER_CALL,
          isDetailedSearch
        )
      )
    }
    setFilter(newFilters)
  }

  useEffect(() => {
    // todo: fix this teporary fix.. how it happens?
    dispatch(getUserList())
    dispatch(fetchedMachineStatusesList(client?.id))
    if (!selectedMachinesId) return
    if (selectedMachinesId.length) setMachineIds(selectedMachinesId)
  }, [])

  useEffect(() => {
    const res = {}
    machineIds.forEach((el) => {
      res[el] = true
    })
    setChecked(res)
  }, [machineIds])

  useEffect(() => {
    if (lastLocation === null || !lastLocation.pathname.includes("/machines")) {
      dispatch(machinesPageCount(INITIAL_PAGE))
      dispatch(scrollPosition(0))
      dispatch(fetchMachines(filter, INITIAL_PAGE, MAX_MACHINES_PER_CALL))
    } else {
      dispatch(getUpdatedMachine(machineId))
      window.scrollTo(0, scrollPositon)
    }

    dispatch(findAdvertiserSitesByClient(client?.id))
  }, [filter, client?.id])

  const updateListItem = (updated) => {
    if (updated) {
      const list = machines.map((el) => {
        if (el.id === updated?.id) {
          return { ...el, ...updated }
        }
        return el
      })
      dispatch(updateMachinesList(list))
    }
  }

  useEffect(() => {
    updateListItem(updatedMachine)
  }, [updatedMachine])

  const getUser = (machine) => {
    if (usersList === undefined) return []
    const data = usersList.find((el) => el.id === machine.modifiedBy)
    return data
  }

  useEffect(() => {
    const unloadFunc = () => {
      dispatch(clearSelectedMachines([]))
      history.replace({
        ...location,
        state: {
          ...locationState,
          showDeletedSuccessMessage: false,
        },
      })
    }

    window.addEventListener("beforeunload", unloadFunc)

    return () => {
      window.removeEventListener("beforeunload", unloadFunc)
    }
  }, [history, location])

  return (
    <>
      <FilterForm
        onChange={handleFilterOnChange}
        client={client}
        resetPage={resetPage}
        isLoading={isLoading}
        initialValue={INITIAL_FORM_VALUE}
      />
      {locationState?.showDeletedSuccessMessage ? (
        <SuccessMessage>
          <CheckCircle />
          <Text lineHeight={19} variant="Body 2" color="success">
            {translations["The machine has been successfully deleted."]
              ?.value || "The machine has been successfully deleted."}
          </Text>
        </SuccessMessage>
      ) : null}
      <ListWrapper>
        <ListTopBar>
          <Text variant="H6" lineHeight={3.3}>
            {translations?.Displaying?.value || "Displaying "}
            {` ${machines.length} `}
            {translations["results of"]?.value || "results of "}
            {` ${total} `}
          </Text>
          <SortWrapper>
            <span>{translations["Sort by:"]?.value || "Sort by:"}</span>
            <Select
              onChange={() => {}}
              style={{ width: "230px" }}
              defaultValue="updated"
            >
              <MenuItem value="updated">
                {translations["Last updated"]?.value || "Last updated"}
              </MenuItem>
              <MenuItem value="updated">
                {translations["Last updated"]?.value || "Last updated"}
              </MenuItem>
            </Select>
          </SortWrapper>
        </ListTopBar>
        <Divider />
        {machines.map((machine) => (
          <div key={machine.id}>
            <MachineListItem
              machine={machine}
              clientId={client?.id}
              clientLocation={client?.location}
              primaryColor={client?.primaryColor}
              secondaryColor={client?.secondaryColor}
              changeCheckbox={changeCheckbox}
              checked={checked}
              updateList={updateListItem}
              user={getUser(machine)}
              statusOptions={statusOptions}
            />
            <Divider />
          </div>
        ))}
        {showLoadMoreButton && (
          <ListBottomWrapper>
            <Button
              color="primary"
              naked
              onClick={handleFetchAndPushToMachines}
            >
              {translations["Load more"]?.value || "Load more"}
            </Button>
          </ListBottomWrapper>
        )}
        <br />
        {isLoading && (
          <ListBottomWrapper>
            <IndeterminateSpinner />
          </ListBottomWrapper>
        )}
        {isMaxMachines && (
          <ListBottomWrapper>
            <Text>
              {translations[
                "Too many results. For more please use a more specific filter."
              ]?.value ||
                "Too many results. For more please use a more specific filter."}
            </Text>
          </ListBottomWrapper>
        )}
      </ListWrapper>
      {!!machineIds.length && (
        <FooterWrapper>
          <Footer>
            <FooterLeftSection>
              <Text>
                {machineIds.length}{" "}
                {translations["Machines selected"]?.value ||
                  "Machines selected"}
              </Text>
            </FooterLeftSection>
            <FooterRightSection>
              <Text onClick={clearSelection}>
                {translations["Clear selection"]?.value || "Clear selection"}
              </Text>
              <SelectWrapper>
                {showActions && (
                  <Actions>
                    <Text variant="Subtitle 1" onClick={handleCloneMachine}>
                      {translations?.Clone?.value || "Clone"}
                    </Text>
                    <Text variant="Subtitle 1" onClick={createEmailOffer}>
                      {translations["Create email offer"]?.value ||
                        "Create email offer"}
                    </Text>
                    <Text variant="Subtitle 1" onClick={generateQrCode}>
                      {translations["Generate QR code"]?.value ||
                        "Generate QR code"}
                    </Text>
                  </Actions>
                )}
                <Button naked onClick={() => setShowActions(!showActions)}>
                  <Text variant="Subtitle 3">
                    {translations.Actions?.value || "Actions"}
                  </Text>
                  <ArrowDropDownIcon />
                </Button>
              </SelectWrapper>
            </FooterRightSection>
          </Footer>
        </FooterWrapper>
      )}
    </>
  )
}
