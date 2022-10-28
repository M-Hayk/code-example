import React, { useState, useRef, useEffect } from "react"
import ReactGA from "react-ga"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Grow from "@material-ui/core/Grow"
import Paper from "@material-ui/core/Paper"
import MenuItem from "@material-ui/core/MenuItem"
import MenuList from "@material-ui/core/MenuList"

import { translationsSelector } from "languages"

import {
  fetchMachineStatuses,
  fetchClientSubCategories,
  fetchBrands,
  fetchModels,
} from "../../actions"

import { FilterFormTemplate } from "./filterFormTemplate"

import {
  Form,
  Wrapper,
  StyledSearchButton,
  StyledSearchMenu,
  StyledPopper,
  ButtonGroupWrapper,
} from "./styledComponents"

const options = ["Search", "Detailed search"]

export const FilterForm = (props) => {
  const translations = useSelector(translationsSelector)
  const { onChange, resetPage, initialValue, client } = props

  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dispatch = useDispatch()

  const { handleSubmit, handleChange, values, setFieldValue, resetForm } =
    useFormik({
      initialValues: initialValue,
      onSubmit: (valuesToSubmit) => {
        resetPage()
        ReactGA.event({
          category: "Machine list search section",
          action: `search`,
        })
        onChange(valuesToSubmit, options[selectedIndex] === "Detailed search")
      },
    })

  const handleMenuItemClick = (event, index) => {
    ReactGA.event({
      category: "Machine list search section",
      action: `selected search view: ${options[index]}`,
    })
    setSelectedIndex(index)
    resetForm()
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchClientSubCategories())
    dispatch(fetchBrands())
    dispatch(fetchModels())
    dispatch(fetchMachineStatuses(client?.id))
  }, [])

  return (
    <Wrapper>
      <Form onSubmit={(event) => event.preventDefault()}>
        <FilterFormTemplate
          {...props}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          values={values}
          setFieldValue={setFieldValue}
          isDetailedSearch={options[selectedIndex] === "Detailed search"}
        />
        <ButtonGroupWrapper
          secondary={client?.secondaryColor}
          primary={client?.primaryColor}
        >
          <ButtonGroup
            style={{
              width:
                options[selectedIndex] === "Detailed search" ? "120%" : "80%",
            }}
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <StyledSearchButton onClick={handleSubmit}>
              {translations[options[selectedIndex]]?.value ||
                options[selectedIndex]}
            </StyledSearchButton>
            <StyledSearchMenu
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </StyledSearchMenu>
          </ButtonGroup>
        </ButtonGroupWrapper>
        <StyledPopper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {translations?.[option]?.value || option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </StyledPopper>
      </Form>
    </Wrapper>
  )
}

FilterForm.defaultProps = {
  client: {
    primaryColor: null,
    secondaryColor: null,
    id: null,
  },
}

FilterForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  resetPage: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    brand: PropTypes.shape({
      brand: PropTypes.string,
      items: PropTypes.number,
    }),
    model: PropTypes.shape({
      model: PropTypes.string,
      items: PropTypes.number,
    }),
    status: PropTypes.arrayOf(PropTypes.string),
    vin: PropTypes.string,
  }).isRequired,
  client: PropTypes.shape({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    id: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
}
