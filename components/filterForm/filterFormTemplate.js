import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { equals } from "ramda"

import { translationsSelector } from "languages"
import { Select, InputLabel, TextField, Text } from "components"
import { CONSTANTS } from "config"

import {
  statusesSelector,
  subCategoriesSelector,
  brandsSelector,
  modelsSelector,
} from "../../selectors"
import { fetchBrands, fetchModels } from "../../actions"
import { actions } from "../../store"

import {
  CheckedCheckBox,
  UnCheckedCheckBox,
  SelectMenuItem,
  SelectMenuItemToggleException,
  StyledFormTextControl,
  StyledFormSelectControl,
} from "./styledComponents"

/*
  ALL_ITEMS_SELECTED is a workaround to get the Select component to work as intended
  finding a better solution is recommended
 */
const ALL_ITEMS_SELECTED = "ALL_ITEMS_SELECTED"
const FIELD = {
  SEARCH: "search",
  BRAND: "brand",
  MODEL: "model",
  CATEGORY: "category",
  STATUS: "status",
  FREE_TEXT: "text",
}
export const FilterFormTemplate = ({
  initialValue,
  isDetailedSearch,
  handleChange,
  handleSubmit,
  values,
  setFieldValue,
}) => {
  const dispatch = useDispatch()
  const translations = useSelector(translationsSelector)
  const statusOptions = useSelector(statusesSelector)
  const subCategoryOptions = useSelector(subCategoriesSelector)

  const brands = useSelector(brandsSelector)
  const models = useSelector(modelsSelector)

  const checkIsAllSelected = (value1, value2, exception) =>
    [
      ...value1.filter(
        (item) => item !== ALL_ITEMS_SELECTED && item !== exception
      ),
      ...value2,
    ].filter(
      (item, index, currentArr) =>
        currentArr.lastIndexOf(item) === currentArr.indexOf(item)
    ).length === 0

  const handleSelectWithToggleAllOnChange = (event, allItems, exception) => {
    const {
      target: { value, name },
    } = event
    const currentFieldValue = values[name]

    if (value.includes(ALL_ITEMS_SELECTED)) {
      if (name === FIELD.CATEGORY) {
        dispatch(fetchBrands([], values.status))
      }

      if (checkIsAllSelected(currentFieldValue, allItems, exception)) {
        if (currentFieldValue.includes(exception)) {
          setFieldValue(name, [exception])

          return
        }

        setFieldValue(name, [])

        return
      }

      if (currentFieldValue.includes(exception)) {
        setFieldValue(name, [...allItems, exception])

        return
      }

      setFieldValue(name, allItems)

      return
    }

    if (name === FIELD.CATEGORY) {
      dispatch(fetchBrands(value, values.status))
    }

    handleChange(event)
    handleSubmit()
  }

  const handleAutocompleteOnChange = (value, name) => {
    if (name === FIELD.BRAND) {
      setFieldValue(FIELD.MODEL, initialValue.model)
      dispatch(fetchModels(value.brand))
    }

    setFieldValue(name, value)
  }

  const handleAutocompleteCustomOnChange = (event) => {
    if (event.target.name === FIELD.BRAND) {
      dispatch(actions.setModels([]))
    }

    return setFieldValue(event.target.name, {
      [event.target.name]: event.target.value,
    })
  }

  const handleFreeTextOnChange = (name, e) => {
    const { value } = e.target
    dispatch(actions.setFreeText(value))
    setFieldValue(name, value)
  }

  useEffect(() => {
    const event = {
      target: { name: FIELD.STATUS, value: ALL_ITEMS_SELECTED },
    }
    handleSelectWithToggleAllOnChange(
      event,
      statusOptions,
      CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
    )
  }, [statusOptions])

  return (
    <>
      {isDetailedSearch ? (
        <>
          <StyledFormSelectControl>
            <InputLabel
              staticPadding
              disableAnimation
              shrink={false}
              id="category-label"
            >
              {translations.Category?.value || "Category"}
            </InputLabel>
            <Select
              multiple
              name={FIELD.CATEGORY}
              labelId="category-label"
              onChange={(event) =>
                handleSelectWithToggleAllOnChange(event, subCategoryOptions)
              }
              value={values.category}
              renderValue={() => null}
            >
              <SelectMenuItem value={ALL_ITEMS_SELECTED}>
                {checkIsAllSelected(values.category, subCategoryOptions) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                <Text variant="Subtitle 1">
                  {translations["All categories"]?.value || "All categories"}
                </Text>
              </SelectMenuItem>
              {subCategoryOptions.map((category) => {
                const isSelected = values.category.includes(category)

                return (
                  <SelectMenuItem indented key={category} value={category}>
                    {isSelected ? <CheckedCheckBox /> : <UnCheckedCheckBox />}
                    <Text variant="Subtitle 1">
                      {translations[category]?.value || category}
                    </Text>
                  </SelectMenuItem>
                )
              })}
            </Select>
          </StyledFormSelectControl>
          <StyledFormSelectControl>
            <Autocomplete
              name={FIELD.BRAND}
              filterSelectedOptions
              options={[...brands, values.brand].filter(({ brand }) =>
                brand.toLowerCase().includes(values.brand.brand.toLowerCase())
              )}
              value={values.brand}
              disableClearable
              onChange={(_, brand) =>
                handleAutocompleteOnChange(brand, "brand")
              }
              inputValue={values.brand?.brand}
              getOptionSelected={(option, value) => equals(option, value)}
              getOptionLabel={({ brand, items }) => {
                if (items) {
                  return `${brand} (${items})`
                }

                return brand
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={FIELD.BRAND}
                  label={translations.Brand?.value || "Brand"}
                  forAutoComplete
                  onChange={handleAutocompleteCustomOnChange}
                />
              )}
            />
          </StyledFormSelectControl>
          <StyledFormSelectControl>
            <Autocomplete
              name={FIELD.MODEL}
              filterSelectedOptions
              options={[...models, values.model].filter(({ model }) =>
                model.toLowerCase().includes(values.model.model.toLowerCase())
              )}
              value={values.model}
              disableClearable
              onChange={(_, model) =>
                handleAutocompleteOnChange(model, "model")
              }
              inputValue={values.model?.model}
              getOptionSelected={(option, value) => equals(option, value)}
              getOptionLabel={({ model, items }) => {
                if (items) {
                  return `${model} (${items})`
                }

                return model
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={FIELD.MODEL}
                  label={translations.Model?.value || "Model"}
                  forAutoComplete
                  onChange={handleAutocompleteCustomOnChange}
                />
              )}
            />
          </StyledFormSelectControl>
          <StyledFormSelectControl>
            <InputLabel
              staticPadding
              disableAnimation
              shrink={false}
              id="status-label"
            >
              {translations.Status?.value || "Status"}
            </InputLabel>
            <Select
              multiple
              name={FIELD.STATUS}
              labelId="status-label"
              value={values[FIELD.STATUS]}
              onChange={(event) =>
                handleSelectWithToggleAllOnChange(
                  event,
                  statusOptions,
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                )
              }
              renderValue={() => null}
            >
              <SelectMenuItem value={ALL_ITEMS_SELECTED}>
                {checkIsAllSelected(
                  values.status,
                  statusOptions,
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                ) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                <Text variant="Subtitle 1">
                  {translations["All Statuses"]?.value || "All Statuses"}
                </Text>
              </SelectMenuItem>
              {statusOptions.map((status) => {
                const isSelected = values.status.includes(status)

                return (
                  <SelectMenuItem indented key={status} value={status}>
                    {isSelected ? <CheckedCheckBox /> : <UnCheckedCheckBox />}
                    {translations[status]?.value || status}
                  </SelectMenuItem>
                )
              })}
              <SelectMenuItemToggleException
                indented
                key={CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
                value={CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
              >
                {values.status.includes(
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                ) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                {CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
              </SelectMenuItemToggleException>
            </Select>
          </StyledFormSelectControl>
          <StyledFormTextControl>
            <TextField
              name="vin"
              label={translations["VIN code"]?.value || "VIN code"}
              onChange={handleChange}
              value={values.vin}
            />
          </StyledFormTextControl>
        </>
      ) : (
        <>
          <StyledFormTextControl style={{ width: "200%" }}>
            <TextField
              name={FIELD.FREE_TEXT}
              label={
                translations["Brand, Model, VIN"]?.value || "Brand, Model, VIN"
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
              onChange={(e) => handleFreeTextOnChange(FIELD.FREE_TEXT, e)}
            />
          </StyledFormTextControl>
          <StyledFormSelectControl>
            <InputLabel
              staticPadding
              disableAnimation
              shrink={false}
              id="category-label"
            >
              {translations.Category?.value || "Category"}
            </InputLabel>
            <Select
              multiple
              name={FIELD.CATEGORY}
              labelId="category-label"
              onChange={(event) =>
                handleSelectWithToggleAllOnChange(event, subCategoryOptions)
              }
              value={values.category}
              renderValue={() => null}
            >
              <SelectMenuItem value={ALL_ITEMS_SELECTED}>
                {checkIsAllSelected(values.category, subCategoryOptions) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                <Text variant="Subtitle 1">
                  {translations["All categories"]?.value || "All categories"}
                </Text>
              </SelectMenuItem>
              {subCategoryOptions.map((category) => {
                const isSelected = values.category.includes(category)

                return (
                  <SelectMenuItem indented key={category} value={category}>
                    {isSelected ? <CheckedCheckBox /> : <UnCheckedCheckBox />}
                    <Text variant="Subtitle 1">
                      {translations[category]?.value || category}
                    </Text>
                  </SelectMenuItem>
                )
              })}
            </Select>
          </StyledFormSelectControl>
          <StyledFormSelectControl>
            <InputLabel
              staticPadding
              disableAnimation
              shrink={false}
              id="status-label"
            >
              {translations.Status?.value || "Status"}
            </InputLabel>
            <Select
              multiple
              name={FIELD.STATUS}
              labelId="status-label"
              value={values[FIELD.STATUS]}
              onChange={(event) =>
                handleSelectWithToggleAllOnChange(
                  event,
                  statusOptions,
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                )
              }
              renderValue={() => null}
            >
              <SelectMenuItem value={ALL_ITEMS_SELECTED}>
                {checkIsAllSelected(
                  values.status,
                  statusOptions,
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                ) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                <Text variant="Subtitle 1">
                  {translations["All Statuses"]?.value || "All Statuses"}
                </Text>
              </SelectMenuItem>
              {statusOptions.map((status) => {
                const isSelected = values.status.includes(status)

                return (
                  <SelectMenuItem indented key={status} value={status}>
                    {isSelected ? <CheckedCheckBox /> : <UnCheckedCheckBox />}
                    {translations[status]?.value || status}
                  </SelectMenuItem>
                )
              })}
              <SelectMenuItemToggleException
                indented
                key={CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
                value={CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
              >
                {values.status.includes(
                  CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION
                ) ? (
                  <CheckedCheckBox />
                ) : (
                  <UnCheckedCheckBox />
                )}
                {CONSTANTS.MACHINE_LIST.STATUS_TOGGLE_ALL_EXCEPTION}
              </SelectMenuItemToggleException>
            </Select>
          </StyledFormSelectControl>
        </>
      )}
    </>
  )
}

FilterFormTemplate.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
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
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.shape({
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
    category: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,

  isLoading: PropTypes.bool.isRequired,
  isDetailedSearch: PropTypes.bool.isRequired,
}
