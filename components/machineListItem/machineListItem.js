/* eslint-disable no-magic-numbers */
import React, { useEffect, useState } from "react"
import ReactGA from "react-ga"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { Storage } from "aws-amplify"
import { useHistory } from "react-router-dom"
import { isEmpty } from "ramda"

import { Text } from "components"
import { translationsSelector } from "languages"
import { MachinePlaceholder } from "images"
import { CONSTANTS } from "config"

import { currenciesSelector } from "components/structures/header/selector"

import { sitesSelector, updatedMachineSelector } from "../../selectors"
import {
  createAd,
  deleteAd,
  getUpdatedMachine,
  scrollPosition,
  updateMachineId,
  updateMachine,
} from "../../actions"

import { machinesApi } from "../../../../../../api"

import { templates } from "./templates"
import { Image, ImageLabel } from "./styledComponents"

const initialPictureState = {}
const DEFAULT_CURRENCY_SYMBOL = "€"

export const MachineListItem = (props) => {
  const {
    machine,
    clientId,
    clientLocation,
    primaryColor,
    secondaryColor,
    changeCheckbox,
    updateList,
    checked,
    user,
    statusOptions,
  } = props
  const dispatch = useDispatch()
  const translations = useSelector(translationsSelector)
  const [navigate, setNavigate] = useState(false)
  const sites = useSelector(sitesSelector)
  const currencies = useSelector(currenciesSelector)
  const updatedMachine = useSelector(updatedMachineSelector)
  const [picture, setPicture] = useState(initialPictureState)
  const [machineItem, setMachineItem] = useState(machine)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const showImageLabel = machine.pictures.length > 1
  const coverImage = machine.pictures.find(
    ({ orderNr, isPrivate }) => orderNr === 1 && !isPrivate
  )?.thumbnail

  const getPicture = async () => {
    if (coverImage) {
      const newPicture = {}
      newPicture.s3Image = await Storage.get(coverImage)
      setPicture(newPicture)
    } else {
      setPicture(initialPictureState)
    }
  }

  const renderImage = ({ s3Image }) =>
    s3Image ? (
      <Image s3Image={s3Image}>
        {showImageLabel && (
          <ImageLabel>
            <Text variant="Body 2">+{machine.pictures.length - 1}</Text>
          </ImageLabel>
        )}
      </Image>
    ) : (
      <MachinePlaceholder />
    )

  const getMatchingAd = (site) =>
    machine.ads.find(({ siteCode }) => siteCode === site)
  const getAdUrl = (site) => getMatchingAd(site)?.url || "#"
  const getIcon = (site) => {
    const ad = getMatchingAd(site)
    if (ad?.url) {
      return CONSTANTS.AD_STATUSES.ACTIVE
    }
    if (ad && !ad.url) {
      return CONSTANTS.AD_STATUSES.LOADING
    }

    return CONSTANTS.AD_STATUSES.INACTIVE
  }

  const handleAdStatusClick = async () => {
    ReactGA.event({
      category: "Machine list item",
      action: "check status ads",
    })
    const a = await machinesApi.statusAd(machine.id)
    let message = a.data.genericMessage
    if (a.data.siteMessages.length > 0) {
      a.data.siteMessages.forEach((m) => {
        message += `* ${m.siteName}: ${m.siteMessage}\n`
      })
    }
    alert(message)
  }
  const updateData = () => {
    dispatch(getUpdatedMachine(machine.id))
    updateList(updatedMachine)
  }

  const handlePortalActionClick = (siteCode) => {
    ReactGA.event({
      category: "Machine list item",
      action: "portal button click",
    })
    const existingAd = getMatchingAd(siteCode)

    if (existingAd) {
      dispatch(deleteAd(existingAd, machine.id))
    } else {
      dispatch(
        createAd({
          clientID: clientId,
          machineID: machine.id,
          siteCode,
          id: existingAd?.id,
        })
      )
      setTimeout(() => {
        updateData()
      }, 60000)
    }
  }

  const changeScrollPosition = (position) => {
    dispatch(updateMachineId(machine.id))
    dispatch(scrollPosition(position))
    setNavigate(true)
    if (isLoading) history.push(`machines/${machine.id}`)
  }

  const handleFieldOnChange = async ({ name, value }) => {
    ReactGA.event({
      category: "Machine list item",
      action: `update: ${name}`,
    })
    setIsLoading(false)
    const input = {
      [name]: value,
      modifiedBy: user?.id,
      id: machine.id,
    }
    setMachineItem((prev) => ({
      ...prev,
      [name]: value,
    }))
    dispatch(updateMachine(input)).then(() => setIsLoading(true))
  }

  useEffect(async () => {
    await getPicture()
    if (!isEmpty(machine)) {
      const currentCurrency = currencies.find(
        ({ id }) => id === +machine?.currencyId
      )
      setMachineItem({
        ...machine,
        symbol: currentCurrency?.symbol ?? DEFAULT_CURRENCY_SYMBOL,
      })
    }
  }, [machine])

  useEffect(() => {
    if (isLoading && navigate) {
      history.push(`machines/${machine.id}`)
    }
  }, [navigate, isLoading])

  const templateProps = {
    translations,
    machineItem,
    sites,
    renderImage,
    getAdUrl,
    getIcon,
    handlePortalActionClick,
    handleAdStatusClick,
    primaryColor,
    secondaryColor,
    changeCheckbox,
    checked,
    picture,
    location: machine.location ? machine.location : clientLocation,
    changeScrollPosition,
    user,
    statusOptions,
    handleFieldOnChange,
  }

  return templates[machine.templateName](templateProps)
}
MachineListItem.defaultProps = {
  user: null,
}

MachineListItem.propTypes = {
  machine: PropTypes.shape({
    id: PropTypes.string,
    clientID: PropTypes.string,
    vinCode: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    status: PropTypes.string,
    coverImage: PropTypes.string,
    salesPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pictures: PropTypes.arrayOf(PropTypes.object),
    ads: PropTypes.arrayOf(PropTypes.object),
    category: PropTypes.string,
    mid: PropTypes.string,
  }).isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  clientId: PropTypes.string.isRequired,
}
